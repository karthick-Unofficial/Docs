"use strict";
const ENTITY_COLLECTIONS_TABLE = "sys_entityCollections";
const ATTACHMENT_TABLE = "sys_attachment";
const ENTITY_ATTACHMENT_TABLE = "sys_entityAttachment";

const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/feedModel.js");
const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const esProvider = require("../lib/es-provider");
const esClient = esProvider.get();
const moment = require("moment");

const orgCache = require("../lib/organizationCache");
const userCache = require("../lib/userCache");
const userPolicyCache = new (require("../lib/userPolicyCache"));
const entityTypeCache = require("../lib/entityTypeCache");
const _global = require("../app-global.js");
const ajv = require("./schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/activity.json"));
const userModel = require("./userModel")();
const feedModel = require("./feedModel")();
const uuidv4 = require("uuid/v4");

const activityQueue = require("node-app-core").jobQueue("ecosystem", "activity");

module.exports = ActivityModel;

function ActivityModel(options) {
	if (!(this instanceof ActivityModel)) return new ActivityModel(options);
	const self = this;
	self.options = options;
}

ActivityModel.prototype.queueActivity = async function (activity, app) {
	const job = activityQueue.createJob();
	job.sourceApp = app || "ecosystem";
	// -- assign activity and id and return so caller can execute follow on related actions. I.e. add attachments to the activity
	activity.id = uuidv4();

	// -- add expanded track to activity contents for rules now but could be useful elsewhere
	// -- expansion includes collection(s) entity is member of
	// -- in all cases may be a better implementation to include entire entity at that point in time in
	// -- target and object fields (which it currently is now but should move into activityProcessor(Maybe - because entity could change before processed))
	// -- TODO: Moved this here because of availability of ecoLinkManager (not available in activity processor)
	// -- Revisit as this moves the performance impact into the main process
	try {
		if (activity.object && activity.object.type === "track") {
			const expandedObject = await feedModel.getEntity(activity.object.id, activity.object.type);

			if (expandedObject) {
				const memberCollections = await r.table(ENTITY_COLLECTIONS_TABLE)
					.filter(function (ec) {
						return ec("entities").contains(activity.object.id);
					})
					.map(function (ec) { return ec("id"); })
					.coerceTo("array")
					.run();

				expandedObject["memberCollections"] = memberCollections;
				activity.object["expanded"] = expandedObject;
			}
		}
	}
	catch(err) {
		// TODO: log, do something more useful
		console.log("Error expanding activity object", err.message, err.stack);
	}

	
	job.activity = activity;

	try {
		await activityQueue.addJob(job);
		return { "activityId": job.activity.id };
	}
	catch (ex) {
		throw ex;
	}
};

// todo need the domain for the system to generate proper urls
ActivityModel.prototype.generateObject = function (type, id, name, feedId) {
	let objectName, objectUrl, objectfeedId;
	switch (type) {
		case "user":
			objectName = name !== undefined && name !== null ? name : userCache.get(id).name;
			objectUrl = `http://localhost/ecosystem/api/users/${id}`;
			break;
		case "organization":
			objectName = name !== undefined && name !== null ? name : orgCache.get(id).name;
			objectUrl = `http://localhost/ecosystem/api/organizations/${id}`;
			break;
		case "collection":
			// objectName = id;
			objectName = name;
			objectUrl = `http://localhost/collections-app/${id}`; // -- this should target where you can view the collection or data for it
			break;
		case "attachment":
			// objectName = id;
			objectName = name;
			objectUrl = `http://localhost/collections-app/${id}`; // -- this should target where you can view the collection or data for it
			break;
		case "event":
			// objectName = id;
			objectName = name;
			objectUrl = `http://localhost/events-app/${id}`; // -- this should target where you can view the collection or data for it
			break;
		case "activity":
			// objectName = id;
			objectName = name; //????
			objectUrl = `http://localhost/ecosystem/api/activities/${id}`; // -- this should target where you can view the collection or data for it
			break;
		default: // always an entity at present. however will need to differentiate between entities and feed entities or combine them in API
			objectName = name;
			objectUrl = `http://localhost/ecosystem/api/entities/${id}`;
			objectfeedId = feedId;
			return {
				"type": type,
				"id": id,
				"name": objectName,
				"url": objectUrl,
				"feedId": objectfeedId
			};
	}
	return {
		"type": type,
		"id": id,
		"name": objectName,
		"url": objectUrl
	};
};


