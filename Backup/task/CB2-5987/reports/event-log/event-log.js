const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("sitrep", "/reports/event-log/event-log.js");

const connect = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		const result = await queryEcosystem(report, client, ecosystem, appRequest, request, userId);
		const data = await formatData(ecosystem, appRequest, result);

		return [
			{
				type: report.id,
				data: [data]
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

const queryEcosystem = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		// Fetch all events that are active at any point during request.fields.startDate to request.fields.endDate
		const identity = {
			userId: userId
		};

		const events = await appRequest.request(
			"ecosystem",
			"GET",
			`/events/eventLogData?startDate=${request.fields.startDate}&endDate=${request.fields.endDate}`,
			{},
			null,
			identity
		);

		return events;
	} catch (e) {
		logger.error("queryEcosystem", "Unexpected error.", {
			errMessage: e.message,
			errStack: e.stack
		});
		throw e;
	}
};

const formatData = async (ecosystem, appRequest, result) => {
	return {
		events: {
			value: {
				rows: result
					.sort((a, b) => {
						return new Date(a.startDate) > new Date(b.startDate) ? 1 : -1;
					})
					.map((event) => {
						return {
							name: event.name,
							desc: event.desc,
							startDateTime: event.startDate,
							endDateTime: event.endDate,
							templateName: event.templateName,
							owner: event.ownerName,
							status: event.isActive ? "Active" : "Closed",
							checklistProgress: getChecklistProgress(event.lists)
						};
					})
			}
		}
	};
};

const getChecklistProgress = (lists) => {
	let totalItems = 0;
	let completedItems = 0;

	lists.forEach((list) => {
		const firstColumn = list.columns.sort((col) => col.order)[0];

		if (firstColumn.type === "checkbox") {
			totalItems += list.rows.length;
			completedItems += list.rows.filter((row) => {
				return row.data && row.data[firstColumn.id] === true;
			}).length;
		}
	});

	return totalItems > 0 ? `${Math.round((completedItems / totalItems) * 100)}%` : "N/A";
};

module.exports = connect;
