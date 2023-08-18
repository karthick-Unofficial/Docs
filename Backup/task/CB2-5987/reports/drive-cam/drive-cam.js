const axios = require("axios");
const { Logger, SYSTEM_CODES } = require("node-app-core/dist/logger");
const logger = new Logger("reports", "/reports/drive-cam/drive-cam.js");

const connect = async (report, client, ecosystem, appRequest, request, userId) => {
	try {
		const user = await appRequest.request("ecosystem", "GET", `/users/${userId}/profile`);
		const identity = {
			userId: userId,
			orgId: user.user.orgId
		};
		const externalSystem = await appRequest.request(
			"ecosystem",
			"GET",
			"/externalSystem/drive-cam",
			{},
			null,
			identity
		);
		if (externalSystem.config) {
			const result = await queryDriveCam(externalSystem.config.driveCamURL, request);
			logger.info({
				app: "reports-app",
				method: "drive-cam-connect",
				user: "system",
				queryResult: result
			});
			const data = await formatData(externalSystem.config.driveCamVidURL, result);
			logger.info({
				app: "reports-app",
				method: "drive-cam-connect",
				user: "system",
				formattedData: data
			});
			return [
				{
					type: report.id,
					data: data
				}
			];
		} else {
			throw new Error(
				"User does not have access to drive-cam/orbcad external system or the the system is not properly configured"
			);
		}
	} catch (e) {
		logger.error(
			"Failed to query and formate drive-cam data",
			{
				err: e
			},
			SYSTEM_CODES.UNSPECIFIED
		);
		throw e;
	}
};

const queryDriveCam = async (driveCamDataURL, request) => {
	try {
		const { entities, startDate, endDate } = request.fields;
		const eventTypes = request.fields["event type"];

		const drivecamRequest = {
			startDate: new Date(startDate),
			endDate: new Date(endDate)
		};

		if (entities !== "SELECT_ALL" && entities.length > 0) {
			const parsedEntity = entities[0].id.split(".");
			const id = parsedEntity[parsedEntity.length - 1];
			drivecamRequest.vehicleID = id;
		}

		if (eventTypes !== "SELECT_ALL") {
			drivecamRequest.eventTypeId = eventTypes.map((type) => {
				return type.id;
			});
		}

		logger.info({
			app: "reports-app",
			method: "queryDriveCam",
			user: "system",
			url: driveCamDataURL,
			body: drivecamRequest
		});
		const response = await axios.post(driveCamDataURL, drivecamRequest);

		// cSpell:disable
		// const response = {
		// 	status: 200,
		// 	data: [{
		// 		CustomerEventIdString: "ETTB98658",
		// 		RecordDate: new Date("2019-01-28 21:07:16.000"),
		// 		DriverName: "Michael Jackson (4322)",
		// 		VehicleId: 8662,
		// 		Group: "Woods",
		// 		EventType: "Erratic",
		// 		EventTypeId: 2,
		// 		Behaviors: ["Cornering", "Other Concern"],
		// 		Latitude: 37.768777,
		// 		Longitude: -122.468117,
		// 		RiskScore: 3,
		// 		Notes: "DriveCam Oct 30, 2018 2:41 AM Shikhare, Ashwini CR:| The event was triggered due to the vehicle cornering.| JE:| An action occurred in this event that may be of concern.| The driver only had one hand on the wheel while turning."
		// 	},
		// 	{
		// 		CustomerEventIdString: "ETTB98658",
		// 		RecordDate: new Date("2019-01-28 21:07:16.000"),
		// 		DriverName: "Michael Jackson (4322)",
		// 		VehicleId: 8662,
		// 		Group: "Woods",
		// 		EventType: "Erratic",
		// 		EventTypeId: 2,
		// 		Behaviors: ["Cornering", "Other Concern"],
		// 		Latitude: 37.768777,
		// 		Longitude: -122.468117,
		// 		RiskScore: 3,
		// 		Notes: "DriveCam Oct 30, 2018 2:41 AM Shikhare, Ashwini CR:| The event was triggered due to the vehicle cornering.| JE:| An action occurred in this event that may be of concern.| The driver only had one hand on the wheel while turning."
		// 	}]
		// };
		// cSpell:enable

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error(`Response from ${driveCamDataURL} returned with an error. Response: ${response}`);
		}
	} catch (e) {
		logger.error(
			"Failed on drive-cam data query",
			{
				err: e
			},
			SYSTEM_CODES.UNSPECIFIED
		);
		throw e;
	}
};

const formatNotes = (string) => {
	const colonSplit = string.split(/[a-zA-Z]{2}:/g);
	const sliceStrings = colonSplit.map((str, index) => {
		if (index < colonSplit.length - 1) {
			return str.slice(0, -2);
		}
		return str;
	});
	const specialSplit = sliceStrings.join("").split("|");
	const specialTrim = [];
	specialSplit.forEach((str) => {
		const newStr = str.trim();
		if (newStr) {
			specialTrim.push(newStr);
		}
	});
	return specialTrim.join("\n");
};

const formatData = async (videoURL, result) => {
	const formattedData = result.map((entity) => {
		const notes = entity.Notes ? formatNotes(entity.Notes) : "";
		return {
			event: {
				type: "section",
				value: {
					id: `Entity ${entity.CustomerEventIdString}, Risk: ${entity.RiskScore}`,
					time: entity.RecordDate,
					driver: entity.DriverName,
					vehicle: entity.VehicleId,
					group: entity.Group
				}
			},
			analysis: {
				type: "section",
				value: {
					behaviors: entity.Behaviors
				}
			},
			driveCamVid: {
				type: "long-field",
				value: videoURL + entity.CustomerEventIdString
			},
			notes: {
				type: "section",
				value: {
					formattedNotes: notes
				}
			}
		};
	});

	return formattedData;
};

module.exports = connect;
