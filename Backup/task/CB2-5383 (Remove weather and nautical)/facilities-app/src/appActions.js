import * as t from "./actionTypes";
export { hydrateUser } from "orion-components/Session/Actions";
export { subscribeAppFeedPermissions, subscribeFeed, subscribeFloorPlansWithFacilityFeedId } from "orion-components/GlobalData/Actions";
export {
	getAppState,
	getGlobalAppState
} from "orion-components/AppState/Actions";

export const _setWidgetLaunchData = widgetLaunchData => {
	return {
		type: t.SET_WIDGET_LAUNCH_DATA,
		payload: widgetLaunchData
	};
};

export const setWidgetLaunchData = (data) => {
	return dispatch => {
		dispatch(_setWidgetLaunchData({ widgetLaunchData: data }));
	};
};