const fs = require("fs");
const esProvider = require("../../lib/es-provider");
const client = esProvider.get({ "requestTimeout": 30000 });
const moment = require("moment");

const baseDir = fs.existsSync("/ecosystem/init/data/") ? "/ecosystem/init/data" : "/app-server/init/data/";

module.exports.applyScript = async function () {
	const scriptName = "reindex-activity-notification-streams";

	try {

		// -- ensure latest templates have been applied
		const activityStreamTemplate = fs.readFileSync(`${baseDir}/elastic/index-templates/activity-stream.json`, "utf8");
		const putIndexTemplateResult = await client.transport.request({
			"method": "PUT", 
			"path": "/_template/activity-stream", 
			"body": JSON.parse(activityStreamTemplate)
		});
        
		console.log("Successfully updated activity-stream index template, result:", JSON.stringify(putIndexTemplateResult, null, 4));

		const notificationStreamTemplate = fs.readFileSync(`${baseDir}/elastic/index-templates/notification-stream.json`, "utf8");
		const putNotificationStreamIndexTemplateResult = await client.transport.request({
			"method": "PUT", 
			"path": "/_template/notification-stream", 
			"body": JSON.parse(notificationStreamTemplate)
		});
        
		console.log("Successfully updated notification-stream index template, result:", JSON.stringify(putNotificationStreamIndexTemplateResult, null, 4));

		// iterate over existing indexes requiring reindex, reindex and delete old index
		// could reindex back to original name again but because of wildcard queries this will still work for our purposes
		const indexesToReindex = await client.transport.request({
			"method": "GET", 
			"path": "/_cat/indices/activity-stream-*,notification-stream-*?s=i&format=JSON"
		});

		for(const index of indexesToReindex) {
			const taskResult = await client.reindex({
				"wait_for_completion": true,
				"body": {
					"source": {
						"index": index.index
					},
					"dest": {
						"index": index.index + "-ridx"
					}
				}
			});
			console.log(`Reindex ${index.index} with ${index["docs.count"]} docs complete, result: `, JSON.stringify(taskResult, null, 4));
			const deleteResult = await client.indices.delete({
				index: index.index
			});
			console.log("Delete Index result:", JSON.stringify(deleteResult, null, 4));
		}


		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {
			"success": false,
			err
		};
	}
};
