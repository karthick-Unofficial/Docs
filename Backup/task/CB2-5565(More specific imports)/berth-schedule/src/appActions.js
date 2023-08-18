import * as t from "./actionTypes";
import { realtimeClient, restClient } from "client-app-core";
export {
	openBerthManager
} from "./BerthGroup/BerthTimeline/berthTimelineActions";
export { hydrateUser } from "orion-components/Session/Actions";
export { subscribeFeedPermissions } from "orion-components/GlobalData/Actions";
export {
	getAppState,
	getGlobalAppState
} from "orion-components/AppState/Actions";

export const berthsReceived = data => {
	return {
		type: t.BERTHS_RECEIVED,
		payload: { data }
	};
};

export const getAllBerths = () => {
	return dispatch => {
		restClient.exec_get("/berth-schedule-app/api/berths", (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				dispatch(berthsReceived(response));
			}
		});
	};
};

export const berthGroupsReceived = data => {
	return {
		type: t.BERTH_GROUPS_RECEIVED,
		payload: { data }
	};
};

export const getAllBerthGroups = () => {
	return dispatch => {
		restClient.exec_get(
			"/berth-schedule-app/api/berthGroups",
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					dispatch(berthGroupsReceived(response));
				}
			}
		);
	};
};

const berthAssignmentsReceived = data => {
	return {
		type: t.BERTH_ASSIGNMENTS_RECEIVED,
		payload: { data }
	};
};

const berthAssignmentReceived = data => {
	return {
		type: t.BERTH_ASSIGNMENT_RECEIVED,
		payload: { data }
	};
};

const berthAssignmentRemoved = id => {
	return {
		type: t.BERTH_ASSIGNMENT_REMOVED,
		payload: { id }
	};
};

const berthAssignmentUpdated = (id, data) => {
	return {
		type: t.BERTH_ASSIGNMENT_UPDATED,
		payload: { id, data }
	};
};

export const subscribeBerthAssignments = () => {
	return dispatch => {
		realtimeClient.subscribe(
			"berth-schedule-app",
			"/berthAssignments",
			{},
			msg => {
				const response = JSON.parse(msg);
				const initialBatch = [];
				response.forEach(r => {
					const { new_val, type } = r;
					switch (type) {
						case "initial":
							initialBatch.push(new_val);
							break;
						case "add":
							dispatch(berthAssignmentReceived(new_val));
							break;
						case "remove":
							dispatch(berthAssignmentRemoved(new_val.id));
							break;
						case "change":
							dispatch(berthAssignmentUpdated(new_val.id, new_val));
							break;
						default:
							break;
					}
				});
				dispatch(berthAssignmentsReceived(initialBatch));
			}
		);
	};
};
