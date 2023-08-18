import * as t from "./actionTypes";
import { restClient } from "client-app-core";

export const berthReceived = data => {
	return {
		type: t.BERTH_RECEIVED,
		payload: { data }
	};
};

export const addBerth = berth => {
	return dispatch => {
		const { beginningFootmark, endFootmark } = berth;
		const body = JSON.stringify({
			...berth,
			beginningFootmark: Number(beginningFootmark),
			endFootmark: Number(endFootmark)
		});
		restClient.exec_post(
			"/berth-schedule-app/api/berths",
			body,
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					dispatch(berthReceived(response));
				}
			}
		);
	};
};

export const berthRemoved = id => {
	return {
		type: t.BERTH_REMOVED,
		payload: { id }
	};
};

export const deleteBerth = id => {
	return dispatch => {
		restClient.exec_delete(`/berth-schedule-app/api/berths/${id}`, err => {
			if (err) {
				console.log("ERROR", err);
			} else {
				dispatch(berthRemoved(id));
			}
		});
	};
};

export const berthUpdated = (id, data) => {
	return {
		type: t.BERTH_UPDATED,
		payload: { id, data }
	};
};

export const updateBerth = (id, data) => {
	return dispatch => {
		const { beginningFootmark, endFootmark } = data;
		const body = JSON.stringify({
			...data,
			beginningFootmark: Number(beginningFootmark),
			endFootmark: Number(endFootmark)
		});
		restClient.exec_put(`/berth-schedule-app/api/berths/${id}`, body, err => {
			if (err) {
				console.log("ERROR", err);
			} else {
				dispatch(berthUpdated(id, JSON.parse(body)));
			}
		});
	};
};
