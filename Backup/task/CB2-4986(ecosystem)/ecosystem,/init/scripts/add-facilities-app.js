const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function() {
	const scriptName = "add-facilities-app";

	try {
		const addToApplications = r
			.table("sys_application")
			.insert({
				appId: "facilities-app",
				icon: "",
				id: "ad543aca-1236-4851-b266-0b99659780ec",
				name: "Facilities"
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);

		const addToOrgApplications = r
			.table("sys_orgApplication")
			.insert({
				appId: "facilities-app",
				id: "ares_security_corporation_facilities-app",
				orgId: "ares_security_corporation"
			})
			.run();
		console.log(`${scriptName} update result: `, addToOrgApplications);

		const addToUserApplications = r
			.table("sys_userApplication")
			.insert({
				appId: "facilities-app",
				config: {
					canView: true,
					role: "collaborator"
				},
				id: "2c9c0362-345b-4f33-9976-219a4566b9c3_facilities-app",
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