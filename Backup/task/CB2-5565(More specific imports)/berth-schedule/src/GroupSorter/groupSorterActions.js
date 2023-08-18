import { updatePersistedState } from "orion-components/AppState/Actions";
export { closeDialog } from "orion-components/AppState/Actions";
export const updateGroupOrder = groups => {
	return dispatch => {
		dispatch(
			updatePersistedState("berth-schedule-app", "orderedGroups", {
				orderedGroups: groups
			})
		);
	};
};
