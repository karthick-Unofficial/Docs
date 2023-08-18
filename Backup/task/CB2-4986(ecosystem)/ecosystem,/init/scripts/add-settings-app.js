const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function() {
	const scriptName = "add-settings-app";

	try {
		const addToApplications = r
			.table("sys_application")
			.insert({
				appId: "settings-app",
				icon: "",
				id: "f9a6c111-57e1-4192-a9c1-77836011c0ab",
				name: "Settings",
				permissionOptions: []
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);
		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};