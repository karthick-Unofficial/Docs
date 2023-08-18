const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/update-application-entity-type-table.js"
);


module.exports.applyScript = async function() {
	const scriptName = "update-application-entity-type-table";

	try {
		// -- add cameras-app entities
		const camerasAppId = "cameras-app";
		const cameraEntityTypes = ["camera", "collection", "facility", "shape", "shapes", "track", "event"].map(entityType => {
			return {
				appId: camerasAppId,
				entityType
			};
		});
		const cameraMapRows = await r.table("sys_applicationEntityType")
			.filter(
				r.row("appId").eq(camerasAppId)
			);
		if (cameraMapRows.length === 0) {
			const result = await r.table("sys_applicationEntityType")
				.insert(cameraEntityTypes);
			logger.info(
				"applyScript",
				`Updated table ${"sys_applicationEntityType"} with ${camerasAppId} entities: ${result}`,
				null
			);
		}

		// -- add facilities-app entities
		const facilitiesAppId = "facilities-app";
		const facilityEntityTypes = ["camera", "facility", "shape", "shapes", "track", "event"].map(entityType => {
			return {
				appId: facilitiesAppId,
				entityType
			};
		});
		const facilityMapRows = await r.table("sys_applicationEntityType")
			.filter(
				r.row("appId").eq(facilitiesAppId)
			);
		if (facilityMapRows.length === 0) {
			const result = await r.table("sys_applicationEntityType")
				.insert(facilityEntityTypes);
			logger.info(
				"applyScript",
				`Updated table ${"sys_applicationEntityType"} with ${facilitiesAppId} entities: ${result}`,
				null
			);
		}

		// -- add events-app entities
		const eventsAppId = "events-app";
		const eventEntityTypes = ["camera", "facility", "shape", "shapes", "track", "event"].map(entityType => {
			return {
				appId: eventsAppId,
				entityType
			};
		});
		const eventMapRows = await r.table("sys_applicationEntityType")
			.filter(
				r.row("appId").eq(eventsAppId)
			);
		if (eventMapRows.length === 0) {
			const result = await r.table("sys_applicationEntityType")
				.insert(eventEntityTypes);
			logger.info(
				"applyScript",
				`Updated table ${"sys_applicationEntityType"} with ${eventsAppId} entities: ${result}`,
				null
			);
		}

		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};