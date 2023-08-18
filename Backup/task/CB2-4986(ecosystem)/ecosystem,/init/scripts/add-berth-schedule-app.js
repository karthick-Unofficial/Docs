const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function() {
	const scriptName = "add-berth-schedule-app";

	try {
		const addToApplications = r
			.table("sys_application")
			.insert({
				appId: "berth-schedule-app",
				icon: "",
				id: "9573bc4e-cfea-4d53-9c4e-39d2dcdb15c8",
				name: "Berth Schedule"
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);

		const addToOrgApplications = r
			.table("sys_orgApplication")
			.insert({
				appId: "berth-schedule-app",
				id: "ares_security_corporation_berth-schedule-app",
				orgId: "ares_security_corporation"
			})
			.run();
		console.log(`${scriptName} update result: `, addToOrgApplications);

		const addToUserApplications = r
			.table("sys_userApplication")
			.insert({
				appId: "berth-schedule-app",
				config: {
					canView: true,
					role: "collaborator"
				},
				id: "2c9c0362-345b-4f33-9976-219a4566b9c3_berth-schedule-app",
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