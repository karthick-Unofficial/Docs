import _ from "lodash";
import * as actionTypes from "../../actionTypes";

export const canManage = ( user ) => {
	if (!(user && user.applications)) {
		return false;
	}
	const application = user.applications.find(app => app.appId === "tabletop-app");
	if (!(application && application.permissions)) {
		return false;
	}
	return application.permissions.includes("manage");
};

const threshold = 0.000001;

export const doubleEquals = (val1, val2) => {
	if (val1 == null || val2 == null) {
		return false;
	}
	return Math.abs(val1 - val2) < threshold;
};

export const doubleLessThanEquals = (val1, val2) => {
	if (val1 == null || val2 == null) {
		return false;
	}
	return (val1 < val2) || (Math.abs(val1 - val2) < threshold);
};

export const doubleGreaterThan = (val1, val2) => {
	if (val1 == null || val2 == null) {
		return false;
	}
	return !(Math.abs(val1 - val2) < threshold) && (val1 > val2);
};

export const sleep = ( ms ) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};


export const createAgentCopy = ( origAgent, copyEquipment = false ) => {
	const agent = { 
		...origAgent,
		entityData: {}
	};
	const propertiesToExclude = ["heading", "vehicle", "lastSeenTime"];
	if (!copyEquipment) {
		propertiesToExclude.push("equipment");
	}
	agent.entityData.properties = _.omit(origAgent.entityData.properties, propertiesToExclude);
	return agent;
};

const UNKNOWN_ERROR_MSG = "Unknown Error Occurred.";
export const handleApiError = (err, response, dispatch) => {
	let error;
	if (err) {
		error = err && err.response && err.response.statusText 
			? err.response.statusText 
			: UNKNOWN_ERROR_MSG;
	} else if (response && response.success === false && response.reason && response.reason.message
		&& ((typeof response.reason.message === "string" || response.reason.message instanceof String))) {
		error = response.reason.message;
	} else {
		error = UNKNOWN_ERROR_MSG;
	}

	console.log(error);
	if (error === UNKNOWN_ERROR_MSG) {
		if (err) {
			console.log(`err: ${typeof err === "object" ? JSON.stringify(err) : err}`);
		}
		if (response) {
			console.log(`response: ${typeof response === "object" ? JSON.stringify(response) : response}`);
		}
	}

	if (dispatch) {
		dispatch({
			type: actionTypes.OPERATION_FAILED,
			error
		});
	}

	return error;
};

export const  truncate = (num, places) => {
	const number = Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
	if(Number.isInteger(number)){
		return number.toFixed(places);
	}
	else {
		return number;
	}
};