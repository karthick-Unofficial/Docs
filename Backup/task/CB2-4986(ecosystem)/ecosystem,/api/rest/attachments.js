const model = require("../../models/attachmentModel")({});
const AttachmentLogic = require("../../logic/attachment");
const logic = new AttachmentLogic();
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = function (app) {

	const restServer = app.rest;

	// cb2-notes-attachment
	restServer.get("/attachments/:handle/download", async function (req, res) {
		try {
			const result = await logic.getAttachmentFile(req);
			res.setContentType(result.attachment.mimeType);
			res.send(result.file, "binary");
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/attachments/:handle/object", async function (req, res) {
		try {
			const result = await logic.getAttachmentFile(req);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err);
		}
	});

	restServer.get("/attachments/:targetId", async function (req, res) {
		try {
			const result = await model.getByTargetId(req.routeVars.targetId);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

	restServer.get("/attachments/authorize/:targetId/:targetType", async function (req, res) {
		try {
			const result = await model.hasPermission(req.identity.userId, req.routeVars.targetId, req.routeVars.targetType);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

	restServer.post("/attachments", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { attachmentModel } = translations.ecosystem.activities;
			const result = await model.create(
				req.identity.userId,
				req.body.targetId,
				req.body.targetType,
				req.body.files,
				req.body.notify,
				req.body.source,
				req.body.expiration,
				attachmentModel.create
			);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

	/**
	 * Remove an attachment from a specific target. If file is no longer
	 * attached to anything, remove the file
	 */
	restServer.delete("/attachments/:targetId/:fileId", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { attachmentModel } = translations.ecosystem.activities;
			const result = await model.remove(
				req.identity.userId,
				req.routeVars.targetId,
				req.body.targetType,
				req.routeVars.fileId,
				attachmentModel.remove
			);
			res.send(result);
		}
		catch (err) {
			res.err(err.message, err.err);
		}
	});

	/**
	 * Delete an attachment regardless of how many things it is attached to
	 * and remove all entries from sys_attachment and sys_entityAttachment
	 */
	restServer.delete("/attachments/:handle", async function (req, res) {
		try {
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { attachmentModel } = translations.ecosystem.activities;
			const result = await model.delete(
				req.identity.userId,
				req.routeVars.handle,
				attachmentModel.delete
			);
			res.send(result);
		}
		catch (err) {
			res.send(err);
		}
	});

	/**
	 * Update an attachment on a specific target.
	 */
	restServer.put("/attachments/update/:fileId/:targetId", async function (req, res) {
		await model.update(
			req.routeVars.fileId,
			req.routeVars.targetId
		);
	});

};
