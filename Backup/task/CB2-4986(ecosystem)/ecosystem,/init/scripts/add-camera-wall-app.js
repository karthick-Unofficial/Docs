const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
module.exports.applyScript = async function() {
	const scriptName = "add-camera-wall-app";

	try {
		const addToApplications = r
			.table("sys_application")
			.insert({
				appId: "camera-wall-app",
				icon: "",
				id: "239a8be8-52e6-4c1e-b841-f59db59e716d",
				name: "Camera Wall"
			})
			.run();
		console.log(`${scriptName} update result: `, addToApplications);

		const addToOrgApplications = r
			.table("sys_orgApplication")
			.insert({
				appId: "camera-wall-app",
				id: "ares_security_corporation_camera-wall-app",
				orgId: "ares_security_corporation"
			})
			.run();
		console.log(`${scriptName} update result: `, addToOrgApplications);

		const addToUserApplications = r
			.table("sys_userApplication")
			.insert({
				appId: "camera-wall-app",
				config: {
					canView: true,
					role: "collaborator"
				},
				id: "2c9c0362-345b-4f33-9976-219a4566b9c3_camera-wall-app",
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