import * as t from "./actionTypes";
import { restClient } from "client-app-core";
import { deleteBerth } from "./BerthRow/berthRowActions";
import { updateGroupOrder } from "../../../GroupSorter/groupSorterActions";

const berthGroupReceived = data => {
	return {
		type: t.BERTH_GROUP_RECEIVED,
		payload: { data }
	};
};

export const addBerthGroup = name => {
	return dispatch => {
		const body = JSON.stringify({
			name
		});
		restClient.exec_post(
			"/berth-schedule-app/api/berthGroups",
			body,
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					dispatch(berthGroupReceived(response));
				}
			}
		);
	};
};

const berthGroupUpdated = (id, data) => {
	return {
		type: t.BERTH_GROUP_UPDATED,
		payload: { id, data }
	};
};

export const updateBerthGroup = (id, data) => {
	return (dispatch, getState) => {
		const body = JSON.stringify(data);
		restClient.exec_put(
			`/berth-schedule-app/api/berthGroups/${id}`,
			body,
			err => {
				if (err) {
					console.log("ERROR", err);
				} else {
					dispatch(berthGroupUpdated(id, data));
					const { orderedGroups } = getState().appState.persisted;
					if (orderedGroups) {
						const newGroups = [...orderedGroups];
						const index = newGroups.findIndex(group => group.id === id);
						newGroups[index] = data;
						dispatch(updateGroupOrder(newGroups));
					}
				}
			}
		);
	};
};

const berthGroupRemoved = id => {
	return {
		type: t.BERTH_GROUP_REMOVED,
		payload: { id }
	};
};

export const deleteBerthGroup = (id, berths) => {
	return (dispatch, getState) => {
		const removeBerths = async berths => {
			for (let i = 0; i < berths.length; i++) {
				await dispatch(deleteBerth(berths[i].id));
			}
		};
		const remove = async () => {
			await removeBerths(berths);
			restClient.exec_delete(
				`/berth-schedule-app/api/berthGroups/${id}`,
				err => {
					if (err) {
						console.log("ERROR", err);
					} else {
						const { orderedGroups } = getState().appState.persisted;
						if (orderedGroups) {
							dispatch(
								updateGroupOrder(orderedGroups.filter(group => group.id !== id))
							);
						}
						dispatch(berthGroupRemoved(id));
					}
				}
			);
		};
		remove();
	};
};
