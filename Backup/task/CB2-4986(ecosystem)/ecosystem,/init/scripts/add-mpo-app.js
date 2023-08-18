const provider = require("../../lib/rethinkdbProvider");
const r = provider.r;
module.exports.applyScript = async function () {
	const scriptName = "add-mpo-app";

	try {
		const appEntryExists = await r
			.table("sys_application")
			.filter({appId: "mpo-app"})
			.count()
			.gt(0)
			.run();

		if (!appEntryExists) {
			const addToApplications = await r
				.table("sys_application")
				.insert({
					appId: "mpo-app",
					icon: "",
					id: "ce81aa7b-3e4c-42b9-8e32-f943ee7a5c7c",
					name: "MPO",
					permissionOptions: [ "manage", "admin" ]
				})
				.run();
			console.log(`${scriptName} add to applications result: `, addToApplications);
		}

		const orgApplicationEntryExists = await r
			.table("sys_orgApplication")
			.filter({appId: "mpo-app"})
			.count()
			.gt(0)
			.run();

		if (!orgApplicationEntryExists) {	
			const orgs = await r.table("sys_organization")
				.filter({ name: "Ares Security Corporation" })
				.pluck("orgId")
				.run();

			if (orgs && orgs.length > 0) {
				const addToOrgApplications = await r
					.table("sys_orgApplication")
					.insert({
						appId: "mpo-app",
						id: "ares_security_corporation_mpo-app",
						orgId: orgs[0].orgId
					})
					.run();
				console.log(`${scriptName} add to orgApplication result: `, addToOrgApplications);

				// Setup role mappings for standard roles
				const roleApplicationEntriesExist = await r
					.table("sys_roleApplication")
					.filter({appId: "mpo-app"})
					.count()
					.gt(0)
					.run();

				if (!roleApplicationEntriesExist) {	
					await r
						.table("sys_roleApplication")
						.insert({
							appId: "mpo-app",
							config: {
								canView: true,
								role: "viewer"
							},
							permissions: [
								"manage",
								"admin"
							],
							roleId: "ares_security_corporation_org_admin"
						})
						.run();

					await r
						.table("sys_roleApplication")
						.insert({
							appId: "mpo-app",
							config: {
								canView: true,
								role: "viewer"
							},
							permissions: [],
							roleId: "ares_security_corporation_org_user"
						})
						.run();
						
					console.log(`${scriptName} role application entries added`);
				}
			} else {
				console.log("Ares Security Corporation org not found. MPO app will need to be configured manually.");
			}
		}

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};