// What about activities for specific entity type? if that is not provided by the app then it could be too generic a message
// so for shapes: I know it's a "shapes" entity types so I could unpluralize.
// so actor would be shuey@themarinergroup.net
// target would be the shape
// and in that case there wouldn't necessarily be an object or it would be same as target or it would be the specific mod
// also need to factor in notification subscriptions to activities.
// IT REALLY NEEDS TO BE UP TO THE APP AS TO WHETHER AN ACTIVITY IS GENERATED OR NOT AND THE APP NEEDS TO BE CONFIGURED
// TO AVAILABLE NOTIFICATIONS WHICH IS A GOOD REASON TO STILL FORCE ENTITY API THROUGH THE APPS
// NOT TRUE - WE SHOULD CAPTURE GENERIC ECOSYSTEM ACTIVITIES ACROSS THE BOARD - WE DON'T HAVE TO NOTIFY ON THEM AND
// FOR THE MOST PART WE WON'T - WOULD BE OBNOXIOUS NOISE
//"summary": "Scott attached a file",
//"type": "attach-file",
//"actor": {
//    "type": "user",
//    "id": "shuey@themarinergroup.net",
//    "name": "Scott Huey",
//    "url": "http://ecosystem/api/v1?/users/shuey@themarinergroup.net"
//    },
//"object" : {
//    "id": "2346837264872364823764",
//    "type": "Attachment",
//    "url": "http://ecosystem/api/v1?/feeds/aishub/entities/1234/attachments/2346837264872364823764",
//    "name": "VesselPhoto.jpg"
//},
//"target" : {
//    "id": "1234",
//    "type": "track",
//    "name": "Bonn Express",
//    "url": "http://ecosystem/api/v1?/feeds/aishub/entities/1234"
//}

ActivityModel.prototype.create = async function (
	source,
	activity) {

	activity.source = source;
	if (!activity.authAppId) {
		// -- app auth not required as otherwise this wouldn't show up at all. Log as error to capture and resolve if necessary.
		logger.error("create", "Activity does not have an authAppId. By default setting to override app auth. Should be reviewed to determine if correct behavior for this activity.", { activity: activity }, SYSTEM_CODES.UNSPECIFIED);
		activity.authAppId = "*";
	}
	activity.published = new Date();

	// Checks data vs schema and aborts if data does not match, logs to console
	// if(!validate(activity)) {
	// 	return bluebird.reject(validate.errors);
	// }

	try {
		const publishedDate = moment(activity.published);
		const indexName = `activity-stream-${publishedDate.utc().format("YYYY.MM")}`;
		// const activityId = activity.id;
		// delete activity.id;
		const result = await esClient.index({
			refresh: true,
			id: activity.id,
			index: indexName,
			body: activity
		});

		// -- publish Activity for interested subscribers
		if (_global.globalChangefeed) {
			_global.globalChangefeed.publishActivity(activity);
		}

		return result;
	} catch (err) {
		throw err;
	}

};


/**
 * streamEntityActivities - streams entity activities point forward including the last @pageSize
 * @param userId 
 * @param orgId 
 * @param entityId 
 * @param initialPageSize - number of activities initially returned
 * @param handler 
 */
ActivityModel.prototype.streamEntityActivities = async function (userId, orgId, entityId, entityType, initialPageSize, handler) {
	try {
		// -- todo possibly subscribe for all activities targeting an entity - could pusblish twice, once with source and once with target that seems like a really good idea
		// -- will need callback for sid to cancel subscription - maybe have it return an object with unsubscribe method
		_global.globalChangefeed.subscribeActivity(null, async function (activity) {
			if ((activity.object && activity.object.id === entityId) || (activity.target && activity.target.id === entityId)) {
				if (activity.object.expanded) delete activity.object.expanded;
				if (await this._authorizeActivity(userId, activity)) {
					activity.entityId = entityId;
					// All change types would be add for now as activities are not deleted or modified
					const activityChange = {
						"type": "add",
						"new_val": activity,
						"old_val": null
					};
					handler(null, activityChange);
				}
			}
		}.bind(this));

		// -- unsubscribe method returned by subscribe activity
		return function () { };

	} catch (err) {
		throw err;
	}
};

