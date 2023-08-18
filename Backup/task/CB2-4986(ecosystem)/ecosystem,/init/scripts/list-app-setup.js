const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger(
	"ecosystem",
	"/init/scripts/list-app-setup.js"
);

module.exports.applyScript = async function() {
	const scriptName = "list-app-setup";
	try {
		// Create list category table
		const tables = ["sys_listCategories"];
		const tableList = await r.tableList().run();
        
		for(let i = 0; i < tables.length; i++) {
			const table = tables[i];
			// If table doesn't exist, create it
			if (!tableList.includes(table)) {
				const tc = config.tableConfig || {};
				const ctResult = await r.tableCreate(table, tc).run();
				console.log(`Created table ${table}`, tc, ctResult);
			}
		}

		// Add application for lists app
		const addToApplications = r.table("sys_application")
			.insert({
				"appId": "lists-app",
				"icon": "",
				"id": "fc45005c-8ebd-49fa-9372-ae751c420462",
				"name": "Lists"
			})
			.run();
        
		logger.info("applyScript", `${scriptName} update result: ${addToApplications}`);
        
		const addToOrgApplications = r.table("sys_orgApplication")
			.insert({
				appId: "lists-app",
				id: "ares_security_corporation_lists-app",
				orgId: "ares_security_corporation"
			})
			.run();

		logger.info("applyScript", `${scriptName} update result: ${addToOrgApplications}`);
        
		// Old lists
		const oldRecs = await r
			.table("sys_list")
			.filter(function(list) {
				// Only old lists have no columns
				return list.hasFields("columns").not();
			})
			.run();

		// If there are lists to update
		if (oldRecs[0]) {
			const updatedRecs = oldRecs.map((list) => {
				const {createdDate, deleted, id, isPublic, lastModifiedDate, owner, ownerOrg, properties, rows, targetId, targetType, title, type} = list;

				if (type === "text") {
    
					const newRows = rows.map((row, index) => {
						return {
							data: row,
							order: index
						};
					});

					const newCols = properties.map((col, index) => {
						const val = {
							defaultValue: "",
							id: col.property,
							name: col.label,
							order: index,
							type: "text"
						};

						// If first item, set required property
						if(index === 0) {
							val.required = true;
						}

						return val;
					});
        
					return {
						category: null,
						createdDate: createdDate,
						deleted: deleted,
						id: id,
						isPublic: isPublic,
						lastModifiedDate: lastModifiedDate,
						name: title,
						owner: owner,
						ownerOrg: ownerOrg,
						targetId: targetId,
						targetType: targetType,
						rows: newRows,
						columns: newCols
					};
				} else if (type === "checklist") {

					const newRows = rows.map((row, index) => {
						return {
							data: {
								item: row.text,
								completed: row.checked
							},
							order: index
						};
					});

					const newCols = [
						{
							defaultValue: "",
							id: "item",
							name: "Item",
							order: 0,
							required: true,
							type: "text"
						},
						{
							defaultValue: "not-checked",
							id: "completed",
							name: "Completed",
							options: [
								{
									id:  "not-checked",
									name:  "Not Checked",
									value: false
								},
								{
									id:  "checked",
									name:  "Checked",
									value: true
								}
							],
							order: 1,
							type: "checkbox"
						}
					];

					return {
						category: null,
						createdDate: createdDate,
						deleted: deleted,
						id: id,
						isPublic: isPublic,
						lastModifiedDate: lastModifiedDate,
						name: title,
						owner: owner,
						ownerOrg: ownerOrg,
						targetId: targetId,
						targetType: targetType,
						rows: newRows,
						columns: newCols
					};
				}
			});

			// Delete old list query
			const deleteQuery = r
				.table("sys_list")
				.filter(function(list) {
					return list.hasFields("columns").not();
				})
				.delete();
            
			// Insert updated list query
			const insertQuery = r
				.table("sys_list")
				.insert(updatedRecs);

			// Run both queries
			const result = await r.expr([deleteQuery, insertQuery]).run();

			// If both queries passed correctly with no errors, we're good
			if (!result[0].errors && !result[1].errors) {
				console.log("All lists successfully updated to new data model with result:", result);
				return {"success": true};
			} else {
				console.log("There was a problem updating lists to new data model.");
				return {"success": false};
			}
		}

		// If there are no lists to update, we're done
		return {"success": true};
	}
	catch(err) {
		console.log("There was an error with list-app-setup script: ", err);
		return {"success": false, err};
	}
};