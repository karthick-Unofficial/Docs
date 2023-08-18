const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const {
	Logger
} = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-default-facility-feed-type.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-default-facility-feed-type";
	const defaultFacilityFeedType = {
		"appId": "facilities-app",
		"entityType": "facility",
		"feedIcon": "Facilities",
		"feedId": "facilities",
		"isShareable": true,
		"metadata": {
			"for": "integration server"
		},
		"source": "app",
		"streamProperties": [{
			"alwaysSend": false,
			"batch": "globalData",
			"properties": {
				"compare": [
					"entityData_properties_description",
					"entityData_properties_name",
					"isPublic"
				],
				"initial": [
					"createdDate",
					"entityData_properties",
					"entityType",
					"feedId",
					"id",
					"isPublic",
					"owner",
					"ownerOrg"
				],
				"update": [
					"entityData_properties_description",
					"entityData_properties_name",
					"entityData_properties_type",
					"entityType",
					"feedId",
					"owner",
					"ownerOrg",
					"isPublic"
				]
			}
		},
		{
			"alwaysSend": true,
			"batch": "globalGeo",
			"properties": {
				"compare": [
					"entityData_geometry"
				],
				"initial": [
					"entityData_geometry",
					"isPublic",
					"owner",
					"feedId"
				],
				"update": [
					"entityData_geometry",
					"isPublic",
					"owner",
					"feedId"
				]
			}
		}
		]
	};
	try {
		const facilityFeedResult = await r.table("sys_feedTypes")
			.filter({
				"feedId": "facilities"
			});
		if (!facilityFeedResult.length) {
			const result = await r.table("sys_feedTypes").insert(defaultFacilityFeedType).run();
			logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
		}
		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {
			err: {
				message: err.message,
				stack: err.stack
			}
		});
		return {
			"success": false,
			err
		};
	}

};