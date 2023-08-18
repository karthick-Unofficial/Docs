const moment = require("moment-timezone");

/**
 * Returns true if the first array contains all items in the second array
 * @param {array} superset -- Superset array, contains value to check against
 * @param {array} subset -- Subset array, values to check if they exist within superset
 */
function arrayContains(superset, subset) {
	if (subset.length === 0) {
		return false;
	}

	return subset.every(function (val) {
		return superset.indexOf(val) >= 0;
	});
}

const getDateRange = (startDate, endDate, prefix) => {
	let dates = [];
	const days = [];
	const months = [];
	const years = [];
	const currentDayIndex = moment(startDate).startOf("day");
	const lastDayIndex = moment(endDate).startOf("day");
	// eliminate situation where user selects beginning of year
	if (currentDayIndex.format("MM.DD") === "01.01") {
		// go ahead and add years in between beginning year and ending year
		while (currentDayIndex.format("YYYY") !== lastDayIndex.format("YYYY")) {
			years.push(prefix + currentDayIndex.clone().format("YYYY") + ".*");
			currentDayIndex.add(1, "year");
		}
		//eliminate situation where user selects the beginning of a year and end of a year
		if (lastDayIndex.format("MM.DD") === "12.31") {
			years.push(prefix + currentDayIndex.clone().format("YYYY") + ".*");
			return years;
		}
	}

	const currentMonthIndex = currentDayIndex.clone().startOf("month");
	const currentYearIndex = currentDayIndex.clone().startOf("year");
	const lastMonthIndex = lastDayIndex.clone().startOf("month");
	const lastYearIndex = lastDayIndex.clone().startOf("year");
	while (currentYearIndex.add(1, "year").diff(lastYearIndex) < 0) {
		years.push(prefix + currentYearIndex.clone().format("YYYY") + ".*");
	}
	while (currentMonthIndex.add(1, "month").diff(lastMonthIndex) < 0) {
		if (years.includes(prefix + currentMonthIndex.format("YYYY") + ".*")) {
			currentMonthIndex.add(1, "year");
			currentMonthIndex.startOf("year");
		} else {
			months.push(prefix + currentMonthIndex.clone().format("YYYY.MM") + ".*");
		}
	}
	while (currentDayIndex.diff(lastDayIndex) < 0) {
		if (years.includes(prefix + currentDayIndex.format("YYYY") + ".*")) {
			currentDayIndex.add(1, "year");
			currentDayIndex.startOf("year");
		} else if (months.includes(prefix + currentDayIndex.format("YYYY.MM") + ".*")) {
			currentDayIndex.add(1, "month");
			currentDayIndex.startOf("month");
		} else {
			if (currentDayIndex.format("DD") === "01") {
				// add final month wild card instead of every day for the final month
				if (
					lastDayIndex.format("DD") >= "28" &&
					currentDayIndex.format("YYYY.MM") === lastDayIndex.format("YYYY.MM")
				) {
					months.push(prefix + currentDayIndex.clone().format("YYYY.MM") + ".*");
					return [...years, ...months, ...days];
				} else if (currentDayIndex.format("YYYY.MM") !== lastDayIndex.format("YYYY.MM")) {
					months.push(prefix + currentDayIndex.clone().format("YYYY.MM") + ".*");
					currentDayIndex.add(1, "month");
				} else {
					days.push(prefix + currentDayIndex.clone().format("YYYY.MM.DD"));
					currentDayIndex.add(1, "days");
				}
			} else {
				days.push(prefix + currentDayIndex.clone().format("YYYY.MM.DD"));
				currentDayIndex.add(1, "days");
			}
		}
	}
	days.push(prefix + lastDayIndex.clone().format("YYYY.MM.DD"));
	dates = [...years, ...months, ...days];
	if (dates.length > 150) {
		return prefix + "*";
	}
	return dates;
};

// entityFilterProp: entity or target
const getEntityFilter = async (ecosystem, entities, userId, userIntegrations) => {
	const unauthorizedError = { message: "Unauthorized", code: 401 };
	if (entities === "SELECT_ALL") {
		// include entities from all user feeds, for event policy need to get entities and filter separately because event policy does not include all
		const userEventPolicyFeedIds = userIntegrations
			.filter((feed) => feed.config.canView && feed.policy.type === "event" && feed.entityType !== "shapes")
			.map((feed) => feed.intId);

		let eventPolicyEntIds = [];
		for (const feedId of userEventPolicyFeedIds) {
			const feedEntityIds = await ecosystem.getFeedEntitiesByFeedId(userId, feedId);
			if (Array.isArray(feedEntityIds)) {
				eventPolicyEntIds = [...eventPolicyEntIds, ...feedEntityIds];
			}
		}

		const userAllPolicyFeedIds = userIntegrations
			.filter((feed) => feed.config.canView && feed.policy.type !== "event" && feed.entityType !== "shapes")
			.map((feed) => feed.intId);

		const result = [];
		if (userAllPolicyFeedIds.length) result.push({ terms: { feedIds: userAllPolicyFeedIds } });
		if (eventPolicyEntIds.length)
			result.push({
				terms: { "properties.entityId": eventPolicyEntIds }
			});

		return result;
	} else {
		// first ensure user has access to all distinct feeds of requested entities
		const userFeedIds = userIntegrations.map((feed) => feed.intId);
		const entityFeedIds = entities.map((item) => item.feedId);
		const distinctFeedIds = [...new Set(entityFeedIds)];
		if (!arrayContains(userFeedIds, distinctFeedIds)) {
			throw unauthorizedError;
		}

		// now ensure access to entities for event policy feeds
		const result = await ecosystem.authorizeBulkEntities(userId, entities);
		if (!result.authorized) {
			throw unauthorizedError;
		}

		return [
			{
				terms: {
					"properties.entityId": entities.map((ent) => ent.id)
				}
			}
		];
	}
};

const getZoneFilter = async (ecosystem, userId, zones) => {
	// Get shapes user has access to
	const authorizedZoneIds = await ecosystem.getUserShapes(userId);

	// Shapes to use in report
	let zoneIds;

	// If "select all" is selected user all zones user has access to
	if (zones === "SELECT_ALL") {
		zoneIds = authorizedZoneIds;
	}
	// Otherwise, ensure user has access to all zones they are trying to generate a report with
	else {
		const inputZoneIds = zones.map((item) => item.id);

		// Check use has access to all shapes (zones) they are attempting to generate with
		const userHasAccessToAllZones = arrayContains(authorizedZoneIds, inputZoneIds);

		// If not, throw error and bail
		if (!userHasAccessToAllZones) {
			const err = "Permission check failed";
			throw err;
		}

		zoneIds = inputZoneIds;
	}

	return [
		{
			terms: {
				"properties.targetId": zoneIds
			}
		}
	];
};

module.exports = {
	getEntityFilter: getEntityFilter,
	getZoneFilter: getZoneFilter,
	getDateRange: getDateRange
};
