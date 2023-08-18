const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/remove-cb-load-tester.js"
);

module.exports.applyScript = async function () {
	const scriptName = "remove-cb-load-tester";

	try {
		r.table("sys_orgApplication")
			.filter({ appId: "cb-load-tester" })
			.delete()
			.run();

		r.table("sys_userApplication")
			.filter({ appId: "cb-load-tester" })
			.delete()
			.run();

		r.table("sys_application")
			.filter({ appId: "cb-load-tester" })
			.delete()
			.run();
		

		logger.info(
			"applyScript",
			`Result of ${scriptName}: "cb-load-tester removed"`,
			null
		);

		return { success: true };
	} catch (err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, { err: { message: err.message, stack: err.stack } });
		return { success: false, err };
	}
};
