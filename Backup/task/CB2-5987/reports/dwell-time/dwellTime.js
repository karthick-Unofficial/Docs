const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("dwellTime", "/reports/dwell-time/dwellTime.js");
const PAGE_SIZE = 50;
const reportHelper = require("../report-helper");

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
			return await generateFullReport(report, client, ecosystem, appRequest, request, userId);
		}

		// 3. We want to request a new report and get the first page and scroll_id back
		else {
			const { startDate, endDate, zones } = request.fields;
			const indexDates = reportHelper.getDateRange(startDate, endDate, "dwell-time-");
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
								lte: formattedEnd,
								relation: "within"
							}
						}
					},
					filter: [
						...(await reportHelper.getEntityFilter(ecosystem, entities, userId, userIntegrations)),
						...(await reportHelper.getZoneFilter(ecosystem, userId, zones))
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
				property: "zone",
				displayName: "Zone",
				rows: slate[key].map((item) => {
					// Format our duration
					const formattedDuration = formatDuration(item.duration);
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
						entered: item.enterTime || "",
						...(entityProperties.tonnage && {
							tonnage: entityProperties.tonnage
						}),
						duration: formattedDuration || ""
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

const formatDuration = (ms) => {
	// 620001
	const milliseconds = ms % 1000; // 1
	const interS = (ms - milliseconds) / 1000; // 62

	const sec = interS % 60; // 2
	const interMin = (interS - sec) / 60; // 6

	const min = interMin % 60;

	const hour = (interMin - min) / 60;

	const units = [hour, min, sec, milliseconds];

	const stringed = units.map((unit) => {
		if (unit < 10) {
			return "0" + unit;
		} else {
			return unit.toString();
		}
	});

	return `${stringed[0]}:${stringed[1]}:${stringed[2]}`;
};

const generateFullReport = async (report, client, ecosystem, appRequest, request, userId) => {
	const { startDate, endDate, zones } = request.fields;
	const indexDates = reportHelper.getDateRange(startDate, endDate, "dwell-time-");

	const { entities } = request.fields;
	const formattedStart = new Date(startDate);
	const formattedEnd = new Date(endDate);

	const userIntegrations = await ecosystem.getUserIntegrations(userId);

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
				...(await reportHelper.getZoneFilter(ecosystem, userId, zones))
			]
		}
	};

	const response = await client.search({
		index: indexDates,
		ignoreUnavailable: true,
		size: PAGE_SIZE,
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

	// push first batch
	let scrollId = response._scroll_id;
	const allItems = [];
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
