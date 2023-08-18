"use strict";
const LIST_TABLE = "sys_list";
const LIST_CATEGORIES_TABLE = "sys_listCategories";
const USER_APP_STATE_TABLE = "sys_userAppState";
const ENTITY_ATTACHMENT_TABLE = "sys_entityAttachment";

const provider = require("../lib/rethinkdbProvider");
const activityModel = require("./activityModel")({});
const r = provider.r; // reference to rething connection/db
const moment = require("moment-timezone");
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/listModel.js");
const userPolicyCache = new (require("../lib/userPolicyCache"));
const feedModel = require("../models/feedModel")();
const listCategoryModel = require("../models/listCategoryModel")();
const { authExclusionCheck } = require("../lib/authExclusionFilter.js");

const _global = require("../app-global.js");

module.exports = listModel;

function listModel(options) {
	if (!(this instanceof listModel)) return new listModel(options);
	const self = this;
	self.options = options;
}

//Function to help find the added/deleted rows in a list update
const findDifferenceOfArrayOfObjects = (otherArray) => {
	return (currentObject) => {
		return otherArray.filter(object => {
			return object.data.item === currentObject.data.item;
		}).length === 0;
	};
};

//Find the rows that have actually been updated in a list update
const findRowUpdates = (list, rows) => {
	//find the row(s) the update pertains to
	const updates = {};
	list.rows.forEach(row => {
		//find corresponding row in updated rows
		const correspondingRow = rows.find(updatedRow => updatedRow.order === row.order);
		Object.keys(row.data).map(key => {
			//find the updates
			if (row.data[key] && row.data[key].id ? row.data[key].id !== correspondingRow.data[key].id : row.data[key] !== correspondingRow.data[key]) {
				//add to update object [row name]: {[columnHeader]: {type: [column type], update: [corresponding row.data[key]]}}
				let type = "";
				let includeTime = false;
				// we need the column type to know what activity message to create for the particular update
				list.columns.some(column => {
					if (column.id === key) {
						type = column.type;
						if (type === "date-time") {
							includeTime = column.includeTime;
						}
					}
					return column.id === key;
				});
				// save the updated data to an object which will be returned
				updates[row.data.item] ? updates[row.data.item][key] = {
					type,
					includeTime, //for date-time acitivity messages
					update: correspondingRow.data[key]
				} : updates[row.data.item] = {
					[key]: {
						type,
						includeTime, //for date-time acitivity messages
						update: correspondingRow.data[key]
					}
				};
			}

		});
	});
	return updates;
};

// The message will depend on amount of rows updated and the column type of the update
const generateActivityMessageForRowUpdate = (user, rowName, rowUpdate, timezone) => {
	let message = `${user} `;
	let newRowName = rowName;
	//If the row was renamed, put that activity first in the message and use the new row name for the rest of the updates
	if (Object.keys(rowUpdate).includes("item")) {
		newRowName = rowUpdate["item"].update;
		message += `renamed '${rowName}' to '${rowUpdate["item"].update}'`;
	}
	Object.keys(rowUpdate).forEach((column, index) => {
		message += index === Object.keys(rowUpdate).length - 1 && index > 0 ? " and " : index > 0 ? ", " : "";
		// If the user is not renaming the row

		if (column !== "item") {
			switch (rowUpdate[column].type.toLowerCase()) {
				case "date-time": {
					message += `changed ${column} for ${newRowName} to '${moment.tz(rowUpdate[column].update, timezone ? timezone : "America / New_York").format(rowUpdate[column].includeTime ? "MM/DD/YYYY hh:mm A z" : "MM/DD/YYYY A z")}'`;
					break;
				}
				case "text":
				case "lookup":
					message += `changed ${column} for ${newRowName} to '${rowUpdate[column].update.name ? rowUpdate[column].update.name : rowUpdate[column].update}'`;
					break;
				case "checkbox":
					message += `${rowUpdate[column].update ? "checked" : "unchecked"} ${column} for ${newRowName}`;
					break;
				case "notes":
					message += `modified ${column} for ${newRowName}`;
					break;
				case "choice":
					message += `chose '${rowUpdate[column].update}' under ${column} for ${newRowName}`;
					break;
				default:
					message += `changed ${column} for ${newRowName}`;
					break;
			}
		}
	});
	message += ".";
	return message;
};

