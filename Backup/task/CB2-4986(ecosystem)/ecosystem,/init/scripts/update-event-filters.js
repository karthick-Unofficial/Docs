const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;

module.exports.applyScript = async function () {
	const scriptName = "update-event-filter";

	try {
		// Custom code ---------------------------------------------------
		const eventFilters = await r.table("sys_userAppState")
			.filter(
				r.row("state").hasFields("eventFilters")	
			);

		const remove = [];

		eventFilters.forEach((filter, index) => {
			if (Array.isArray(filter.state.eventFilters)) {
				eventFilters[index].state = {
					...eventFilters[index].state,
					"eventFilters": {
						"status": [...filter.state.eventFilters],
						"subtype": [],
						"type": []
					}
				};
			} else {
				const keys = Object.keys(filter.state.eventFilters);
				keys.forEach(key => {
					if(!Array.isArray(filter.state.eventFilters[key])) {
						if (!filter.state.eventFilters["status"].includes(filter.state.eventFilters[key])) {
							filter.state.eventFilters["status"].push(filter.state.eventFilters[key]);
						}
						if (!remove.includes(`${key}`)) {
							remove.push(`${key}`);
						}
						delete filter.state.eventFilters[key];
					}
				});
			}
		});

		for (let i = 0; i < eventFilters.length; i++) {
			await r.table("sys_userAppState")
				.get(eventFilters[i].id)
				.replace(
					r.row.merge(
						doc => {
							return {
								"state": eventFilters[i].state
							};
						}
					).without({
						"state": {
							"eventFilters": remove
						}
					})
				);
		}
		console.log(`${scriptName} eventFilters update: `, eventFilters);
		// ---------------------------------------------------------------

		// Finished, return success: true
		return {
			"success": true
		};
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return {
			"success": false,
			err
		};
	}
};