const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-list-feed.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-list-feed";
	const feedType = {
		"appId": "lists-app",
		"entityType": "list",
		"feedIcon": "Lists",
		"feedId": "",
		"isShareable": true,
		"metadata": {
			"for": "integration server"
		},
		"name": "",
		"ownerOrg": "",
		"source": "app",
		"streamProperties": [{
			"alwaysSend": false,
			"batch": "globalData",
			"properties": {
				"compare": [
					"category",
					"name",
					"isPublic",
					"columns",
					"rows"
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
					"rows"
				],
				"update": [
					"name",
					"columns",
					"category",
					"feedId",
					"owner",
					"ownerOrg",
					"isPublic",
					"rows"
				]
			}
		}
		]
	};

	try {
		const orgs = await r.table("sys_organization").run();

		if (orgs.length) {
			const orgIntUpdate = [];
			const feedTypeUpdate = orgs.map(org => {
				const newFeedType = { ...feedType };
				newFeedType.feedId = `${org.orgId}_lists`;
				newFeedType.name = `${org.name} Lists`;
				newFeedType.ownerOrg = org.orgId;
				orgIntUpdate.push({
					"config": {},
					"feedOwnerOrg": org.orgId,
					"id": `${org.orgId}_lists`,
					"intId": `${org.orgId}_lists`,
					"orgId": org.orgId,
					"policy": {
						"type": "owner"
					}
				});
				return newFeedType;
			});

			if (feedTypeUpdate.length) {
				for (let i = 0; i < feedTypeUpdate.length; i++) {
					const facilityFeedResult = await r.table("sys_feedTypes")
						.filter({
							"feedId": feedTypeUpdate[i].feedId
						});
					if (!facilityFeedResult.length) {
						const result = await r.table("sys_feedTypes").insert(feedTypeUpdate[i]).run();
						logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
					}
				}
			}
			if (orgIntUpdate.length) {
				for (let i = 0; i < orgIntUpdate.length; i++) {
					const orgIntegrationResult = await r.table("sys_orgIntegration")
						.filter({
							"id": orgIntUpdate[i].id
						});
					if (!orgIntegrationResult.length) {
						const result = await r.table("sys_orgIntegration").insert(orgIntUpdate[i]).run();
						logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
					}

				}
			}


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