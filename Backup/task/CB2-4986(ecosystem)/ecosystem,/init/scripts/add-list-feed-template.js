const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-list-feed-template.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-list-feed-template";
	const feedType = {
		"appId": "lists-app",
		"entityType": "list",
		"feedIcon": "Lists",
		"feedId": "lists",
		"isShareable": true,
		"metadata": {
			"for": "integration server"
		},
		"name": "",
		"ownerOrg": "",
		"source": "app",
		"streamProperties": [
			{
				"alwaysSend": false,
				"batch": "globalData",
				"properties": {
					"compare": [
						"category",
						"name",
						"isPublic",
						"columns",
						"rows",
						"noPagination"
					],
					"initial": [
						"createdDate",
						"category",
						"columns",
						"targetType",
						"targetId",
						"name",
						"feedId",
						"id",
						"isPublic",
						"owner",
						"ownerOrg",
						"rows",
						"noPagination"
					],
					"update": [
						"name",
						"columns",
						"category",
						"feedId",
						"owner",
						"ownerOrg",
						"isPublic",
						"rows",
						"noPagination"
					]
				}
			}
		]
	};

	try {
		const feedTypes = await r.table("sys_feedTypes").filter(r.row("feedId").eq("lists")).run();
		if (!feedTypes[0]) {
			await r.table("sys_feedTypes").insert(feedType).run();
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