const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("zoneActivity", "/reports/zone-activity/zoneActivity.js");
const reportHelper = require("../report-helper");
const PAGE_SIZE = 50;

const connect = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		const userIntegrations = await ecosystem.getUserIntegrations(userId);
		const { queryResult, scrollId, pages } = await queryElastic(
			report,
			client,
			ecosystem,
			appRequest,
			request,
			userId,
			userIntegrations
		);
		const groups = await mapToRows(queryResult, userIntegrations);

		return scrollId
			? [
					{
						type: report.id,
						scrollId,
						pages,
						groups
					}
			  ]
			: [
					{
						type: report.id,
						groups
					}
			  ];
	} catch (e) {
		logger.error("connect", "Unexpected error.", {
			errMessage: e.message,
			errStack: e.stack
		});
		throw e;
	}
};

const queryElastic = async (report, client, ecosystem, appRequest, request, userId, userIntegrations) => {
	try {
		// Three scenarios --
		// 1. We want the next page to a report we've already got
		if (request.scrollId) {
			const result = await client.scroll({
				body: {
					scroll_id: request.scrollId,
					scroll: "5m"
				}
			});
			return {
				queryResult: result.hits.hits.map((hit) => hit._source)
			};
		}

		// 2.  We want the generate an export of the entire report
		else if (!request.paginate) {
			return await generateFullReport(report, client, ecosystem, appRequest, request, userId, userIntegrations);
		}

		// 3. We want to request a new report and get the first page and scroll_id back
		else {
			const q = await getQuery(ecosystem, appRequest, userId, request, report, "10m", userIntegrations);

			const data = await client.search(q);

			const scrollId = data._scroll_id;
			const hits = data.hits.hits.map((hit) => hit._source);
			return {
				scrollId,
				pages: Math.ceil(data.hits.total.value / PAGE_SIZE),
				queryResult: hits
			};
		}
	} catch (e) {
		logger.error("queryElastic", "Unexpected error.", {
			errMessage: e.message,
			errStack: e.stack
		});
		throw e;
	}
};

const getQuery = async (ecosystem, appRequest, userId, request, report, scroll, userIntegrations) => {
	const { startDate, endDate, zones, entities } = request.fields;
	const indexDates = reportHelper.getDateRange(startDate, endDate, "zone-activity-");

	// Dates
	const formattedStart = new Date(startDate);
	const formattedEnd = new Date(endDate);

	if (formattedStart > new Date()) {
		const err = "Start date cannot exist in the future";
		throw err;
	} else if (formattedStart > formattedEnd) {
		const err = "Start date cannot be after end date";
		throw err;
	}

	const q = {
		bool: {
			must: {
				range: {
					"properties.published": {
						gte: formattedStart,
						lte: formattedEnd
					}
				}
			},
			filter: [
				...(await reportHelper.getEntityFilter(ecosystem, entities, userId, userIntegrations)),
				...(await reportHelper.getZoneFilter(ecosystem, userId, zones))
			]
		}
	};

	return {
		index: indexDates,
		ignoreUnavailable: true,
		size: PAGE_SIZE,
		scroll: scroll,
		body: {
			sort: [
				{
					"collectedItem.shapeName": {
						order: "asc",
						unmapped_type: "keyword"
					}
				},
				{ "collectedItem.timestamp": { order: "asc" } }
			],
			query: q
		}
	};
};

const mapToRows = async (raw) => {
	try {
		const interim = raw.map((item) => {
			return item.collectedEntities;
		});
		const merged = [].concat.apply([], interim);
		const entitiesById = merged.reduce((a, b) => {
			return { ...a, [b.id]: b };
		}, {});

		const items = raw.map((item) => item.collectedItem);

		// Sort into separate arrays by shape for grouping
		const slate = {};
		items.forEach((item) => {
			if (slate[item.targetId]) {
				slate[item.targetId].push(item);
			} else {
				slate[item.targetId] = [item];
			}
		});

		const groupKeys = Object.keys(slate);

		const groups = groupKeys.map((key) => {
			return {
				name: slate[key][0].shapeName,
				id: key,
				property: "zone",
				displayName: "Zone",
				rows: slate[key].map((item) => {
					const entityProperties = entitiesById[item.entityId].entityData.properties;

					return {
						name: entityProperties.name,
						mmsid: entityProperties.mmsi || "",
						imo: entityProperties.imo || "",
						callsign: entityProperties.callsign || "",
						timestamp: item.timestamp || "",
						speed: "speed" in item ? item.speed : "",
						hdg: "hdg" in item ? item.hdg : "",
						course: "course" in item ? item.course : "",
						lat: item.geometry.coordinates[1] || "",
						lng: item.geometry.coordinates[0] || "",
						event: item.event || ""
					};
				})
			};
		});

		return groups;
	} catch (e) {
		logger.error("mapToRows", "Unexpected error.", {
			errMessage: e.message,
			errStack: e.stack
		});
		throw e;
	}
};

const generateFullReport = async (report, client, ecosystem, appRequest, request, userId, userIntegrations) => {
	const q = await getQuery(ecosystem, appRequest, userId, request, report, "5m", userIntegrations);

	const allItems = [];

	const response = await client.search(q);

	// push first batch
	let scrollId = response._scroll_id;
	response.hits.hits.forEach(function (hit) {
		allItems.push(hit._source);
	});

	while (response.hits.total.value > allItems.length) {
		const newData = await client.scroll({
			body: {
				scroll_id: scrollId,
				scroll: "5ms"
			}
		});
		scrollId = newData._scroll_id;
		newData.hits.hits.forEach(function (hit) {
			allItems.push(hit._source);
		});
	}

	return {
		queryResult: allItems
	};
};

module.exports = connect;
