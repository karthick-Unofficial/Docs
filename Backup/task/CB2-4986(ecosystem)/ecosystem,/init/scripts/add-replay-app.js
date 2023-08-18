const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function () {
	const scriptName = "add-replay-app";

	try {
		const addToApplications = r
			.table("sys_application")
			.insert({
				appId: "replay-app",
				icon: "",
				id: "b8f49287-98a6-41a3-ba03-c6e947b4de8e",
				name: "Replay",
				permissionOptions: []
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);

		const addToOrgApplications = r
			.table("sys_orgApplication")
			.insert({
				appId: "replay-app",
				id: "ares_security_corporation_replay-app",
				orgId: "ares_security_corporation"
			})
			.run();
		console.log(`${scriptName} update result: `, addToOrgApplications);

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};