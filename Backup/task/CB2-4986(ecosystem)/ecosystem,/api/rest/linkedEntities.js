const model = require("../../models/linkedEntitiesModel")();
const geti18n = require("node-app-core/dist/localize");
const config = require("../../config.json");

module.exports = function (app) {
	const restServer = app.rest;
	const realtimeServer = app.realtime;

	restServer.post("/linkedEntities", async function (req, res) {
		try {
			const { userId } = req.identity;
			const { linkedEntities } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { linkedEntitiesModel } = translations.ecosystem.activities;

			const result = await model.create(userId, linkedEntities, linkedEntitiesModel.create);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/linkedEntities/:linkedEntitiesId", async function (req, res) {
		try {
			const { userId } = req.identity;
			const { linkedEntitiesId } = req.routeVars;
			const { update } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { linkedEntitiesModel } = translations.ecosystem.activities;

			const result = await model.update(userId, linkedEntitiesId, update, linkedEntitiesModel.update);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});

	restServer.put("/linkedEntities", async function (req, res) {
		try {
			const { userId } = req.identity;
			const { entities, type } = req.body;
			const locale = config.environment.locale;
			const translations = await geti18n(app.appRequest, locale);
			const { linkedEntitiesModel } = translations.ecosystem.activities;

			const result = await model.delete(userId, entities, type, linkedEntitiesModel.delete);
			res.send(result);
		}
		catch (ex) {
			res.err(ex.message, ex);
		}
	});


	realtimeServer.pubsub("/linkedEntities", async function (sub) {
		try {
			const result = await model.streamLinkedEntities(
				sub.identity.userId,
				sub.args.entityId,
				sub.args.entityType,
				sub.args.linkType,
				function (err, record) {
					if (err) {
						console.log(err);
					}
					sub.pub(record);
				});
			const cancelFn = result;
			sub.events.on("disconnect", () => {
				cancelFn();
			});
		} catch (reason) {
			sub.pub(reason);
		}
	});

};