/**
 * getEntityActivityPage
 * @param userId
 * @param orgId 
 * @param entityId 
 * @param fromDate - date to grab activities before
 * @param pageSize - number of activities per page
 * @param firstPage - if you want the first page by pagesize
 */
ActivityModel.prototype.getEntityActivityPage = async function (
	userId,
	orgId,
	entityId,
	fromDate,
	pageSize
) {


	fromDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();

	const q = {
		"from": 0,
		"size": pageSize,
		"sort": [{
			"published": {
				"order": "desc"
			}
		}],
		// "track_total_hits": true, //default is already true
		"query": {
			"bool": {
				"must": [{
					"range": {
						"published": {
							"lt": fromDate
						}
					}
				},
				{
					"bool": {
						"should": [{
							"wildcard": {
								"object.id": { 
									"value": `${entityId}*`
								}
							}
						},
						{
							"wildcard": {
								"target.id": { 
									"value": `${entityId}*`
								}
							}
						}
						]
					}
				}
				]
			}
		}
	};

	try {
		const resultList = [];
		let scrollId = null;
		while (resultList.length < pageSize) {
			let result = null;
			if (!scrollId) {
				result = await esClient.search({
					index: "activity-stream-*",
					scroll: "5s",
					body: q
				});
				scrollId = result._scroll_id;
			}
			else {
				result = await esClient.scroll({
					body: {
						"scroll_id": scrollId,
						"scroll": "5s"
					}
				});
				scrollId = result._scroll_id;
			}

			for (const idx in result.hits.hits) {
				const activity = result.hits.hits[idx]._source;
				if (await this._authorizeActivity(userId, activity)) {
					resultList.push(activity);
				}
				if (resultList.length >= pageSize) break;
			}
			if (result.hits.total.value === 0) break;
			// -- seems there might be a bug with scroll return a total.value greater than 0 when no hits
			if (result.hits.hits.length === 0) break;
		}
		logger.info("getEntityActivityPage", "getEntityActivityPage success", { activityList: resultList, entityId: entityId });

		return resultList;
	}
	catch (err) {
		logger.error("getEntityActivityPage", `Unexpected exception attempting get activities for entityId ${entityId}`, { entityId: entityId, err: JSON.stringify(err) });
		throw (err);
	}


};


/**
 * getActivity
 * @param userId
 * @param activityId 
 */
ActivityModel.prototype.getActivity = async function (
	userId,
	activityId
) {

	try {

		const activity = await this._internalGetActivity(activityId);

		if (activity) {
			if (await this._authorizeActivity(userId, activity)) {
				return activity;
			}
			else {
				throw { code: "403", message: "Unauthorized" };
			}
		}
		else {
			throw { code: 404, message: "Activity not found" };
		}

	}
	catch (err) {
		logger.error("getActivity", `Unexpected exception attempting to get activity ${activityId}`, { activityId: activityId, errMessage: err.message, errStack: err.stack });
		throw (err);
	}


};

/**
 * _authorizeActivity - to handle case where target of an activity is an activity (comments on alerts)
 * @param userId
 * @param activity 
 */
ActivityModel.prototype._authorizeActivity = async function (userId, activity) {
	let activityToAz = null;
	if (activity.target && activity.target.type === "activity") {
		activityToAz = await this._internalGetActivity(activity.target.id);
	}
	activityToAz = activityToAz ? activityToAz : activity;
	return userPolicyCache.authorizeActivity(userId, activityToAz);
};

/**
 * getActivity
 * @param userId
 * @param activityId 
 */
ActivityModel.prototype._internalGetActivity = async function (
	activityId
) {

	try {

		const result = await esClient.search({
			index: "activity-stream-*",
			body: {
				"from": 0,
				"size": 1,
				"query": {
					"bool": {
						"must": [
							{
								"match": {
									"id": activityId
								}
							}
						]
					}
				}
			}
		});

		if (result.hits.total.value === 1) {
			return result.hits.hits[0]._source;
		}
		else {
			throw { code: 404, message: "Activity not found" };
		}

	}
	catch (err) {
		logger.error("_internalGetActivity", `Unexpected exception attempting to get activity ${activityId}`, { activityId: activityId, errMessage: err.message, errStack: err.stack });
		throw (err);
	}


};


