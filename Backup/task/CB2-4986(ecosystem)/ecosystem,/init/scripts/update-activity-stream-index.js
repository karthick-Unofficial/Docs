const fs = require("fs");
const esProvider = require("../../lib/es-provider");
const client = esProvider.get({ "requestTimeout": 30000 });
const moment = require("moment");

const baseDir = fs.existsSync("/ecosystem/init/data/") ? "/ecosystem/init/data" : "/app-server/init/data/";

module.exports.applyScript = async function () {
	const scriptName = "update-activity-stream-index";

	try {

		const activityStreamTemplate = fs.readFileSync(`${baseDir}/elastic/index-templates/activity-stream.json`, "utf8");
		const putIndexTemplateResult = await client.transport.request({
			"method": "PUT", 
			"path": "/_template/activity-stream", 
			"body": JSON.parse(activityStreamTemplate)
		});
        
		console.log("Successfully updated activity-stream index template, result:", JSON.stringify(putIndexTemplateResult, null, 4));


		const currentDate = moment();
		const currentActivityStreamIndex = `activity-stream-${currentDate.utc().format("YYYY.MM")}`;

		// Check for current activity stream index, bail if none found.
		try {
			await client.transport.request({
				"method": "GET", 
				"path": currentActivityStreamIndex
			});
		}
		catch (error) {
			console.log("Current activity stream index not found, skipping.");

			return {
				"success": true
			};
		}

		const taskResult = await client.reindex({
			"wait_for_completion": true,
			"body": {
				"source": {
					"index": currentActivityStreamIndex
				},
				"dest": {
					"index": currentActivityStreamIndex + "-old"
				}
			}
		});
		console.log("Reindex Complete, result: ", JSON.stringify(taskResult, null, 4));

		const deleteResult = await client.indices.delete({
			index: currentActivityStreamIndex
		});
		console.log("Delete Index result:", JSON.stringify(deleteResult, null, 4));


		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		const safeErr = {
			status: err.status,
			displayName: err.displayName,
			message: err.message,
			path: err.path
		};
		console.log(`There was an error with the ${scriptName} script:`, safeErr);
		return {
			"success": false,
			safeErr
		};
	}
};
