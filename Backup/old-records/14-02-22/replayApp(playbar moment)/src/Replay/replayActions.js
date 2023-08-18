import * as t from "../actionTypes";
import { replayService } from "client-app-core";
import moment from "moment-timezone";
import _ from "lodash";

export { addToDock, setMedia } from "./RightToolbar/ReplayCameraDock/replayCameraDockActions";

const transactionsReceived = (allTransactions, timeTransactions) => {
	return {
		type: t.TRANSACTIONS_RECEIVED,
		payload: {allTransactions, timeTransactions}
	};
};

const alertsReceived = (alerts) => {
	return {
		type: t.ALERTS_RECEIVED,
		payload: { alerts }
	};
};

const playBarAlertsReceived = playBarAlerts => {
	return {
		type: t.PLAYBAR_ALERTS_RECEIVED,
		payload: { playBarAlerts }
	};
};

const sortTransactions = (timeGroups, timeTransactions, allTransactions, prevTime) => {
	let newTime = prevTime;
	Object.keys(timeGroups).sort().forEach(time => {
		if (!timeTransactions[time]) {
			timeTransactions[time] = newTime ? { ...timeTransactions[newTime] } : {};
		}
		timeGroups[time].forEach(txn => {
			allTransactions.push(txn);
			const pointer = allTransactions[allTransactions.length - 1];
			timeTransactions[time][txn.id] = pointer;
		});
		newTime = time;
	});
	return newTime;
};

const getTransactions = async (startDate, endDate, filter, scrollId, allTransactions, timeTransactions, dispatch, prevTime) => {

	let result = null;
	if(window.api) { // running in electron
		result = window.api.getTransactions();
	}
	else {
		result = await replayService.getTransactions(endDate, startDate, filter, 500, scrollId);
	}

	try {
		if (result && result.items) {
			const newTime = sortTransactions(result.items, timeTransactions, allTransactions, prevTime);
			dispatch(transactionsReceived(allTransactions, timeTransactions));
			if (result.count && !window.api) {
				getTransactions(startDate, endDate, filter, result.scrollId, allTransactions, timeTransactions, dispatch, newTime);
			}
		} else {
			console.log("Error fetching transactions: ", result);
		}
	}
	catch(err) {
		console.log(err);
	}
};

export const getSnapshot = (startDate, endDate, coordinates) => {
	return async (dispatch) => {
		const prevTime = null;
		let initialSnapshot = [];
		const allTransactions = [];
		const timeTransactions = {};
		const filter = {
			"type": "bbox",
			coordinates
		};

		try {
			let result = null;
			if(window.api) { // running in electron
				result = window.api.getSnapshot();
			}
			else {
				result = await replayService.getSnapshot(startDate, filter);
			}

			if (result && result.items) {
				initialSnapshot = result.items;
				initialSnapshot.forEach(ent => {
					ent["transactionTime"] = ent.entityType === "track" ? ent.acquisitionTime : ent.lastModifiedDate ? ent.lastModifiedDate : ent.lastModified;
				});
				const initialTimeGroups = _.groupBy(initialSnapshot, function (txn) {
					return moment(txn.transactionTime).endOf("second").add(1, "ms").toISOString();
				});
				const newTime = sortTransactions(initialTimeGroups, timeTransactions, allTransactions, prevTime);
				getTransactions(startDate, endDate, filter, undefined, allTransactions, timeTransactions, dispatch, newTime);
			} 
			else {
				console.log("ERROR FETCHING SNAPSHOT: ", result);
			}
		}
		catch(err) {
			console.log(err.message, err.stack, "ERROR: STUFF BROKE AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
		}

	};

};

export const getAlertTransactions = async (startDate, endDate, filter, alertTransactions, allAlerts, dispatch, prevTime) => {
	let result = null;
	if(window.api) { // running in electron
		result = window.api.getAlertTransactions();
	}
	else {
		try {
			result = await replayService.getAlertTransactions(endDate, startDate, filter);
		}
		catch(err) {
			console.log("err: ", err);
		}
	}

	if (result && result.items) {
		sortTransactions(result.items, alertTransactions, allAlerts, prevTime);
		dispatch(alertsReceived(alertTransactions));
	} else {
		console.log("ERROR FETCHING ALERT TRANSACTIONS: ", result);
	}
};

export const getTimelineAlerts = (startDate, endDate, coordinates) => {
	return async (dispatch) => {
		const filter = {
			"type:": "bbox",
			coordinates
		};
		const alertTransactions = {};

		let result = null;
		if(window.api) { // running in electron
			result = window.api.getTimelineAlerts();
		}
		else {
			try {
				result = await replayService.getTimelineAlerts(endDate, startDate, filter);
			}
			catch(err) {
				console.log("err: ", err);
			}
		}
	
		if (result && result.items) {
			const newTime = sortTransactions(result.items, alertTransactions, [], null);
			getAlertTransactions(startDate, endDate, filter, alertTransactions, [], dispatch, newTime);
			dispatch(playBarAlertsReceived(result.items));
		} else {
			console.log("ERROR FETCHING TIMELINE ALERTS: ", result);
		}
	};
};