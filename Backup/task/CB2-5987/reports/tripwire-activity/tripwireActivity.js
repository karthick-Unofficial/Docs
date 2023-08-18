const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("tripwireActivity", "/reports/tripwire-activity/tripwire-activity.js");
const reportHelper = require("../report-helper");
const PAGE_SIZE = 50;

const connect = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		const { queryResult, scrollId, pages } = await queryElastic(
			report,
			client,
			ecosystem,
			appRequest,
			request,
			userId
		);
		const groups = await mapToRows(ecosystem, appRequest, queryResult, userId);

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

const queryElastic = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		// Three scenarios --
		// 1. We want the next page to a report we've already got
		if (request.scrollId) {
			const result = await client.scroll({
				scroll_id: request.scrollId,
				scroll: "5m"
			});
			return {
				queryResult: result.hits.hits.map((hit) => hit._source)
			};
		}

		// 2.  We want the generate an export of the entire report
		else if (!request.paginate) {
			return await generateFullReport(report, client, ecosystem, appRequest, request, userId);
		}

		// 3. We want to request a new report and get the first page and scroll_id back
		else {
			const { startDate, endDate, lines } = request.fields;
			const indexDates = reportHelper.getDateRange(startDate, endDate, "tripwire-activity-");
			const { entities } = request.fields;

			// Dates
			const formattedStart = new Date(startDate);
			const formattedEnd = new Date(endDate);

			if (formattedStart > new Date()) {
				const err = "Start date cannot exist in the future";
				throw err;
			}

			const userIntegrations = await ecosystem.getUserIntegrations(userId);

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
						...(await reportHelper.getZoneFilter(ecosystem, userId, lines))
					]
				}
			};

			const data = await client.search({
				index: indexDates,
				ignoreUnavailable: true,
				size: PAGE_SIZE,
				scroll: "10m",
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
			});

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

const mapToRows = async (ecosystem, appRequest, raw) => {
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
				property: "line",
				displayName: "Line",
				rows: slate[key].map((item) => {
					const entityProperties = entitiesById[item.entityId].entityData.properties;

					return {
						name: entityProperties.name,
						mmsid: entityProperties.mmsi || "",
						imo:
							!entityProperties.imo ||
							entityProperties.imo.toString().length === 0 ||
							entityProperties.imo === 0
								? "-"
								: entityProperties.imo,
						callsign: entityProperties.callsign || "",
						timestamp: item.timestamp || "",
						speed: item.speed || "",
						hdg: item.hdg || "",
						course: item.course || "",
						lat: item.geometry.coordinates[1] || "",
						lng: item.geometry.coordinates[0] || ""
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

const generateFullReport = async (report, client, ecosystem, appRequest, request, userId) => {
	const { startDate, endDate, lines } = request.fields;
	const indexDates = reportHelper.getDateRange(startDate, endDate, "tripwire-activity-");
	const { entities } = request.fields;

	const userIntegrations = await ecosystem.getUserIntegrations(userId);

	const formattedStart = new Date(startDate);
	const formattedEnd = new Date(endDate);

	const q = {
		bool: {
			must: {
				range: {
					"properties.published": {
						gte: formattedStart,
						lte: formattedEnd,
						relation: "within"
					}
				}
			},
			filter: [
				...(await reportHelper.getEntityFilter(ecosystem, entities, userId, userIntegrations)),
				...(await reportHelper.getZoneFilter(ecosystem, userId, lines))
			]
		}
	};

	const response = await client.search({
		index: indexDates,
		size: PAGE_SIZE,
		ignoreUnavailable: true,
		scroll: "5m",
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
	});

	const allItems = [];
	// push first batch
	let scrollId = response._scroll_id;
	response.hits.hits.forEach(function (hit) {
		allItems.push(hit._source);
	});

	while (response.hits.total.value > allItems.length) {
		const newData = await client.scroll({
			body: {
				scroll_id: scrollId,
				scroll: "5m"
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
