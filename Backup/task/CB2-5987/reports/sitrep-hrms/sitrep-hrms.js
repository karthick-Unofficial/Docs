const { Logger } = require("node-app-core/dist/logger");
const logger = new Logger("sitrep-hrms", "/reports/sitrep-hrms/sitrep-hrms.js");
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

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
		const user = await appRequest.request("ecosystem", "GET", `/users/${userId}/profile`);

		const identity = {
			userId: userId,
			orgId: user.user.orgId
		};

		let eventData;

		for (let i = 0; i < request.fields.events.length; i++) {
			const event = request.fields.events[i];
			const eventId = event.id;

			// Used for passing SITREP tests in the Testing App
			// Multi-event support may come later
			if (eventData) {
				const err = "Only one event may be used";
				throw err;
			}

			const individualEventData = await appRequest.request(
				"ecosystem",
				"GET",
				`/events/${eventId}/associated/${eventId}`,
				{},
				null,
				identity
			);

			// If user does not have access to the event, bail out
			if (hasOwn(individualEventData, "success") && !individualEventData.success) {
				const err = "Permission check failed";
				throw err;
			} else if (hasOwn(individualEventData, "event")) {
				eventData = individualEventData;
			}
		}

		return {
			event: eventData.event,
			activities: eventData.activities,
			files: eventData.attachments,
			lists: eventData.lists,
			pinnedItems: eventData.pinnedItems,
			cameras: eventData.cameras
		};
	} catch (e) {
		logger.error("queryEcosystem", "Unexpected error.", {
			errMessage: e.message,
			errStack: e.stack
		});
		throw e;
	}
};

const formatData = async (ecosystem, appRequest, result) => {
	let data = {};
	const reportTables = Object.keys(result);

	for (let i = 0; i < reportTables.length; i++) {
		if (result[reportTables[i]]) {
			switch (reportTables[i]) {
				case "event":
					data = {
						...data,
						...(await formatEvent(ecosystem, appRequest, result[reportTables[i]]))
					};
					break;
				case "activities":
					data = {
						...data,
						...formatActivities(result[reportTables[i]])
					};
					break;
				case "files":
					data = { ...data, ...formatFiles(result[reportTables[i]]) };
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
						...(await formatPinnedItems(ecosystem, appRequest, result[reportTables[i]]))
					};
					break;
				case "lists":
					data = { ...data, ...formatLists(result[reportTables[i]]) };
					break;
				default:
					break;
			}
		}
	}

	if (result.event && result.event.additionalProperties) {
		if (result.event.additionalProperties.resources && result.event.additionalProperties.resources.length > 0) {
			data = {
				...data,
				...formatResources(result.event.additionalProperties.resources)
			};
		}
		if (result.event.additionalProperties.equipments && result.event.additionalProperties.equipments.length > 0) {
			data = {
				...data,
				...formatEquipment(result.event.additionalProperties.equipments)
			};
		}
	}

	return data;
};

const formatResources = (resources) => {
	const rows = resources.map((resource) => {
		return {
			name: resource.Name,
			rank: resource.RankName,
			location: resource.LocationName,
			unit: resource.UnitName
		};
	});

	return {
		resources: {
			type: "table",
			value: {
				rows: rows.length > 0 ? rows : null
			}
		}
	};
};

const formatEquipment = (equipment) => {
	const rows = equipment.map((equip) => {
		return {
			name: equip.Name,
			category: equip.Category,
			unit: equip.UnitName
		};
	});

	return {
		equipment: {
			type: "table",
			value: {
				rows: rows.length > 0 ? rows : null
			}
		}
	};
};

const formatCameras = (cameras) => {
	const formattedCameras = cameras.map((camera) => {
		return {
			name: camera.entityData.properties.name
		};
	});
	return {
		cameras: {
			type: "cameras",
			value: {
				rows: formattedCameras.length > 0 ? formattedCameras : null
			}
		}
	};
};

const formatAlerts = (alerts) => {
	return {};
};

const formatPinnedItems = async (ecosystem, appRequest, items) => {
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
			item: item.entityData.properties.name || "",
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
		const rows = list.rows || [];
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

const formatEvent = async (ecosystem, appRequest, event) => {
	const startDate = event.startDate;
	const closeDate = event.endDate;
	const sharedWithOrgIds = event.sharedWith.length > 0 ? event.sharedWith : null;
	const owner = await appRequest.request("ecosystem", "GET", `/users/${event.owner}/profile`);
	let shares = "";
	let notes = "";
	if (event.notes) {
		notes = await downloadNotes(event.notes, appRequest);
	}
	if (sharedWithOrgIds) {
		for (let i = 0; i < sharedWithOrgIds.length; i++) {
			const orgInfo = await appRequest.request("ecosystem", "GET", `/organizations/${sharedWithOrgIds[i]}`);
			shares += shares.length === 0 ? orgInfo.name : ", " + orgInfo.name;
		}
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
		shares: {
			type: "field",
			value: shares.length > 0 ? shares : null
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

const downloadNotes = async (handle, appRequest) => {
	try {
		const notesFile = await appRequest.request("ecosystem", "GET", `/events/notes/${handle}`);
		return notesFile.html;
	} catch (e) {
		logger.error("connect", "Error downloading notes.", {
			errMessage: e.message,
			errStack: e.stack
		});
		return false;
	}
};

module.exports = connect;
