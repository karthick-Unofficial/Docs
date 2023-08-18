"use strict";
const ATTACHMENT_TABLE = "sys_attachment";
const ENTITY_ATTACHMENT_TABLE = "sys_entityAttachment";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const activityModel = require("../models/activityModel")();
const feedModel = require("../models/feedModel")();
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/attachment.json"));
const userModel = require("./userModel.js")({});
const _global = require("../app-global");
const geti18n = require("node-app-core/dist/localize");
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/models/attachmentModel.js");
const fileStorage = require("node-app-core").fileStorage();
const moment = require("moment");
const config = require("../config.json");
module.exports = AttachmentModel;

function AttachmentModel(options) {
	if (!(this instanceof AttachmentModel)) return new AttachmentModel(options);
	const self = this;
	self.options = options;
}

// TODO: Pitch the idea of a private file type
/**
 * Upload a file, attached to an entity or with no association
 * @param {string} userId -- User's id
 * @param {string || null} targetId -- Id of entity file is being attached to
 * @param {array} files -- Array of files
 * @param {boolean} notify -- Should notify
 * @param {string} source -- (optional) added for 'external' MarineTraffic images
 */
AttachmentModel.prototype.create = async function (userId, targetId, targetType, files, notify, source, expiration, translations) {
	try {
		let permission = false;
		const result = await this.hasPermission(userId, targetId, targetType);
		if (!result) permission = false;
		else {
			permission = result;
		}

		if (permission) {
			let fileList = "";
			const attachments = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				// This varible will be used to check individual attachments vs JSON schema
				const currentAttachment = {
					"createdBy": userId,
					"createdDate": new Date(),
					"filename": file.name,
					"handle": file.handle,
					"mimeType": file.type
				};

				if (source !== null) {
					currentAttachment.source = source;
				}
				if (expiration !== null) {
					currentAttachment.expiration = expiration;
				}

				// check attachment data vs schema with AJV
				if (!validate(currentAttachment)) {
					return {
						"message": "Validation Error",
						"err": validate.errors
					};
				}

				attachments.push(currentAttachment);
				fileList += file.name + (i > 0 && i < files.length - 1 ? ", " : "");
				// -- todo: check result
			}

			const result = await r.table(ATTACHMENT_TABLE).insert(attachments).run();

			// If there's a target, and the file uploaded successfully
			if (targetId && result.generated_keys) {
				const entityAttachResult = await result.generated_keys.forEach(key => {
					r.table(ENTITY_ATTACHMENT_TABLE)
						.insert({
							targetId,
							"fileId": key
						})
						.run();
				});
				console.log("AttachmentModel.create entityAttach result: ", entityAttachResult);
			}

			// -- object is the attachment itself though will not generate user stream entries as of yet
			// -- target is the associated entity
			const activity = {
				"summary": "",
				"type": "uploaded",
				"actor": activityModel.generateObject("user", userId),
				"object": activityModel.generateObject("attachment", result.generated_keys[0]),
				"to": notify ? [{
					"token": `user:${userId}`,
					"system": true,
					"email": false,
					"pushNotification": false
				}] : []
			};
			activity.summary = `${activity.actor.name} ${translations.summary.uploaded} ${fileList}`;
			// if attachment targets an entity include it as target
			if (typeof (permission) === "object") {
				activity["target"] = activityModel.generateObject(
					permission.entityType,
					permission.id,
					await feedModel.getDisplayNameByEntity(permission),
					permission.feedId);
			}

			activityModel.queueActivity(activity);
			const response = {
				success: true,
				uploaded: files.length + " files",
				attachmentId: result.generated_keys[0]
			};
			return response;
		} else {
			return {
				err: {
					"message": "Entity not found or requester does not have permission to attach files",
					"code": 404
				}
			};
		}

	} catch (err) {
		console.log("Create attachment(s) error:", err);
		throw { "message": err, "err": err };
	}
};

AttachmentModel.prototype.getById = async function (id) {
	try {
		const result = await r.table(ATTACHMENT_TABLE)
			.filter({ id: id })
			.filter({ deleted: false }, { default: true })
			.run();

		return result;

	} catch (err) {
		throw err;
	}
};

AttachmentModel.prototype.getByHandle = async function (handle) {
	try {
		const result = await r.table(ATTACHMENT_TABLE)
			.filter({ handle: handle })
			.filter({ deleted: false }, { default: true })
			.run();

		return result[0] || null;

	} catch (err) {
		throw err;
	}
};

