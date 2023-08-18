const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function() {
	const scriptName = "add-law-enforcement-search-app";

	try {
		const addToApplications = await r
			.table("sys_application")
			.insert({
				appId: "law-enforcement-search-app",
				icon: "",
				id: "74aa22dc-fcdb-4184-bb33-c82fe483d6fe",
				name: "LE Search"
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);

		const addToOrgApplications = await r
			.table("sys_orgApplication")
			.insert({
				appId: "law-enforcement-search-app",
				id: "ares_security_corporation_law-enforcement-search-app",
				orgId: "ares_security_corporation"
			})
			.run();
		console.log(`${scriptName} update result: `, addToOrgApplications);

		const addToUserApplications = await r
			.table("sys_userApplication")
			.insert({
				appId: "law-enforcement-search-app",
				config: {
					canView: true,
					role: "collaborator"
				},
				id: "2c9c0362-345b-4f33-9976-219a4566b9c3_law-enforcement-search-app",
				userId: "2c9c0362-345b-4f33-9976-219a4566b9c3"
			})
			.run();
		console.log(`${scriptName} update result: `, addToUserApplications);

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};
