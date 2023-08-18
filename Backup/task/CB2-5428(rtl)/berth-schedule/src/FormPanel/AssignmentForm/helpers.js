import { restClient } from "client-app-core";

const addNewLookup = async (type, data) => {
	return new Promise((resolve, reject) => {
		if (data.hasOwnProperty("id")) {
			delete data.id;
		}
		switch (type) {
			case "vessel":
				{
					const { loa, imo, grt, draft } = data;
					data.loa = Number(loa);
					data.imo = Number(imo);
					data.grt = Number(grt);
					data.draft = Number(draft);
				}
				break;
			case "barge":
				{
					const { loa, grt } = data;
					data.loa = Number(loa);
					data.grt = Number(grt);
				}
				break;

			default:
				break;
		}
		const body = JSON.stringify(data);
		restClient.exec_post(
			`/berth-schedule-app/api/${type}s`,
			body,
			(err, response) => {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			}
		);
	});
};

const updateLookup = async (id, type, data) => {
	return new Promise((resolve, reject) => {
		delete data.id;
		switch (type) {
			case "vessel":
				{
					const { loa, imo, grt, draft } = data;
					data.loa = Number(loa);
					data.imo = Number(imo);
					data.grt = Number(grt);
					data.draft = Number(draft);
				}
				break;
			case "barge":
				{
					const { loa, grt } = data;
					data.loa = Number(loa);
					data.grt = Number(grt);
				}
				break;

			default:
				break;
		}
		const body = JSON.stringify(data);
		restClient.exec_put(`/berth-schedule-app/api/${type}s/${id}`, body, err => {
			if (err) {
				reject(err);
			}
		});
	});
};

const checkBarges = async barges => {
	if (!!barges && !!barges.length) {
		for (let i = 0; i < barges.length; i++) {
			if (!barges[i].id) {
				const newBarge = await addNewLookup("barge", barges[i]);
				barges[i] = newBarge;
			} else {
				updateLookup(barges[i].id, "barge", { ...barges[i], id: barges[i].id });
			}
		}
	}
	return barges;
};

const checkCargo = async cargo => {
	if (!!cargo && !!cargo.length) {
		for (let i = 0; i < cargo.length; i++) {
			const { shipperReceiver } = cargo[i];
			if (!shipperReceiver.id) {
				const newSR = await addNewLookup("shippersReceiver", shipperReceiver);
				cargo[i].shipperReceiver = newSR;
			}
			if (cargo[i].weight) {
				cargo[i].weight = Number(cargo[i].weight);
			}
		}
	}
	return cargo;
};

export const addBerthAssignment = assignment => {
	const keys = ["agent", "requestedBy", "vessel"];
	const checkIds = async keys => {
		for (let i = 0; i < keys.length; i++) {
			if (!assignment[`${keys[i]}Id`]) {
				const newData = await addNewLookup(keys[i], assignment[keys[i]]);
				assignment[`${keys[i]}Id`] = newData.id;
			} else {
				updateLookup(assignment[`${keys[i]}Id`], keys[i], assignment[keys[i]]);
			}
			delete assignment[keys[i]];
		}
	};

	const addAssignment = async () => {
		await checkIds(keys);
		const barges = await checkBarges(assignment.barges);
		const cargo = await checkCargo(assignment.cargo);
		assignment.barges = barges;
		assignment.cargo = cargo;
		assignment.footmark = Number(assignment.footmark);
		assignment.berthId = assignment.berth.id;
		delete assignment.berth;
		delete assignment.primaryActivity;
		const body = JSON.stringify(assignment);
		restClient.exec_post(
			"/berth-schedule-app/api/berthAssignments",
			body,
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					const { approved, id } = response;
					if (approved) {
						approveAssignment(id);
					}
				}
			}
		);
	};
	addAssignment();
};

export const deleteBerthAssignment = id => {
	restClient.exec_delete(
		`/berth-schedule-app/api/berthAssignments/${id}`,
		err => {
			if (err) {
				console.log("ERROR", err);
			}
		}
	);
};

export const updateBerthAssignment = (id, data, approved = false) => {
	const keys = ["agent", "requestedBy", "vessel"];
	const checkIds = async keys => {
		for (let i = 0; i < keys.length; i++) {
			if (Object.keys(data[keys[i]]).length == 0) {
				//do nothing
			}
			else if (!data[`${keys[i]}Id`]) {
				const newData = await addNewLookup(keys[i], data[keys[i]]);
				data[`${keys[i]}Id`] = newData.id;
			} else {
				updateLookup(data[`${keys[i]}Id`], keys[i], data[keys[i]]);
			}
			delete data[keys[i]];
		}
	};
	const updateAssignment = async () => {
		await checkIds(keys);
		const barges = await checkBarges(data.barges);
		const cargo = await checkCargo(data.cargo);
		data.barges = barges;
		data.cargo = cargo;
		data.footmark = Number(data.footmark);
		data.berthId = data.berth.id;
		delete data.berth;
		delete data.primaryActivity;
		const body = JSON.stringify(data);
		restClient.exec_put(
			`/berth-schedule-app/api/berthAssignments/${id}`,
			body,
			err => {
				if (err) {
					console.log("ERROR", err);
				} else if (approved) {
					approveAssignment(id);
				}
			}
		);
	};
	updateAssignment();
};

export const approveAssignment = id => {
	restClient.exec_put(
		`/berth-schedule-app/api/berthAssignments/approve/${id}`,
		null,
		err => {
			if (err) {
				console.log("ERROR", err);
			}
		}
	);
};