ActivityModel.prototype.getAllEntityActivities = async function (
	userId,
	entityId,
	entityType
) {
	try {
		const user = userPolicyCache.getUserById(userId);
		const orgId = user.orgId;

		const result = await this.getEntityActivityPage(userId, orgId, entityId, null, 1000, true, entityType);

		return result;
	} catch (err) {
		logger.error("getAllEntityActivities", `Unexpected exception attempting get activities for entityId ${entityId}`, { entityId: entityId, err: JSON.stringify(err) }, provider.isReqlError ? SYSTEM_CODES.RETHINKDB : SYSTEM_CODES.UNSPECIFIED);
		throw (err);
	}
};

ActivityModel.prototype.getActivityAuthorizedUsers = async function (
	activityId
) {

	const activity = await this._internalGetActivity(activityId);
	const authorizedUsers = Object.keys(userPolicyCache._usersById).filter((userId) => {
		return userPolicyCache.authorizeActivity(userId, activity);
	});

	return authorizedUsers;
};

/**
 * getActivityDetail
 * @param activityId
 */
ActivityModel.prototype.getActivityDetail = async function (
	userId,
	activityId
) {
	try {
		// probably end up hiding context ents, attachments, etc so those won't require authorization
		const activity = await this.getActivity(userId, activityId);
		const ctxEnts = [];
		if (activity) {
			if (activity.contextEntities) {
				for (let i = 0; i < activity.contextEntities.length; i++) {
					const contextEnt = activity.contextEntities[i];
					const authEnt = await feedModel.getEntityWithAuthorization(userId, contextEnt.id, contextEnt.type);
					if (authEnt) {
						ctxEnts.push(authEnt);
					}
				}
			}
			activity.contextEntities = ctxEnts;
			// activity.attachments = await this.getActivityAttachments(userId, activityId);
		}
		return activity;
	} catch (err) {
		throw err;
	}
};


/**
 * getActivityContextEntities
 * @param activityId
 */
ActivityModel.prototype.getActivityContextEntities = async function (
	userId,
	activityId
) {
	try {
		const activity = await this.getActivity(userId, activityId);
		const result = [];
		if (activity) {
			if (activity.contextEntities) {
				for (let i = 0; i < activity.contextEntities.length; i++) {
					const contextEnt = activity.contextEntities[i];
					const authEnt = await feedModel.getEntityWithAuthorization(userId, contextEnt.id, contextEnt.type);
					if (authEnt) {
						result.push(authEnt);
					}
				}
			}
		}
		return result;
	} catch (err) {
		throw err;
	}
};

/**
 * getActivityContextEntities
 * @param activityId
 */
ActivityModel.prototype.getActivityAttachments = async function (
	userId,
	activityId
) {
	try {
		// -- if I end up doing this internally then authorization won't be required
		// -- activity would already be authorized
		const activity = await this.getActivity(userId, activityId);
		let result = [];
		if (activity) {
			// todo: create index on targetId and use getAll
			const attachments = r.table(ENTITY_ATTACHMENT_TABLE)
				.filter({ "targetId": activityId })
				.map((ea) => {
					return r.table(ATTACHMENT_TABLE)
						.get(ea("fileId"));
				});
			result = attachments;
		}
		return result;
	} catch (err) {
		throw err;
	}
};

ActivityModel.prototype.addComment = async function (
	userId,
	activityId,
	comment,
	translations) {
	try {
		const activity = await this.getActivity(userId, activityId);
		if (activity) {
			const commentActivity = {
				"summary": "",
				"type": "comment",
				"activityDate": new Date(),
				"actor": this.generateObject("user", userId),
				"object": {
					"message": comment,
					"type": "comment"
				},
				"target": this.generateObject("activity", activityId, `Activity "${activity.summary}"`),
				// Do not generate a notification for comments on activities
				"to": []
			};

			commentActivity.summary = `${activity.actor.name} ${translations.summary.commentedOn} "${activity.summary}"`;
			this.queueActivity(commentActivity);

			return {
				"success": true
			};
		} else {
			return {
				"success": false
			};
		}
	}
	catch (ex) {
		throw ex;
	}
};

