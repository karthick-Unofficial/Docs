import { addContext } from "orion-components/ContextualData/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { addSpotlight } from "orion-components/Map/Tools/Actions";
export {
	startTrackHistoryStream,
	removeSubscriber,
	unsubscribeFromFeed
} from "orion-components/ContextualData/Actions";

export const addNewContext = (id, entity) => {
	return (dispatch, getState) => {
		const existingContext = getState().contextualData[id];
		if (!existingContext) {
			dispatch(addContext(id, entity));
		}
	};
};
