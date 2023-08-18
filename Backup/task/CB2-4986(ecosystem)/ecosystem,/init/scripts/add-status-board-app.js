const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/add-status-board-app.js"
);

module.exports.applyScript = async function() {
	const scriptName = "add-status-board-app";

	try {
		const addToApplications = r.table("sys_application")
			.insert({
				appId: "status-board-app",
				icon: "",
				id: "2b51113d-21a3-4eea-ac5b-9a121e31dda7",
				name: "Status Board"
			})
			.run();
        
		logger.info("applyScript", `${scriptName} update result: ${addToApplications}`);
        
		const addToOrgApplications = r.table("sys_orgApplication")
			.insert({
				appId: "status-board-app",
				id: "ares_security_corporation_status-board-app",
				orgId: "ares_security_corporation"
			})
			.run();

		logger.info("applyScript", `${scriptName} update result: ${addToOrgApplications}`);

		const addToUserApplications = r.table("sys_userApplication")
			.insert({
				appId: "status-board-app",
				config: {
					canView: true,
					role: "collaborator"
				},
				id: "2c9c0362-345b-4f33-9976-219a4566b9c3_status-board-app",
				userId: "2c9c0362-345b-4f33-9976-219a4566b9c3"
			})
			.run();
            
		logger.info("applyScript", `${scriptName} update result: ${addToUserApplications}`);

		// Finished, return success: true
		return {"success": true};
	}
	catch(err) {
		logger.error("applyScript", `There was an error with the ${scriptName} script`, {err: {message: err.message, stack: err.stack}});
		return {"success": false, err};
	}
};