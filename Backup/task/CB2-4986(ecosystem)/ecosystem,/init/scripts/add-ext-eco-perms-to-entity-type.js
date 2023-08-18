const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-ext-eco-perms-to-entity-type.js"
);

module.exports.applyScript = async function () {
	const scriptName = "add-ext-eco-perms-to-entity-type";

	try {

		const result = await r.table("sys_entityType")
			.update((row) => {
				return {
					"externalEcoPermissionOptions": row("permissionOptions")
						.filter((item) => item.ne("manage"))
				};
			});

		logger.info("applyScript", `Result of ${scriptName}: ${result}`, null);

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