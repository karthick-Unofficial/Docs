const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const {
	Logger,
	SYSTEM_CODES
} = require("node-app-core/dist/logger");
const logger = new Logger("ecosystem", "/init/scripts/add-collection-entity-type.js");

module.exports.applyScript = async function () {
	const scriptName = "add-camera-wall-app";

	try {
		const collectionEntityType = await r.table("sys_entityType").filter(r.row("name").default("").eq("collection"))(0).default("");

		if (!collectionEntityType) {
			const addToEntityType = await r
				.table("sys_entityType")
				.insert({
					name: "collection",
					sourceTable: "sys_entityCollections"
				})
				.run();
			console.log(`${scriptName} update result: `, addToEntityType);
		}

		return {
			success: true
		};
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {
			err: err
		});
		return {
			"success": false,
			err
		};
	}
};