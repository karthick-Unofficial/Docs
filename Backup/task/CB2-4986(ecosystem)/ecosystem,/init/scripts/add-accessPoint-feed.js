const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-accessPoint-feed.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-accessPoint-feed";
	const feedType = {
		"appId": "map-app",
		"entityType": "accessPoint",
		"feedIcon": "accessPoint",
		"feedId": "accessPoint",
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
						"entityData_properties_description",
						"entityData_properties_name",
						"fov",
						"isPublic",
						"entityData_displayTargetId",
						"entityData_displayType"
					],
					"initial": [
						"entityData_properties_description",
						"entityData_properties_deviceType",
						"entityData_properties_id",
						"entityData_properties_name",
						"entityData_properties_type",
						"entityData_properties_id",
						"cameraSystem",
						"connection",
						"controls",
						"entityType",
						"feedId",
						"fov",
						"id",
						"isPublic",
						"owner",
						"ownerOrg",
						"video",
						"player",
						"entityData_displayTargetId",
						"entityData_displayType",
						"control"
					],
					"update": [
						"entityData_properties_description",
						"entityData_properties_name",
						"fov",
						"owner",
						"isPublic",
						"feedId",
						"entityData_displayTargetId",
						"entityData_displayType"
					]
				}
			},
			{
				"alwaysSend": true,
				"batch": "globalGeo",
				"properties": {
					"compare": [
						"entityData_geometry",
						"spotlightShape",
						"entityData_displayTargetId",
						"entityData_displayType"
					],
					"initial": [
						"entityData_geometry",
						"entityData_properties_id",
						"entityData_properties_name",
						"controls",
						"isPublic",
						"owner",
						"spotlightShape",
						"entityType",
						"entityData_displayTargetId",
						"entityData_displayType",
						"control",
						"entityData_properties_type",
						"feedId"
					],
					"update": [
						"entityData_geometry",
						"isPublic",
						"owner",
						"spotlightShape",
						"entityData_displayTargetId",
						"entityData_displayType"
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
				newFeedType.feedId = "accessPoint";
				newFeedType.name = "Access Point";
				newFeedType.ownerOrg = org.orgId;
				orgIntUpdate.push({
					"config": {},
					"feedOwnerOrg": org.orgId,
					"id": `${org.orgId}_accessPoint`,
					"intId": "accessPoint",
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
					const roleIntegrationResult = await r.table("sys_roleIntegration")
						.filter({
							"id": orgIntUpdate[i].id
						});
					if (!orgIntegrationResult.length) {

						const orgIntResult = await r.table("sys_orgIntegration").insert(orgIntUpdate[i]).run();
						logger.info("applyScript", `Result of ${scriptName}: ${orgIntResult}`, null);

					}
					if (!roleIntegrationResult.length) {
						const roleIntegrationData = {
							"config": {
								"canView": true,
								"role": "viewer"
							},
							"feedOwnerOrg": orgIntUpdate[i].feedOwnerOrg,
							"intId": "accessPoint",
							"lastModifiedDate": new Date(),
							"orgIntId": `${orgIntUpdate[i].feedOwnerOrg}_accessPoint`,
							"permissions": [
								"manage",
								"control"
							],
							"roleId": "ares_security_corporation_org_admin"
						};
						const roleIntResult = await r.table("sys_roleIntegration").insert(roleIntegrationData).run();
						logger.info("applyScript", `Result of ${scriptName}: ${roleIntResult}`, null);
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