const generatListUpdateActivities = async function (userId, list, updates, event, timezone) {
	const activity = {
		summary: "",
		type: "updated",
		actor: activityModel.generateObject("user", userId),
		target: activityModel.generateObject(
			event ? "event" : "list",
			event ? event.id : list.id,
			event ? event.name : list.name
		),
		to: []
	};
	if (event) {
		activity.object = activityModel.generateObject(
			"list",
			list.id,
			list.name,
			list.feedId
		);
	}
	const orignialListRows = list.rows ? list.rows : [];
	const newListRows = updates.rows ? updates.rows : [];
	// Find if a rows have been removed/added
	if (newListRows.length !== orignialListRows.length) {
		const addedOrDeleted = newListRows.length < orignialListRows.length ? "deleted" : "added";
		const differences = orignialListRows.filter(findDifferenceOfArrayOfObjects(newListRows)).concat(newListRows.filter(findDifferenceOfArrayOfObjects(orignialListRows)));
		const rowNames = differences.map((row, index) => index === differences.length - 1 && index > 0 ? ` and '${row.data.item}'` : index > 0 ? `, '${row.data.item}'` : `'${row.data.item}'`);
		activity.summary = `${activity.actor.name} ${addedOrDeleted} row${differences.length > 1 ? "s" : ""} ${rowNames} ${addedOrDeleted === "added" ? "to" : "from"} ${list.name}.`;
		// At the time of writing, users can send an update without changing anything, so we have to make sure row changes actually occured before queueing the activity
		activityModel.queueActivity(activity);
	} else {
		// At the time of writing, all rows are sent over in a list update whether the row iself was updated or not so we need to find which rows were atually updated.
		const updatedRows = findRowUpdates(list, updates.rows);
		// Generate the activity message after figuring out the actual updates
		Object.keys(updatedRows).forEach(rowName => {
			activity.summary = generateActivityMessageForRowUpdate(activity.actor.name, rowName, updatedRows[rowName], timezone);
		});
		// At the time of writing, users can send an update without changing anything, so we have to make sure row changes actually occured before queueing the activity
		if (Object.keys(updatedRows).length) {
			activityModel.queueActivity(activity);
		}

	}


};
/**
 * Get all 'original' lists for use in the Lists App
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 */
listModel.prototype.getAllOriginal = async function (userId, orgId) {
	try {
		const filter = r.and(
			r.row("deleted").default(false).eq(false),
			r.row("targetId").eq(null),
			r.row("targetType").eq(null)
		);
		const lists = await feedModel.getEntitiesByTypeWithAuthorization(userId, "list", true, null, true, filter);
		const listCategories = await listCategoryModel._internalGetAll(userId, orgId);

		// -- merge listCategory data into list
		lists.forEach(list => {
			if (list.category) {
				const listCategory = listCategories.find(cat => cat.id === list.category);
				if (listCategory) {
					list.categoryRef = listCategory;
				}
			}
		});

		logger.info("getAllOriginal", "Fetched result", { result: lists });
		return lists;
	}
	catch (err) {
		logger.error(
			"getAllOriginal",
			"An error occurred while getting all lists",
			{ err: { message: err.message, code: err.code } }
		);
		throw err;
	}
};

/**
 * Get any list by its id
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {string} listId -- List's id
 */
listModel.prototype.getById = async function (userId, orgId, listId) {
	try {
		// Test that user has not excluded list
		await authExclusionCheck(userId, listId, {
			"message": "Requester does not have access to list",
			"code": 406
		});

		// -- todo: ENTITY_AUTH should we let auth exclusion check be handled in getEntityCall - Yes with a flag to include exclusions or not
		const entity = await feedModel.getEntityWithAuthorization(userId, listId, "list");

		if (entity) {
			return entity;
		} else {
			return {
				"message": "List not found or requester does not have access",
				"code": 403
			};
		}
	} catch (err) {
		logger.error(
			"getById",
			"An error occurred while attempting to query for a list by id",
			{ err: err }
		);
		throw err;
	}

};

/**
 *  Get lists by targetId
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {string} listId -- List's id
 */
