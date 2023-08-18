import * as t from "./actionTypes";
export { hydrateUser } from "orion-components/Session/Actions";

export {
	subscribeCameras,
	subscribeFeed,
	subscribeCollections,
	subscribeFeedPermissions,
	subscribeAppFeedPermissions,
	getEventTypes
} from "orion-components/GlobalData/Actions";

export { getAppState, getGlobalAppState, toggleMapVisible } from "orion-components/AppState/Actions";

export const _setWidgetLaunchData = (widgetLaunchData) => {
	return {
		type: t.SET_WIDGET_LAUNCH_DATA,
		payload: widgetLaunchData
	};
};

export const setWidgetLaunchData = (data) => {
	return (dispatch) => {
		dispatch(_setWidgetLaunchData({ widgetLaunchData: data }));
	};
};
