"use strict";
const DAILY_BRIEF_TABLE = "sys_dailyBrief";
const ATTACHMENT_TABLE = "sys_attachment";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const activityModel = require("../models/activityModel")();
const ajv = require("../models/schema/additionalKeywords.js");
const validate = ajv.compile(require("./schema/dailyBrief.json"));

module.exports = dailyBriefModel;

function dailyBriefModel(options) {
	if (!(this instanceof dailyBriefModel)) return new dailyBriefModel(options);
	const self = this;
	self.options = options;
}

// {
//     "title": String,
//     "description": String,
//     "owner": String,
//     "startDate": Date,
//     "endDate": Date,
//     "orgId": String,
//     "attachments": Array
// }

/**
 *  create:
 * @param userId
 * @param orgId
 * @param post
 */
dailyBriefModel.prototype.create = async function (userId, orgId, post, translations) {
	const self = this;
	post.createdDate = new Date();
	post.lastModifiedDate = new Date();
	try {

		// let fileList = "";
		// var attachments = [];
		// for(var i=0; i < files.length; i++) {
		//     var file = files[i];
		//     attachments.push({
		//         "app": app,
		//         "createdBy": userId,
		//         "targetType": targetType,
		//         "targetId": targetId,
		//         "createdDate": new Date(),
		//         "filename": file.name,
		//         "handle": file.handle,
		//         "mimeType": file.type
		//     });
		//     fileList += file.name + (i>0 && i < files.length - 1 ? ", " : "");
		//     // -- todo: check result
		// }

		// console.log("attachments:", attachments);
		// var result = yield r.expr([
		//                     (DAILY_BRIEF_TABLE).insert(post, {returnChanges: true}),
		//                     (r.table(ATTACHMENT_TABLE).insert(attachments).run(), {returnChanges: true})
		//                     ])
		//     .run()
		// var document = result.changes[0].new_val;

		if (!validate(post)) {
			return { "message": "Validation Error", "err": validate.errors };
		}

		const result = await r.table(DAILY_BRIEF_TABLE).insert(post, { returnChanges: true }).run();
		const brief = result.changes[0].new_val;

		const activity = {
			"summary": "",
			"type": "created",
			"actor": activityModel.generateObject("user", userId),
			"object": activityModel.generateObject("brief", brief.id, brief.title),
			"target": activityModel.generateObject("organization", orgId),
			"to": [{
				"token": `organization:${orgId}`,
				"system": true,
				"email": false,
				"pushNotification": false
			}]
		};

		activity.summary = `${activity.actor.name} ${translations.summary.posted} ${activity.object.name} ${translations.summary.inDailyBrief}`;
		activityModel.queueActivity(activity);

		return result;
	} catch (err) {
		return { "message": err, "err": err };
	}
};

/**
 *  delete:
 * @param id
 */
dailyBriefModel.prototype.delete = async function (id) {
	const self = this;
	const lastModifiedDate = new Date();
	try {
		const result = await r.table(DAILY_BRIEF_TABLE)
			.get(id)
			.update({ "deleted": true })
			.run();
		return result;
	} catch (err) {
		throw err;
	}
};

/**
 *  update:
 * @param id
 * @param post
 */
dailyBriefModel.prototype.update = async function (userId, orgId, id, post, translations) {
	const self = this;
	const lastModifiedDate = new Date();
	try {
		const result = await r.table(DAILY_BRIEF_TABLE)
			.get(id)
			.update(post, { returnChanges: true })
			.run();

		const brief = result.changes[0].new_val;

		const activity = {
			"summary": "",
			"type": "edited",
			"actor": activityModel.generateObject("user", userId),
			"object": activityModel.generateObject("brief", brief.id, brief.title),
			"target": activityModel.generateObject("organization", orgId),
			"to": [{
				"token": `organization:${orgId}`,
				"system": true,
				"email": false,
				"pushNotification": false
			}]
		};

		activity.summary = `${activity.actor.name} ${translations.summary.updated} ${activity.object.name}  ${translations.summary.dailyBriefModel}`;
		activityModel.queueActivity(activity);

		return result;
	} catch (err) {
		throw err;
	}
};

/**
 *  delete:
 * @param orgId
 */
dailyBriefModel.prototype.streamByOrg = async function (orgId, handler) {
	const self = this;

	let isInitialState = true;
	let initialCounter = 0;
	const initialPosts = [];

	try {
		const q = r.table(DAILY_BRIEF_TABLE)
			.filter({ "orgId": orgId })
			.filter({ "deleted": false }, { default: true })
			.changes({ "includeInitial": true, "includeTypes": true, "includeStates": true });

		const onFeedItem = (change) => {
			if (change.state) {
				if (change.state === "initializing") {
					isInitialState = true;
				}
				else {
					isInitialState = false;
					// -- send initial batches
				}
			} else {
				if (isInitialState) {
					initialCounter++;
					r.table(DAILY_BRIEF_TABLE)
						.filter({ id: change.new_val.id })
						.merge(function (brief) {
							return {
								attachments: r.table(ATTACHMENT_TABLE)
									.filter({ targetId: brief("id") })
									.coerceTo("ARRAY")
							};
						})
						.then(function (result) {
							const withAttachments = Object.assign({}, change, { new_val: result[0] });
							initialPosts.push(withAttachments);
							if (initialPosts.length === initialCounter) {
								handler(null, { "type": "initial-batch", "changes": initialPosts });
							}
						});
				}
				else {
					if (!change.new_val) {
						handler(null, change);
						return;
					}
					r.table(DAILY_BRIEF_TABLE)
						.filter({ id: change.new_val.id })
						.filter({ "deleted": false }, { default: true })
						.merge(function (brief) {
							return {
								attachments: r.table(ATTACHMENT_TABLE)
									.filter({ targetId: brief("id") })
									.coerceTo("ARRAY")
							};
						})
						.then(function (result) {
							const withAttachments = Object.assign({}, change, { new_val: result[0] });
							handler(null, withAttachments);
						});
				}
			}
		};

		const onError = (err) => {
			console.log("dailyBriefModel.streamByOrg changefeed error", err);
			handler(err, null);
		};

		const cancelFn = provider.processChangefeed("dailyBriefModel.streamByOrg", q, onFeedItem, onError);
		return cancelFn;


	}
	catch (err) {
		console.log("error:", err);
		throw err;
	}
};