listModel.prototype.getByTargetId = async function (userId, orgId, targetId) {
	try {
		const filter = r.row("targetId").eq(targetId);
		const result = await feedModel.getEntitiesByTypeWithAuthorization(userId, "list", true, null, true, filter);
		return result;
	}
	catch (err) {
		logger.error("getByTargetId", "There was an error retrieving lists by the target ID.", {
			err: { message: err.message, stack: err.stack }
		});
		throw { message: err.message, code: 500 };
	}
};


// -- INTERNAL USE ONLY - DO NOT CREATE PUBLIC INTERFACE
listModel.prototype._internalGetByTargetId = async function (targetId) {
	try {
		const result = await r
			.table(LIST_TABLE)
			.filter({ deleted: false })
			.filter(
				r.row("targetId").eq(targetId)
			);
		return result;
	} catch (err) {
		logger.error("_internalGetByTargetId", "There was an error retrieving lists by the target ID.", {
			err: { message: err.message, stack: err.stack }
		});
	}
};


/**
 * Create a list in the Lists App
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {object} list -- List object: {title: string, category: string || null, "columns": array, "rows": array}
 */
listModel.prototype.create = async function (userId, orgId, list) {
	try {

		const listsFeedId = `${orgId}_lists`;
		if (!userPolicyCache.authorizeFeedAccess(userId, listsFeedId, userPolicyCache.feedPermissionTypes.manage)) {
			throw { message: "Access Denied", code: 403 };
		}

		let errMsg = null;

		if (!list.name) {
			errMsg = "Lists must have a name.";
		} else if (!list.columns) {
			errMsg = "Lists must have at least one column.";
		}

		// If err message, bail out early
		if (errMsg) {
			throw {
				"message": errMsg,
				"code": 400
			};
		}

		// Ensure there is one, and only one, required column in the incoming list data
		let requiredColCount = 0;
		if (list.columns) {
			list.columns.forEach(col => {
				if (col.hasOwnProperty("required")) {
					requiredColCount += 1;
				}
			});
		}

		// If no required col, or multiple required col, throw error messages
		if (requiredColCount !== 1) {
			throw {
				"message": "Lists must have a single 'required' column. Please verify list data.",
				"code": 400
			};
		} else {
			// Adding properties to list object
			list.entityType = "list";
			list.createdDate = new Date();
			list.lastModifiedDate = new Date();
			list.deleted = false;
			list.isPublic = true;
			list.owner = userId;
			list.ownerOrg = orgId;
			list.targetId = null;
			list.targetType = null;
			list.feedId = listsFeedId;
			/* 
			 * name comes from list arg
			 * category comes from list arg
			 * columns comes from list arg
			 * rows comes from list arg
			 */

			const result = await r
				.table(LIST_TABLE)
				.insert(list, { returnChanges: true })
				.run();

			if (result) {
				if (_global.globalChangefeed) {
					if (result.changes && result.changes[0]) {
						const change = {
							new_val: result.changes[0].new_val,
							old_val: result.changes[0].old_val,
							rt: true
						};
						_global.globalChangefeed.publish(change);
					}
				}

				return result;
			} else {
				throw {
					"message": "Problem creating list.",
					"code": 500
				};
			}
		}

	}
	catch (err) {
		return err;
	}
};

/**
 * Delete a list
 * @param {string} userId -- User's id
 * @param {string} listId -- List's id
 */
listModel.prototype.delete = async function (userId, orgId, listId, eventCheck) {
	try {

		const list = await feedModel.getEntityWithAuthorization(userId, listId, "list", userPolicyCache.feedPermissionTypes.manage);
		if (!list) {
			throw new Error("error: User does not have access to edit the list");
		}

		if (
			!list.deleted
			|| (list.targetId && eventCheck)
		) {
			const time = new Date();
			const update = {
				deleted: true,
				lastModifiedDate: time
			};

			const updateQuery = await r
				.table(LIST_TABLE)
				.get(listId)
				.update(update, { returnChanges: true });

			const updateAppStateQuery = await r
				.table(USER_APP_STATE_TABLE)
				.filter({ "appId": "lists-app", "user": userId })(0)
				.replace(
					r.row.without({ "state": { "pinnedLists": r.object(listId, true) } })
				);
			try {
				const result = await r.expr([
					updateQuery,
					updateAppStateQuery
				]).run();
				if (_global.globalChangefeed) {
					if (result[0]) {
						const { changes } = result[0];
						if (changes && changes[0]) {
							const change = {
								new_val: changes[0].new_val,
								old_val: changes[0].old_val,
								rt: true
							};
							_global.globalChangefeed.publish(change);
						}
					}
				}

				return result;
			} catch (err) {
				console.log("Delete original list error:", err);
				throw err;
			}
		} else {
			throw { "message": "Error deleting list.", "code": 404 };
		}
	}
	catch (err) {
		return err;
	}
};

