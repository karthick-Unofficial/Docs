const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-facility-feed-id.js"
);

module.exports.applyScript = async function() {
	const scriptName = "add-facility-feed-id";

	try {
		const facilities = await r.table("sys_facility");

		if (facilities.length) {
			const updatedFacilities = [];
			facilities.forEach(facility => {
				if (!facility.feedId) {
					facility.feedId = `${facility.ownerOrg}_facilities`;
					updatedFacilities.push(facility);
				}
			});
			if (updatedFacilities.length) {
				for (let i = 0; i < updatedFacilities.length; i++) {
					const result = await r.table("sys_facility")
						.get(updatedFacilities[i].id)
						.update(updatedFacilities[i]).run();
					logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);
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