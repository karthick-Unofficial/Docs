import { updatePersistedState } from "orion-components/AppState/Actions";
export {
	openPrimary,
	closePrimary
} from "orion-components/ContextPanel/Actions";
export { openDialog } from "orion-components/AppState/Actions";
export { getListCategory } from "orion-components/GlobalData/Actions";
export const setPinnedLists = lists => {
	return dispatch => {
		dispatch(
			updatePersistedState("lists-app", "pinnedLists", { pinnedLists: lists })
		);
	};
};