/**
 * Update a list
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {string} listId -- List's id
 * @param {object} update -- Update object: {name: string, category: string || null, "columns": array, "rows": array}
 */
listModel.prototype.update = async function (userId, orgId, listId, update, timezone, eventList) {
	try {
		// -- if only updating row data, any user that has view permissions can update, otherwise user must have manage permissions
		const permissionType = Object.keys(update).length === 1 && Object.keys(update)[0] === "rows" ?
			userPolicyCache.feedPermissionTypes.view : userPolicyCache.feedPermissionTypes.manage;

		const list = await feedModel.getEntityWithAuthorization(userId, listId, "list", permissionType);
		if (!list) {
			throw new Error("error: User does not have access to edit the list");
		}

		// If list is deleted, bail early
		if (list.deleted) {
			throw { "message": "Deleted lists cannot be updated.", "code": 404 };
		}
		let canMakeCurrentEdit = false;
		let shouldUpdatePersisted = false;

		// Properties we allow updates on
		const editableProperties = ["columns", "rows", "name", "category", "noPagination", "index", "generateActivities"];
		let shouldUpdate = false;
		let requiredColCount = 0;
		const filteredUpdate = {};
		// Build a filtered update of only editing-allowed properties
		for (const property in update) {
			if (editableProperties.includes(property)) {
				shouldUpdate = true;
				filteredUpdate[property] = update[property];
			}
		}
		// If we're updating columns, make sure that a single one is marked 'required'
		if (update.columns) {
			update.columns.forEach(col => {
				if (col.hasOwnProperty("required") && col["required"] === true) {
					requiredColCount += 1;
				}
			});
		}
		// If we're not editing columns, go ahead and set to pass check
		else {
			requiredColCount = 1;
		}

		/**
		 * Edit list:
		 * 
		 * Original list:
		 * Name - Edit permissions
		 * Rows - Contribute Permissions
		 * Columns - Edit Permissions
		 * Category - Edit Permissions
		 * 
		 * Pinned List (to event):
		 * Name - Contribute permissions (for the event the list is pinned to)
		 * Rows - Contribute permissions (for the event the list is pinned to)
		 * Columns - N/A (can't be done)
		 * Category - N/A (can't be done)
		 */
		// User owns list & not pinned, can edit in any way
		if (list.owner === userId && !list.targetId) {
			canMakeCurrentEdit = true;
		}
		// Otherwise, list must be public or pinned to update it
		else if (list.isPublic || list.targetId) {

			if (eventList) {
				// Users cannot update columns or categories of pinned lists
				if (Object.keys(filteredUpdate).filter(value => -1 !== ["columns", "category"].indexOf(value)).length > 0) {
					canMakeCurrentEdit = false;
				} else {
					canMakeCurrentEdit = true;
				}
			}
			else {
				canMakeCurrentEdit = true;
			}
		}

		if (shouldUpdate && requiredColCount === 1) {
			filteredUpdate.lastModifiedDate = new Date();
			// Ensure filtered update has a name property to update persisted state
			filteredUpdate.name = filteredUpdate.name ? filteredUpdate.name : list.name;
			if (canMakeCurrentEdit) {
				const updateQuery = r
					.table(LIST_TABLE)
					.get(listId)
					.update(filteredUpdate, { returnChanges: true });

				const appState = await r
					.table(USER_APP_STATE_TABLE)
					.filter({ "appId": "lists-app", "user": userId })
					.run();

				if (appState[0] && appState[0].state.pinnedLists && appState[0].state.pinnedLists[listId]) {
					shouldUpdatePersisted = true;
				}
				// rows will be updated when a column is added or deleted, but we don't want activites to generate in these instances
				if (filteredUpdate.rows && !filteredUpdate.columns && (filteredUpdate.generateActivities || list.generateActivities && !filteredUpdate.hasOwnProperty("generateActivities"))) {
					generatListUpdateActivities(userId, list, filteredUpdate, eventList, timezone);
				}
				if (shouldUpdatePersisted) {
					const updateAppStateQuery = r
						.table(USER_APP_STATE_TABLE)
						.filter({ "appId": "lists-app", "user": userId })(0)
						.update({
							"state": {
								"pinnedLists": r.object(listId, { "name": filteredUpdate.name })
							}
						});
					try {
						const result = await r.expr([
							updateQuery,
							updateAppStateQuery
						]).run();
						if (_global.globalChangefeed) {
							if (result[0]) {
								const { changes } = result[0];
								if (changes && changes[0]) {
									const change = {
										new_val: changes[0].new_val,
										old_val: changes[0].old_val,
										rt: true
									};
									_global.globalChangefeed.publish(change);
								}
							}
						}
						return result;
					} catch (err) {
						console.log("Update list error:", err);
						throw err;
					}
				}
				else {
					const result = await updateQuery.run();

					if (_global.globalChangefeed) {
						if (result.changes && result.changes[0]) {
							const change = {
								new_val: result.changes[0].new_val,
								old_val: result.changes[0].old_val,
								rt: true
							};
							_global.globalChangefeed.publish(change);
						}
					}

					return result;
				}
			}
			else {
				throw { "message": "User does not have permission to edit list.", "code": 403 };
			}
		}
		else {
			if (requiredColCount !== 1) {
				throw { "message": "A single column should be marked as required.", "code": 400 };
			}
			throw { "message": "Unable to edit properties of list.", "code": 400 };
		}

	}
	catch (err) {
		throw err;
	}
};


