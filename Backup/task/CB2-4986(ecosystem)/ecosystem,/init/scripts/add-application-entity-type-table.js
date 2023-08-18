const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-application-entity-type-table.js"
);


module.exports.applyScript = async function() {
	const scriptName = "add-application-entity-type-table";

	try {
		// -- create sys_applicationEntityType table
		const tables = ["sys_applicationEntityType"];
		const tableList = await r.tableList().run();
		for(let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				logger.info(
					"applyScript",
					`Created table ${table}: ${ctResult}`,
					null
				);
			}
		}

		// -- add map-app entities
		const appId = "map-app";
		const mapEntityTypes = ["camera", "collection", "facility", "shape", "shapes", "track", "event"].map(entityType => {
			return {
				appId,
				entityType
			};
		});
		const mapRows = await r.table("sys_applicationEntityType")
			.filter(
				r.row("appId").eq("map-app")
			);
		if (mapRows.length === 0) {
			const result = await r.table("sys_applicationEntityType")
				.insert(mapEntityTypes);
			logger.info(
				"applyScript",
				`Updated table ${"sys_applicationEntityType"}: ${result}`,
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