const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("vesselPosition", "/reports/vessel-position/vesselPosition.js");
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
			const { startDate, endDate } = request.fields;
			const indexDates = reportHelper.getDateRange(startDate, endDate, "feed-history-");
			const { entities } = request.fields;

			// Dates
			const formattedStart = new Date(startDate);
			const formattedEnd = new Date(endDate);

			if (formattedStart > new Date()) {
				const err = "Start date cannot exist in the future";
				throw err;
			}

			const userIntegrations = await ecosystem.getUserIntegrations(userId);

			const result = await client.search({
				index: indexDates,
				ignoreUnavailable: true,
				size: PAGE_SIZE,
				scroll: "10m",
				body: {
					sort: [
						{
							"collectedItem.entityData.properties.name": {
								order: "asc",
								unmapped_type: "keyword"
							}
						},
						{ "collectedItem.acquisitionTime": { order: "asc" } }
					],
					query: {
						bool: {
							must: {
								range: {
									"collectedItem.acquisitionTime": {
										gte: formattedStart,
										lte: formattedEnd
									}
								}
							},
							filter: [
								...(await reportHelper.getEntityFilter(ecosystem, entities, userId, userIntegrations))
							]
						}
					}
				}
			});

			const scrollId = result._scroll_id;
			const hits = result.hits.hits.map((hit) => hit._source);
			return {
				scrollId,
				pages: Math.ceil(result.hits.total.value / PAGE_SIZE),
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
		// Sort into separate arrays by shape for grouping
		const slate = {};
		raw.forEach((item) => {
			if (slate[item.collectedItem.id]) {
				slate[item.collectedItem.id].push(item);
			} else {
				slate[item.collectedItem.id] = [item];
			}
		});

		const groupKeys = Object.keys(slate);

		const groups = groupKeys.map((key) => {
			return {
				name: slate[key][0].collectedItem.entityData.properties.name,
				id: key,
				property: "zone",
				displayName: "Zone",
				rows: slate[key].map((item) => {
					const entity = item.collectedItem;
					const properties = entity.entityData.properties;
					return {
						name: properties.name,
						mmsid: properties.mmsi || "",
						imo:
							!properties.imo || properties.imo.toString().length === 0 || properties.imo === 0
								? "-"
								: properties.imo,
						callsign: properties.callsign || "",
						acquisitionTime: entity.acquisitionTime || "",
						speed: properties.speed || "",
						hdg: properties.hdg || "",
						course: properties.course || "",
						lat: entity.entityData.geometry ? entity.entityData.geometry.coordinates[1] : "",
						lng: entity.entityData.geometry ? entity.entityData.geometry.coordinates[0] : ""
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
	const { startDate, endDate, duration } = request.fields;
	const indexDates = reportHelper.getDateRange(startDate, endDate, "feed-history-");
	const { entities } = request.fields;

	let formattedStart = new Date(startDate);
	let formattedEnd = new Date(endDate);

	if (duration) {
		formattedEnd = new Date();
		formattedStart = new Date();
		formattedStart.setMinutes(formattedEnd.getMinutes() - duration);
	}

	const userIntegrations = await ecosystem.getUserIntegrations(userId);

	const allItems = [];

	const response = await client.search({
		index: indexDates,
		ignoreUnavailable: true,
		size: PAGE_SIZE,
		scroll: duration ? "5s" : "5m",
		body: {
			sort: [
				{
					"collectedItem.entityData.properties.name": {
						order: "asc",
						unmapped_type: "keyword"
					}
				},
				{
					"collectedItem.acquisitionTime": {
						order: "asc"
					}
				}
			],
			query: {
				bool: {
					must: {
						range: {
							"collectedItem.acquisitionTime": {
								gte: formattedStart,
								lte: formattedEnd
							}
						}
					},
					filter: [...(await reportHelper.getEntityFilter(ecosystem, entities, userId, userIntegrations))]
				}
			}
		}
	});

	// push first batch
	let scrollId = response._scroll_id;
	response.hits.hits.forEach(function (hit) {
		allItems.push(hit._source);
	});

	while (response.hits.total.value > allItems.length) {
		const newData = await client.scroll({
			body: {
				scroll_id: scrollId,
				scroll: duration ? "5s" : "5m"
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