/**
 * Create copies of original lists and pin them to an event (will be expanded to handle other entities in future)
 * @param {array} listIds -- Array of list ids you'd like to copy and add to an event
 * @param {string} type -- Type of event/entity you are pinning lists to
 * @param {string} eventId -- Id of event you are pinning to (Will be expanded to other entities as well)
 * @param {string} userId -- User's id
 */
listModel.prototype.createByTemplate = async function (listIds, type, entityId, userId, orgId) {
	try {
		const lists = await feedModel.getEntitiesWithAuthorization(userId, listIds, "list");

		const updates = [];
		lists.forEach((list) => {
			if (
				!list.deleted &&
				list.owner === userId ||
				(list.isPublic && list.ownerOrg === orgId) ||
				(list.isPublic)
			) {
				const clonedList = { ...list };

				clonedList.createdDate = new Date();
				clonedList.lastModifiedDate = new Date();
				clonedList.owner = userId;
				clonedList.deleted = false;
				clonedList.targetId = entityId;
				clonedList.targetType = type;
				clonedList.category = list.category;
				delete clonedList.id;

				updates.push(clonedList);
			}

		});
		if (updates.length > 0) {
			const result = await r
				.table(LIST_TABLE)
				.insert(updates, {
					returnChanges: true
				})
				.run();

			if (result) {
				// Array of objects, containing listId and attachmentId, to put in sys_entityAttachment
				const attachmentUpdates = [];

				// There is at least one successfully pinned list
				if (result.changes && result.changes[0]) {
					result.changes.forEach(change => {
						const newList = change.new_val;

						if (newList.rows) {
							newList.rows.forEach(row => {

								// If row has attachments
								if (row.attachments && row.attachments.length) {
									row.attachments.forEach(attachmentId => {
										attachmentUpdates.push({
											fileId: attachmentId,
											targetId: newList.id
										});
									});
								}
							});
						}
					});
				}

				let attachmentResult = null;

				if (attachmentUpdates.length) {
					attachmentResult = await r
						.table(ENTITY_ATTACHMENT_TABLE)
						.insert(attachmentUpdates)
						.run();
				}

				if (_global.globalChangefeed) {
					if (result.changes && result.changes[0]) {
						const change = {
							new_val: result.changes[0].new_val,
							old_val: result.changes[0].old_val,
							rt: true
						};
						_global.globalChangefeed.publish(change);
					}
				}

				return {
					"listResult": result,
					"attachmentResult": attachmentResult
				};

			}
		} else {
			throw {
				"message": "There was a problem creating the list.",
				"code": 500
			};
		}



	} catch (err) {
		return err;
	}
};

/**
 * Create a copy of an existing original list
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {string} listId -- List's id
 * @param {object} update -- Object, containing a name, that you'd like to replace in the clone
 */
