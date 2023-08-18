import { updatePersistedState } from "orion-components/AppState/Actions";
import { setSelectedPinnedItem } from "../../ListPanel/PinnedItem/pinnedItemActions";
import { setStagedItem } from "../../ListPanel/SearchField/searchFieldActions";

export { openDialog } from "orion-components/AppState/Actions";

export const addToPinnedItems = (item) => {
	return (dispatch, getState) => {
		const pinnedItems = getState().appState.persisted.pinnedItems || [];
		const newPinnedItems = [...pinnedItems, item];
		dispatch(
			updatePersistedState("camera-wall-app", "pinnedItems", {
				pinnedItems: newPinnedItems
			})
		);
		dispatch(setSelectedPinnedItem(item));
		dispatch(setStagedItem(null));
	};
};
