"use strict";
const STATUS_CARD_TABLE = "sys_statusCard";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r;
const ajv = require("../models/schema/additionalKeywords.js");
const validateStatusCard = ajv.compile(require("./schema/statusCard.json"));
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/statusBoardModel.js");
const organizationModel = require("./organizationModel")();
const userPolicyCache = new (require("../lib/userPolicyCache"));
const feedModel = require("../models/feedModel")();

module.exports = StatusBoardModel;

function StatusBoardModel() {
	if (!(this instanceof StatusBoardModel)) return new StatusBoardModel();
}

/**
 * Create a new status card
 * @param {string} userId
 * @param {string} orgId
 * @param {object} statusCard -- { name: "Fuel Card", data: [{type: "selector", selectedIndex: 0, items: [], attachments: []}]};
 */
StatusBoardModel.prototype.create = async function (userId, orgId, statusCard) {
	try {
		// -- todo: ENTITY AUTH retrieve app Id when registering with app-gateway so not hardcoded app id
		if (!userPolicyCache.authorizeApplication(userId, "status-board-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to create status card", code: 403 };
		}

		const op = {
			owner: userId,
			ownerOrg: orgId,
			entityType: "statusCard",
			isPublic: true,
			isDeleted: false,
			createdDate: new Date(),
			lastModifiedDate: new Date(),
			lastUpdateDate: new Date(),
			lastUpdatedBy: userPolicyCache.getName(userId),
			sharedWith: [],
			...statusCard
		};

		// Validate vs schema
		if (!validateStatusCard(op)) {
			throw { "message": "Status card failed schema validation", code: validateStatusCard.errors };
		}

		const result = await r.table(STATUS_CARD_TABLE)
			.insert(op, { returnChanges: true })
			.run();

		// TODO: Add activities?

		return { success: true, result: result.changes[0].new_val };
	}
	catch (ex) {
		logger.error(
			"create",
			"An error occurred while creating a status card.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update a status card
 * @param {string} userId
 * @param {string} orgId
 * @param {object} update
 */
StatusBoardModel.prototype.update = async function (userId, orgId, statusCardId, update) {
	try {
		// todo: ENT AUTH authorize status card the permission should know to check manage access to app if we pass manage as permission type
		await this.checkTemplate(statusCardId);
		const canManageApp = userPolicyCache.authorizeApplication(userId, "status-board-app", userPolicyCache.appPermissionTypes.manage);
		const authorizedStatusCard = await feedModel.getEntityWithAuthorization(userId, statusCardId, "statusCard");

		if (!canManageApp || !authorizedStatusCard) {
			throw { message: "User is not authorized to edit status card", code: 403 };
		}

		const op = {
			lastModifiedDate: new Date(),
			lastUpdateDate: new Date(),
			lastUpdatedBy: userPolicyCache.getName(userId),
			...update
		};

		const result = await r.table(STATUS_CARD_TABLE)
			.get(statusCardId)
			.update(op, { returnChanges: true })
			.run();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"update",
			"An error occurred while updating a status card.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update the selectedIndex (aka selected item) on a specific data object of a status card
 * @param {string} userId
 * @param {string} orgId
 * @param {string} statusCardId
 * @param {number} dataIndex -- index of item we want to update
 * @param {number} selectedIndex -- index of newly selected items
 */
StatusBoardModel.prototype.updateSelectedIndex = async function (userId, orgId, statusCardId, dataIndex, selectedIndex) {
	try {
		await this.checkTemplate(statusCardId);
		const authorizedStatusCard = await feedModel.getEntityWithAuthorization(userId, statusCardId, "statusCard");
		if (!authorizedStatusCard) {
			throw { message: "User is not authorized to change status card status", code: 403 };
		}

		const result = await r.table(STATUS_CARD_TABLE)
			.get(statusCardId)
			.update({
				lastModifiedDate: new Date(),
				lastUpdateDate: new Date(),
				lastUpdatedBy: userPolicyCache.getName(userId),
				data: r.row("data")
					.deleteAt(dataIndex) // Remove item at array index we're updating
					.insertAt(
						dataIndex, // Append the exact same item we just removed at the same index
						r.expr(r.row("data")(dataIndex)
							.merge({ selectedIndex: selectedIndex })) // but with an updated selectedIndex
					)
			})
			.run();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"updateSelectedIndex",
			"An error occurred while updating the selected index of a data entry on a status card.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Delete a status card
 * @param {string} userId
 * @param {string} orgId
 * @param {string} statusCardId
 */
StatusBoardModel.prototype.delete = async function (userId, orgId, statusCardId) {
	try {
		await this.checkTemplate(statusCardId);
		const canManageApp = userPolicyCache.authorizeApplication(userId, "status-board-app", userPolicyCache.appPermissionTypes.manage);
		const authorizedStatusCard = await feedModel.getEntityWithAuthorization(userId, statusCardId, "statusCard");
		if (!canManageApp || !authorizedStatusCard) {
			throw { message: "User is not authorized to delete status card", code: 403 };
		}

		const result = await r.table(STATUS_CARD_TABLE)
			.get(statusCardId)
			.update({
				isDeleted: true,
				lastModifiedDate: new Date()
			}, { returnChanges: true })
			.run();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"delete",
			"An error occurred while deleting a status card.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update the organizations a status card is shared with
 * @param {string} userId
 * @param {string} orgId
 * @param {string} statusCardId
 * @param {array} orgs -- Organization ID's the status card should be shared with. Ex. ["ares-security-corp", "metro-authority-corp"]
 */
StatusBoardModel.prototype.updateSharedWithOrgs = async function (userId, orgId, statusCardId, orgs) {
	try {
		await this.checkTemplate(statusCardId);
		const canManageApp = userPolicyCache.authorizeApplication(userId, "status-board-app", userPolicyCache.appPermissionTypes.share);
		const authorizedStatusCard = await feedModel.getEntityWithAuthorization(userId, statusCardId, "statusCard");
		if (!canManageApp || !authorizedStatusCard) {
			throw { message: "User is not authorized to share status card", code: 403 };
		}

		const result = await r.table(STATUS_CARD_TABLE)
			.get(statusCardId)
			.update({
				sharedWith: r.literal(orgs),
				lastModifiedDate: new Date()
			})
			.run();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"updateSharedWithOrgs",
			"An error occurred while sharing a status card with other organizations.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Create a new status card based on a template status card
 * @param {string} userId
 * @param {string} orgId
 * @param {string} statusCardTemplateId
 */
StatusBoardModel.prototype.createFromTemplate = async function (userId, orgId, statusCardTemplateId) {
	try {
		const canManageApp = userPolicyCache.authorizeApplication(userId, "status-board-app", userPolicyCache.appPermissionTypes.manage);
		const authorizedStatusCard = await feedModel.getEntityWithAuthorization(userId, statusCardTemplateId, "statusCard");
		if (!canManageApp || !authorizedStatusCard) {
			throw { message: "User is not authorized to create status card from template", code: 403 };
		}

		const template = await r.table(STATUS_CARD_TABLE)
			.get(statusCardTemplateId)
			.run();

		const op = {
			name: template.name,
			data: template.data,
			owner: userId,
			ownerOrg: orgId,
			entityType: "statusCard",
			isPublic: true,
			isDeleted: false,
			createdDate: new Date(),
			lastModifiedDate: new Date(),
			lastUpdateDate: new Date(),
			lastUpdatedBy: userPolicyCache.getName(userId),
			sharedWith: []
		};

		const result = await r.table(STATUS_CARD_TABLE)
			.insert(op, { returnChanges: true })
			.run();

		return { success: true, result: result.changes[0].new_val };
	}
	catch (ex) {
		logger.error(
			"createFromTemplate",
			"An error occurred while creating a status card from a template.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Get all template status cards a user has access to
 * @param {string} userId
 * @param {string} orgId
 */
StatusBoardModel.prototype.getLibrary = async function (userId, orgId) {
	try {
		const canManageApp = userPolicyCache.authorizeApplication(userId, "status-board-app");
		if (!canManageApp) {
			throw { message: "User is not authorized for status board app", code: 403 };
		}

		const result = await r.table(STATUS_CARD_TABLE)
			.filter({ template: true })
			//.filter(statusCardAuthFilter(userId, orgId, org, eco))
			.run();

		return { success: true, result: result };
	}
	catch (ex) {
		logger.error(
			"getLibrary",
			"An error occurred while getting the status card template library.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Stream a user's authorized status cards
 * @param {string} userId
 * @param {string} orgId
 * @param {function} handler
 */
StatusBoardModel.prototype.streamStatusCards = async function (appId, userId, orgId, handler) {
	try {
		const canAccessApp = userPolicyCache.authorizeApplication(userId, "status-board-app");
		if (!canAccessApp) {
			throw { message: "User is not authorized for status board app", code: 403 };
		}

		const q = r.table(STATUS_CARD_TABLE)
			.filter((card) => {
				return r.and(
					card("template").eq(false).default(true),
					card("isDeleted").eq(false),
					r.branch(
						appId && appId != "status-board-app",
						card("global").eq(true),
						true
					)
				)
			})
			//.filter(statusCardAuthFilter(userId, orgId, org, eco))
			.changes({ includeInitial: true, includeTypes: true });


		let initial = true;
		const initialBatch = { batch: "initial", changes: [] };

		const onFeedItem = async change => {
			const statusCard = change.new_val ? change.new_val : change.old_val;
			if (userPolicyCache.authorizeEntity(userId, statusCard)) {
				//Set ownerOrgName
				const orgName = await organizationModel.getName(statusCard.ownerOrg);
				if (change.new_val) {
					change.new_val.ownerOrgName = orgName;
				}
				if (change.old_val) {
					change.old_val.ownerOrgName = orgName;
				}

				if (initial) {
					initialBatch.changes.push(change);
				}
				else {
					handler(null, change);
				}
			}
		};

		const onError = err => {
			handler(err);
		};

		const cancelFn = provider.processChangefeed("StatusBoardModel.streamStatusCards", q, onFeedItem, onError);

		// Send initial batch after 1 second
		setTimeout(() => {
			handler(null, initialBatch);
			initial = false;
		}, 1000);

		return cancelFn;
	}
	catch (ex) {
		logger.error(
			"streamStatusCards",
			"An error occurred while attempting to stream status cards.",
			{ err: { message: ex.message, code: ex.code, stack: "/models/statusBoardModel.js" } }
		);
		throw ex;
	}
};

/**
 * Check to see if a status card is a template. Templates cannot be edited or deleted.
 * @param {string} statusCardId
 */
StatusBoardModel.prototype.checkTemplate = async function (statusCardId) {
	try {
		const isTemplate = await r.table(STATUS_CARD_TABLE)
			.get(statusCardId)("template")
			.default(null)
			.run();

		if (isTemplate) {
			throw { "message": "User may not update or delete template status cards.", code: 403 };
		}
		return;
	} catch (ex) {
		throw ex;
	}
};