listModel.prototype.cloneList = async function (userId, orgId, listId, update) {
	try {

		const originalList = await feedModel.getEntityWithAuthorization(userId, listId, "list", userPolicyCache.feedPermissionTypes.manage);
		if (!originalList) {
			throw new Error("error: User does not have access to edit the list");
		}

		// Bail early if no name
		if (!update.name) {
			throw { "message": "Missing list name.", "code": 400 };
		}

		if (originalList) {
			const newList = {
				entityType: "list",
				createdDate: new Date(),
				lastModifiedDate: new Date(),
				deleted: false,
				isPublic: true,
				owner: userId,
				ownerOrg: orgId,
				targetId: null,
				targetType: null
			};
			newList.feedId = `${orgId}_lists`;

			newList.columns = originalList.columns;
			newList.rows = originalList.rows;
			newList.name = update.name;
			newList.category = update.category ? update.category : null;
			newList.noPagination = update.noPagination;
			newList.generateActivities = update.generateActivities;

			const result = await r
				.table(LIST_TABLE)
				.insert(newList, { returnChanges: true })
				.run();

			if (result) {
				const newListId = result.generated_keys[0];
				const attachmentUpdates = [];

				if (originalList.rows) {
					originalList.rows.forEach(row => {
						if (row.attachments) {
							row.attachments.forEach(attachmentId => {
								attachmentUpdates.push({
									fileId: attachmentId,
									targetId: newListId
								});
							});
						}
					});
				}

				const attachResult = await r
					.table(ENTITY_ATTACHMENT_TABLE)
					.insert(attachmentUpdates)
					.run();

				if (_global.globalChangefeed) {
					if (result.changes && result.changes[0]) {
						const change = {
							new_val: result.changes[0].new_val,
							old_val: result.changes[0].old_val,
							rt: true
						};
						_global.globalChangefeed.publish(change);
					}
				}

				return result;
			}
			else {
				throw {
					"message": "There was a problem cloning the list.",
					"code": 500
				};
			}
		}
		else {
			throw { "message": "User does not have permission to copy list.", "code": 404 };
		}
	}
	catch (err) {
		return err;
	}
};

/**
 * Stream list copies pinned to an event
 * @param {string} activeEventId -- Event's id
 * @param {function} handler -- handler fn
 */
listModel.prototype.streamByEvent = async function (activeEventId, userId, expandRefs, handler) {
	try {
		const userInts = userPolicyCache.getUserIntegrations(userId);

		const feedIds = userInts
			.filter((feed) => feed.config.canView && feed.entityType === "list")
			.map(function (feed) {
				return feed.feedId;
			});

		let q = r.table(LIST_TABLE)
			.filter(list => {
				return r.expr(feedIds).contains(list("feedId"));
			})
			.filter({ "targetId": activeEventId })
			.filter(
				r.and(r.row("deleted").default(false).eq(false))
			)
			.changes({ "includeInitial": true, "includeTypes": true, "includeStates": false });

		if (expandRefs) {
			q = q.merge((list) => {
				// -- merge list category into list object under "categoryRef" property
				return r.branch(
					list.hasFields({ "new_val": { "category": true } }),
					{
						new_val: {
							categoryRef: r.table(LIST_CATEGORIES_TABLE)
								.filter({ "id": list("new_val")("category") })(0).default(null)
						}
					},
					{}
				);
			});
		}

		const onFeedItem = (change) => {
			const list = change.new_val ? change.new_val : change.old_val;
			if (userPolicyCache.authorizeEntity(userId, list)) {
				handler(null, change);
			}
		};

		const onError = (err) => {
			console.log("listModel.streamByEvent changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("listModel.streamByEvent", q, onFeedItem, onError);
		return cancelFn;
	} catch (err) {
		console.log("error:", err);
		return err;
	}
};

/**
 * getSnapshot - get all available lists to include in replay snapshot
 * @param
 */
// INETERNAL USE ONLY
listModel.prototype.getSnapshot = async function () {
	try {
		const result = await r
			.table(LIST_TABLE)
			.filter(
				r.row("deleted").default(false).eq(false),
			);

		return result;

	} catch (err) {
		logger.error(
			"getSnapshot",
			"An unexpected error occurred",
			{ errMessage: err.message, errStack: err.stack }
		);
		throw err;
	}
};
