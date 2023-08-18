const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function () {
	const scriptName = "add-champ-app";

	try {
		const addToApplications = await r
			.table("sys_application")
			.insert({
				appId: "champ-app",
				icon: "",
				id: "a645d836-08d9-4940-860d-dc72cdd13859",
				name: "Champ",
				permissionOptions: []
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);

		const addToOrgApplications = await r
			.table("sys_orgApplication")
			.insert({
				appId: "champ-app",
				id: "ares_security_corporation_champ-app",
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