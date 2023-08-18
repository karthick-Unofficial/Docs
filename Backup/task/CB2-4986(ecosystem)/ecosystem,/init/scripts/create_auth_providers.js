const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;


module.exports.applyScript = async function () {
	const scriptName = "create_auth_providers";

	try {
		// Create table -------------------------------------------------
		const tables = ["sys_authProviders"];
		const tableList = await r.tableList().run();

		for (let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				console.log(`Created table ${table}`, tc, ctResult);
			}
		}
		// --------------------------------------------------------------


		// Custom code ---------------------------------------------------
		const orgUpdateResult = await r.table("sys_organization").update({authProviderId: "system"}).run();
		console.log(`Updated organizations with default authProviderId in table: ${"sys_organization"}`, orgUpdateResult);

		const systemAuthProviderResult = await r.table("sys_authProviders")
			.insert({
				orgId: null,
				providerId: "system",
				id: "system",
				connection: {}
			});
		console.log(`Added default system authProvider in table: ${"sys_authProviders"}`, systemAuthProviderResult);

		const userUpdateResult = await r.table("sys_user")
			.filter(function(user) {
				return user.hasFields("authProviderId").not();
			})
			.update({"authProviderId": "system"})
			.run();
		console.log("Added default system authProvider to users: ", userUpdateResult);
		// ---------------------------------------------------------------

		// Finished, return success: true
		return { "success": true };
	}
	catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { "success": false, err };
	}
};