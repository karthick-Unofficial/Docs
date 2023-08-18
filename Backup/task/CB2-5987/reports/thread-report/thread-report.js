const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("thread-report", "/reports/thread-report/thread-report.js");
const axios = require("axios");

const connect = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		const result = await queryEcosystem(report, client, ecosystem, appRequest, request, userId);
		const data = await formatData(ecosystem, appRequest, result, userId);

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
		const eventId = request.fields.events[0].id;
		const user = await appRequest.request("ecosystem", "GET", `/users/${userId}/profile`);

		const identity = {
			userId: userId,
			orgId: user.user.orgId
		};
		const eventData = await appRequest.request(
			"ecosystem",
			"GET",
			`/events/${eventId}/associated/${eventId}`,
			{},
			null,
			identity
		);
		return {
			event: eventData.event,
			activities: eventData.activities,
			files: eventData.attachments,
			lists: eventData.lists,
			pinnedItems: eventData.pinnedItems
		};
	} catch (e) {
		logger.error("queryEcosystem", "Unexpected error.", {
			errMessage: e.message,
			errStack: e.stack
		});
		throw e;
	}
};

const formatData = async (ecosystem, appRequest, result, userId) => {
	let data = {};
	const reportTables = Object.keys(result);

	for (let i = 0; i < reportTables.length; i++) {
		if (result[reportTables[i]]) {
			switch (reportTables[i]) {
				case "event":
					data = {
						...data,
						...(await formatEvent(ecosystem, appRequest, userId, result[reportTables[i]]))
					};
					break;
				case "activities":
					data = {
						...data,
						...formatActivities(result[reportTables[i]])
					};
					break;
				case "files":
					data = {
						...data,
						...formatFiles(result[reportTables[i]])
					};
					break;
				case "cameras":
					data = {
						...data,
						...formatCameras(result[reportTables[i]])
					};
					break;
				case "alerts":
					data = {
						...data,
						...formatAlerts(result[reportTables[i]])
					};
					break;
				case "pinnedItems":
					data = {
						...data,
						...(await formatPinnedItems(appRequest, result[reportTables[i]]))
					};
					break;
				case "lists":
					data = {
						...data,
						...formatLists(result[reportTables[i]])
					};
					break;
				default:
					break;
			}
		}
	}
	return data;
};

const formatCameras = (cameras) => {
	return {};
};

const formatAlerts = (alerts) => {
	return {};
};

const formatPinnedItems = async (appRequest, items) => {
	for (let i = 0; i < items.length; i++) {
		if (items[i].entityData.properties.pinnedBy) {
			const owner = await appRequest.request(
				"ecosystem",
				"GET",
				`/users/${items[i].entityData.properties.pinnedBy}/profile`
			);
			items[i].entityData.properties.pinnedBy = `${owner.user.name}`;
		} else {
			items[i].entityData.properties.pinnedBy = "n/a";
		}
	}

	const formattedItems = items.map((item) => {
		return {
			item: item.entityData.properties.name,
			pinnedBy: item.entityData.properties.pinnedBy ? item.entityData.properties.pinnedBy : "n/a"
		};
	});

	return {
		pinnedItems: {
			type: "pinnedItems",
			value: {
				rows: formattedItems.length > 0 ? formattedItems : null
			}
		}
	};
};

const formatLists = (lists) => {
	const formattedLists = lists.map((list) => {
		const rows = list.rows;
		return {
			title: list.name,
			columns: list.columns,
			rows
		};
	});
	return {
		lists: {
			type: "list",
			value: formattedLists
		}
	};
};

const formatFiles = (files) => {
	const handles = files.map((file) => {
		return file.handle;
	});

	const rows = files.map((file) => {
		return {
			name: file.filename,
			type: file.mimeType.slice(file.mimeType.indexOf("/") + 1).toUpperCase()
		};
	});

	return {
		files: {
			type: "table",
			handles,
			value: {
				rows: rows.length > 0 ? rows : null
			}
		}
	};
};

const formatActivities = (activities) => {
	const sortedActivities = activities.sort((a, b) => {
		return new Date(a.published) - new Date(b.published);
	});
	const rows = sortedActivities.map((activity) => {
		return {
			desc: activity.object
				? activity.object.message
					? `"${activity.object.message}"`
					: activity.summary
				: activity.summary,
			time: activity.published,
			createdBy: activity.actor.name
		};
	});

	return {
		activities: {
			type: "table",
			value: {
				rows: rows.length > 0 ? rows : null
			}
		}
	};
};
const getPointsOfContact = async (ecosystem, appRequest, userId, pointsOfContact) => {
	const user = await appRequest.request("ecosystem", "GET", `/users/${userId}/profile`);
	const result = [];
	const identity = {
		userId: userId,
		orgId: user.user.orgId
	};
	const secureShareUsers = await appRequest.request(
		"integration-app",
		"GET",
		"/externalSystem/secure-share/lookup/users",
		{},
		null,
		identity
	);
	pointsOfContact.forEach((point) => {
		let found = false;
		const data = secureShareUsers.data;
		let i = 0;
		while (!found && i < data.length) {
			if (point == data[i].id) {
				found = true;
				result.push(data[i].name);
			}
			i++;
		}
		if (!found) {
			result.push("UserId = " + point);
		}
	});
	return result;
};
const formatEvent = async (ecosystem, appRequest, userId, event) => {
	const startDate = event.startDate;
	let notes = "";
	let pointsOfContact = "";
	const closeDate = event.endDate;
	const pointsOfContactIds =
		event.additionalProperties.points_of_contact && event.additionalProperties.points_of_contact.length > 0
			? event.additionalProperties.points_of_contact
			: null;
	const owner = await appRequest.request("ecosystem", "GET", `/users/${event.owner}/profile`);
	if (event.notes) {
		notes = await downloadNotes(event.notes, appRequest);
	}

	if (pointsOfContactIds && pointsOfContactIds.length > 0) {
		const arrayOfUsers = await getPointsOfContact(ecosystem, appRequest, userId, pointsOfContactIds);
		pointsOfContact = arrayOfUsers.join(", ");
	}

	return {
		startDate: {
			type: "field",
			value: startDate
		},
		startTime: {
			type: "field",
			value: event.startDate
		},
		closeDate: {
			type: "field",
			value: closeDate
		},
		closeTime: {
			type: "field",
			value: event.endDate
		},
		pointsOfContact: {
			type: "field",
			value: pointsOfContact
		},
		owner: {
			type: "field",
			value: `${owner.user.name}, ${owner.org.name}`
		},
		desc: {
			type: "long-field",
			value: event.desc
		},
		notes: {
			type: "long-field",
			value: notes ? notes : null
		}
	};
};

const downloadNotes = async (handle) => {
	return await axios
		.get(`http://app-gateway:8001/_downloadEventNotes?handle=${handle}`)
		.then(function (response) {
			if (response && response.data && response.data.html) {
				return response.data.html;
			} else {
				return false;
			}
		})
		.catch(function (e) {
			logger.error("downloadNotes", "Error downloading notes.", {
				errMessage: e.message,
				errStack: e.stack
			});
			return false;
		});
};

module.exports = connect;