/**
 * Get multiple attachments by id
 * @param {array} ids -- Array of attachment ids
 */
AttachmentModel.prototype.getByIds = async (ids) => {
	try {
		const result = await r.table(ATTACHMENT_TABLE)
			.filter((attachment) => {
				return r.expr(ids).contains(attachment("id"));
			})
			.filter({ deleted: false }, { default: true })
			.run();

		return result;
	}
	catch (ex) {
		logger.error(
			"getByIds",
			"Error getting attachments by ids",
			{ err: { message: ex.message, code: ex.code, stack: "/models/attachmentModel.js" } }
		);
		throw ex;
	}
};

AttachmentModel.prototype.hasPermission = async (userId, targetId, targetType) => {
	try {
		let permission = false;
		switch (targetType) {
			case "profile":
				if (userId === targetId) {
					permission = true;
				}
				break;
			case "orgProfile": {
				const userProfile = await userModel.getProfile(userId);
				permission = userProfile.user.admin && targetId === userProfile.user.orgId;
				break;
			}
			// In the case of floor plans, the authorization happens when a user
			// attempts to save the update. If the user is unauthorized, the attachment
			// will then be deleted from the front end.
			case "floor-plan": {
				permission = true;
				break;
			}
			case "activity": {
				// There appears to be a race confdition where this authorization could take place before the activity is persisted
				// temporarily allow any attachment to activity. Practically this should not be an issue as attachments are only added to activities by the system
				// Future solution could be to persist attachments in activity processor which would change the current workflow
				// permission = await activityModel.getActivity(userId, targetId);
				permission = true;
				break;
			}
			default:
				//todo: ENTITY_AUTH contribute doesn't apply anymore	
				permission = await feedModel.getEntityWithAuthorization(userId, targetId, targetType);
				break;
		}
		if (permission) {
			return permission;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return error;
	}

};

/* Examine expiration property. If past, remove file. Return unexpired objects */
AttachmentModel.prototype.removeExternal = (targetId, fileId) => {
	// Remove from sys_attachment where id = fileId
	r.table(ATTACHMENT_TABLE).get(fileId).delete().run();

	// Remove attachments from sys_entityAttachments
	r.table(ENTITY_ATTACHMENT_TABLE)
		.filter({
			"fileId": fileId,
			"targetId": targetId
		})
		.delete()
		.run();
};

AttachmentModel.prototype.remove = async function (userId, targetId, targetType, fileId, translations) {
	try {
		let permission = false;
		if (targetType !== "profile") {
			const result = await this.hasPermission(userId, targetId, targetType);
			if (!result) permission = false;
			else {
				permission = result;
			}
		}
		if (permission) {
			// Remove attachments from sys_entityAttachments
			const removeAttachment = await r.table(ENTITY_ATTACHMENT_TABLE)
				.filter({
					"fileId": fileId,
					"targetId": targetId
				})
				.delete()
				.run();

			const file = await r.table(ATTACHMENT_TABLE).get(fileId).run();

			const activity = {
				"summary": "",
				"type": "removed",
				"actor": activityModel.generateObject("user", userId),
				"object": activityModel.generateObject("attachment", fileId),
				"to": []
			};
			activity.summary = `${activity.actor.name} ${translations.summary.removed} ${file.filename}`;
			// if attachment targets an entity include it as target
			if (typeof (permission) === "object") {
				activity["target"] = activityModel.generateObject(
					permission.entityType,
					permission.id,
					await feedModel.getDisplayNameByEntity(permission),
					permission.feedId);
			}

			activityModel.queueActivity(activity);

			// Number of things file still attached to
			const remainingAttachments = await r.table(ENTITY_ATTACHMENT_TABLE)
				.count((entAtt) => {
					return entAtt("fileId").eq(fileId);
				})
				.run();

			// Convert to bool
			const isAttached = !!remainingAttachments;
			const response = {
				"isAttached": isAttached,
				"handle": file.handle
			};
			return response;

		} else {
			return {
				err: {
					"message": "Entity not found or requester does not have permission to remove files",
					"code": 404
				}
			};
		}
	} catch (err) {
		throw err;
	}
};

/**
 * Delete a file and remove it from anything it may be attached to
 * @param {string} userId -- User's id
 * @param {string} handle -- File's handle
 */
AttachmentModel.prototype.delete = async function (userId, handle, translations) {
	try {
		const query = await r.table(ATTACHMENT_TABLE)
			.filter({ handle: handle })
			.update({ "deleted": true }, { returnChanges: true });

		const entQuery = await r.table(ENTITY_ATTACHMENT_TABLE)
			.filter({
				fileId: r.table(ATTACHMENT_TABLE).filter({ handle: handle })(0)("id")
			})
			.delete();
		try {
			const result = await r.expr([
				entQuery,
				query
			]).run();
			const attachment = result[1].changes[0].new_val;

			const activity = {
				"summary": "",
				"type": "removed",
				"actor": activityModel.generateObject("user", userId),
				"object": activityModel.generateObject("attachment", attachment.id),
				"to": null
			};
			activity.summary = `${activity.actor.name} ${translations.summary.removed} ${attachment.filename}`;
			activityModel.queueActivity(activity);

			return result;
		} catch (err) {
			console.log("AttachmentModel.delete error: ", err);
			return err;
		}
	}
	catch (err) {
		throw err;
	}
};

AttachmentModel.prototype.getById = async function (id) {
	try {
		const result = await r.table(ATTACHMENT_TABLE)
			.filter({ id: id })
			.filter({ deleted: false }, { default: true })
			.run();

		return result;

	} catch (err) {
		throw err;
	}
};

AttachmentModel.prototype.streamAttachmentsByTarget = function (targetId, userId, orgId, handler) {
	try {
		const q = r.table(ENTITY_ATTACHMENT_TABLE)
			.filter({
				"targetId": targetId
			})
			.changes({ "includeInitial": true, "includeTypes": true })
			.merge((change) => {
				return r.branch(
					change.hasFields("new_val"),
					{
						"new_val": {
							handle: r.table(ATTACHMENT_TABLE).get(change("new_val")("fileId"))("handle").default(""),
							mimeType: r.table(ATTACHMENT_TABLE).get(change("new_val")("fileId"))("mimeType").default(""),
							filename: r.table(ATTACHMENT_TABLE).get(change("new_val")("fileId"))("filename").default(""),
							source: r.table(ATTACHMENT_TABLE).get(change("new_val")("fileId"))("source").default(""),
							expiration: r.table(ATTACHMENT_TABLE).get(change("new_val")("fileId"))("expiration").default("")
						}
					},
					change.hasFields("old_val"),
					{
						"old_val": {
							handle: r.table(ATTACHMENT_TABLE).get(change("old_val")("fileId"))("handle").default(""),
							mimeType: r.table(ATTACHMENT_TABLE).get(change("old_val")("fileId"))("mimeType").default(""),
							filename: r.table(ATTACHMENT_TABLE).get(change("old_val")("fileId"))("filename").default(""),
							source: r.table(ATTACHMENT_TABLE).get(change("old_val")("fileId"))("source").default(""),
							expiration: r.table(ATTACHMENT_TABLE).get(change("old_val")("fileId"))("expiration").default("")
						}
					},
					change
				);
			});

		const onFeedItem = (change) => {
			if (!checkExpiration(change.new_val, targetId)) {
				handler(null, change);
			}
		};

		const onError = (err) => {
			console.log("AttachmentModel.streamAttachmentsByTarget changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("AttachmentModel.streamAttachmentsByTarget", q, onFeedItem, onError);
		return cancelFn;

	}
	catch (err) {
		console.log("error:", err);
		throw err;
	}
};

AttachmentModel.prototype.getByTargetId = async function (targetId) {
	try {
		const result = await r
			.table(ENTITY_ATTACHMENT_TABLE)
			.filter(r.row("targetId").eq(targetId))
			.pluck("fileId")
			.map(entityAttachment => {
				return r.table(ATTACHMENT_TABLE).filter(attachment => {
					return attachment("id")
						.eq(entityAttachment("fileId"))
						.and(
							attachment("deleted")
								.default(false)
								.eq(false)
						);
				})(0);
			})
			.run();

		const notExpired = result.filter(attachment => {
			return !checkExpiration(attachment, targetId);
		});

		return notExpired;
	} catch (err) {
		logger.error("getByTargetId", "There was an error while getting attachments by target id", { err });
		throw err;
	}
};

/**
 * Copy attachments
 * @param {string} userId
 * @param {string} targetId
 * @param {string} sourceId
 * @param {string} targetType
 * @param {boolean} notify
 */
AttachmentModel.prototype.copyAttachment = async function (userId, targetId, sourceId, targetType, notify) {
	try {
		const attachments = await this.getByTargetId(sourceId);

		if (!attachments || attachments.length == 0) {
			throw { message: "No attachments to copy.", code: 500 };
		}

		const locale = config.environment.locale;
		const translations = await geti18n(_global.appRequest, locale);
		const files = [];
		for (let i = 0; i < attachments.length; i++) {
			files.push(await fileStorage.copyFile(attachments[i]));
		}
		try {
			const res = await this.create(userId, targetId, targetType, files, notify, null, null, translations.ecosystem.activities.attachmentModel.create);
		} catch (err) {
			logger.error("copyAttachment", "There was an error creating a copy of the attachment.");
			throw err;
		}
		return files;
	} catch (err) {
		throw err;
	}
};

/**
 * Permanently delete a file from Minio and remove the associated entry from the sys_attachment table
 * @param {string} attachmentId
 * @param {boolean} deleteThumbnail
 */
AttachmentModel.prototype.hardDeleteAttachment = async function (attachmentId, deleteThumbnail) {
	try {
		const attachment = await r.table(ATTACHMENT_TABLE)
			.get(attachmentId)
			.run();

		// Delete file in Minio
		await fileStorage.deleteFile(attachment.handle, deleteThumbnail);

		// Delete attachment
		await r.table(ATTACHMENT_TABLE)
			.get(attachmentId)
			.delete()
			.run();

		return { success: true };
	}
	catch (ex) {
		logger.error(
			"hardDeleteByAttachmentId",
			"Error deleting attachment from Minio and attachment table",
			{ err: { message: ex.message, code: ex.code, stack: "/models/attachmentModel.js" } }
		);
		throw ex;
	}
};

/**
 * Permanently delete a file from Minio and remove the associated entries from sys_attachment and sys_entityAttachment
 * @param {string} attachmentId
 * @param {boolean} deleteThumbnail
 */
AttachmentModel.prototype.hardDeleteEntityAttachment = async function (attachmentId, deleteThumbnail) {
	try {
		const attachment = await r.table(ATTACHMENT_TABLE)
			.get(attachmentId)
			.run();

		// Delete file in Minio
		await fileStorage.deleteFile(attachment.handle, deleteThumbnail);

		// Delete attachment
		await r.table(ATTACHMENT_TABLE)
			.get(attachmentId)
			.delete()
			.run();

		// Delete entity attachment
		await r.table(ENTITY_ATTACHMENT_TABLE)
			.filter({ fileId: attachmentId })
			.delete()
			.run();

		return { success: true };
	}
	catch (ex) {
		logger.error(
			"hardDeleteByAttachmentId",
			"Error deleting attachment from Minio and all associated attachment tables",
			{ err: { message: ex.message, code: ex.code, stack: "/models/attachmentModel.js" } }
		);
		throw ex;
	}
};

/**
 * Update the the defaulImage property on the sys_entityAttachment table for the new default image
 * and the previous default image if available.
 * @param {string} attachmentId
 * @param {string} deleteThumbnail
 */
AttachmentModel.prototype.update = async function (attachmentId, targetId) {
	try {
		await r.table(ENTITY_ATTACHMENT_TABLE)
			.filter({ targetId })
			.filter({ "defaultImage": true })
			.update({ "defaultImage": false })
			.run();

		await r.table(ENTITY_ATTACHMENT_TABLE)
			.filter({ fileId: attachmentId })
			.update({ "defaultImage": true })
			.run();

		return { success: true };

	} catch (ex) {
		logger.error(
			"update",
			"Error updating attachment",
			{ err: { message: ex.message, code: ex.code, stack: "/models/attachmentModel.js" } }
		);
		throw ex;
	}
};

const checkExpiration = (attachment, targetId) => {
	let isExpired = false;

	if (attachment && attachment.expiration) {
		const today = moment().format("YYYY-MM-DD");
		if (attachment.expiration < today) {
			isExpired = true;
			this.removeExternal(targetId, attachment.fileId);
		}
	}

	return isExpired;
};