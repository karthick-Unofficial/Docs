import { restClient } from "client-app-core";

const upsertAgent = async (agent) => {
	return new Promise((resolve, reject) => {
		const url = "/berth-request-app/api/create/agent";
		const body = JSON.stringify(agent);
		restClient.exec_put(url, body, (err, res) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(res.id);
			}
		});
	});
};

const upsertVessel = async (vessel) => {
	return new Promise((resolve, reject) => {
		const url = "/berth-request-app/api/create/vessels";
		const body = JSON.stringify(vessel);
		restClient.exec_put(url, body, (err, res) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(res.id);
			}
		});
	});
};

const upsertBarge = async (barge) => {
	return new Promise((resolve, reject) => {
		const url = "/berth-request-app/api/create/barges";
		const body = JSON.stringify(barge);
		restClient.exec_put(url, body, (err, res) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(res.id);
			}
		});
	});
};

const upsertRequestedBy = async (requestedBy) => {
	return new Promise((resolve, reject) => {
		const url = "/berth-request-app/api/create/requestedBys";
		const body = JSON.stringify(requestedBy);
		restClient.exec_put(url, body, (err, res) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(res.id);
			}
		});
	});
};

const upsertShipperReceiver = async (shipperReceiver) => {
	return new Promise((resolve, reject) => {
		const url = "/berth-request-app/api/create/shipperReceivers";
		const body = JSON.stringify(shipperReceiver);
		restClient.exec_put(url, body, (err, res) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(res.id);
			}
		});
	});
};

export const queryAssignment = async (assignmentId) => {
	return new Promise((resolve, reject) => {
		const url = `/berth-request-app/api/request/assignment/${assignmentId}`;
		restClient.exec_get(url, (err, res) => {
			if (err) {
				reject(err);
			}
			else {
				const assignment = res[0] ? res[0] : {};

				// Format name
				if (assignment.agent && assignment.agent.name && assignment.agent.name.firstName) {
					assignment.agent.name = `${assignment.agent.name.firstName} ${assignment.agent.name.lastName}`;
				}

				if (assignment.vessel) {
					assignment.vessel.imo = assignment.vessel.imo.toString();
				}

				const data = {
					agent: assignment.agent,
					vessel: assignment.vessel,
					berth: assignment.berth,
					addedCargo: assignment.cargo,
					...(assignment.schedule.ata && { ata: assignment.schedule.ata }),
					...(assignment.schedule.atd && { atd: assignment.schedule.atd }),
					cargoDirection: assignment.cargoDirection
				};

				resolve(data);
			}
		});
	});
};

export const handleUpdateLookupsAndSubmit = async (
	agentId,
	agent,
	vesselId,
	vessel,
	cargoDirection,
	requestedId,
	requested,
	berthId,
	barges,
	cargo,
	eta,
	etd,
	services,
	notes,
	primaryActivityId,
	organizationId,
	callback
) => {
	let finalAgentId = agentId;
	let finalVesselId = vesselId;
	let finalRequestedById = requestedId;
	// If agent doesn't exit, it needs to be created so we have an ID for our assignment
	if (!finalAgentId) {
		const nameWords = agent.name.includes(" ") ? agent.name.split(" ") : [agent.name];
		const agentIdResult = await upsertAgent({
			name: {
				firstName: nameWords[0],
				lastName: nameWords[1] || ""
			},
			company: agent.company,
			email: agent.email,
			phone: agent.phone
		});
		finalAgentId = agentIdResult;
	}
	// Otherwise, if it needs to be updated, update it
	else if (finalAgentId && agent.isDirty) {
		const nameWords = agent.name.includes(" ") ? agent.name.split(" ") : [agent.name];
		await upsertAgent({
			name: {
				firstName: nameWords[0],
				lastName: nameWords[1] || ""
			},
			company: agent.company,
			email: agent.email,
			phone: agent.phone,
			id: agentId
		});
	}

	// If vessel doesn't exit, it needs to be created so we have an ID for our assignment
	if (!finalVesselId) {
		const vesselIdResult = await upsertVessel({
			name: vessel.name,
			mmsid: vessel.mmsid,
			imo: vessel.imo,
			type: vessel.type,
			loa: vessel.loa ? vessel.loa : 0,
			grt: vessel.grt ? vessel.grt : 0,
			draft: vessel.draft ? vessel.draft : 0,
			voyageNumber: vessel.voyageNumber
		});
		finalVesselId = vesselIdResult;
	}
	// Otherwise, if it needs to be updated, update it
	else if (finalVesselId && vessel.isDirty) {
		await upsertVessel({
			name: vessel.name,
			mmsid: vessel.mmsid,
			imo: vessel.imo,
			type: vessel.type,
			loa: vessel.loa ? vessel.loa : 0,
			grt: vessel.grt ? vessel.grt : 0,
			draft: vessel.draft ? vessel.draft : 0,
			voyageNumber: vessel.voyageNumber,
			id: vesselId
		});
	}

	// If requestedBy doesn't exist, it needs to be created so we have an ID for our assignment
	if (!finalRequestedById && requested) {
		const nameWords = requested.name.includes(" ") ? requested.name.split(" ") : [requested.name];
		const requestedByIdResult = await upsertRequestedBy({
			name: {
				firstName: nameWords[0],
				lastName: nameWords[1] || ""
			},
			company: requested.company,
			email: requested.email,
			phone: requested.phone
		});
		finalRequestedById = requestedByIdResult;
	}
	// Otherwise, if it needs to be updated, update it
	else if (finalRequestedById && requested.isDirty) {
		const nameWords = requested.name.includes(" ") ? requested.name.split(" ") : [requested.name];
		await upsertRequestedBy({
			name: {
				firstName: nameWords[0],
				lastName: nameWords[1] || ""
			},
			company: requested.company,
			email: requested.email,
			phone: requested.phone,
			id: requestedId
		});
	}

	const bargeData = [];
	if (barges.length) {
		for (let i = 0; i < barges.length; i++) {
			const barge = barges[i];

			if (!barge.id) {
				const now = new Date();
				const bargeId = await upsertBarge({
					name: barge.name,
					registry: barge.registry,
					type: barge.type,
					loa: barge.loa ? barge.loa : 0,
					grt: barge.grt ? barge.grt : 0,
					createdDate: now,
					isDeleted: false
				});

				bargeData.push({
					id: bargeId,
					name: barge.name,
					registry: barge.registry,
					type: barge.type,
					loa: barge.loa ? barge.loa : 0,
					grt: barge.grt ? barge.grt : 0,
					createdDate: now,
					isDeleted: false
				});
			}
			else if (barge.id) {
				if (barge.isDirty) {
					await upsertBarge({
						name: barge.name,
						registry: barge.registry,
						type: barge.type,
						loa: barge.loa ? barge.loa : 0,
						grt: barge.grt ? barge.grt : 0
					});
				}
				bargeData.push({
					id: barge.id,
					name: barge.name,
					registry: barge.registry,
					type: barge.type,
					loa: barge.loa ? barge.loa : 0,
					grt: barge.grt ? barge.grt : 0
				});
			}
		}
	}

	const cargoData = [];
	if (cargo.length) {
		for (let i = 0; i < cargo.length; i++) {
			const cargoEntry = cargo[i];

			if (!cargoEntry.shipperReceiver.id && cargoEntry.shipperReceiver.company.length) {
				const now = new Date();
				const shipperReceiverId = await upsertShipperReceiver({
					company: cargoEntry.shipperReceiver.company,
					createdDate: now,
					isDeleted: false
				});

				cargoData.push({
					...cargoEntry,
					shipperReceiver: {
						id: shipperReceiverId,
						company: cargoEntry.shipperReceiver.company,
						createdDate: now,
						isDeleted: false
					}
				});
			}
			else {
				cargoData.push(cargoEntry);
			}
		}
	}

	const url = "/berth-request-app/api/request/submit";

	// Create body based on result of lookups
	const jsonBody = {
		agentId: finalAgentId,
		vesselId: finalVesselId,
		cargoDirection: cargoDirection,
		schedule: {
			eta: eta,
			etd: etd
		},
		berthId: berthId,
		cargo: cargoData,
		barges: bargeData,
		orgId: organizationId,
		services,
		notes,
		primaryActivityId
	};

	if (finalRequestedById) { jsonBody.requestedById = finalRequestedById; }

	const body = JSON.stringify(jsonBody);

	await restClient.exec_post(url, body, (err, res) => {
		if (err) {
			callback(err, null);
		}
		else {
			if (res.id) {
				callback(null, res.id);
			}
		}
	});
};

export const checkVesselReport = async (assignmentId, callback) => {
	const url = `/berth-request-app/api/request/checkVesselReport/${assignmentId}`;
	restClient.exec_get(url, (err, res) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, res);
		}
	});
};

export const submitVesselReport = async (vesselReport, callback) => {

	const url = "/berth-request-app/api/create/vesselReport";
	const body = JSON.stringify(vesselReport);

	await restClient.exec_post(url, body, (err, res) => {
		if (err) {
			callback(err, null);
		}
		else {
			callback(null, res);
		}
	});
};