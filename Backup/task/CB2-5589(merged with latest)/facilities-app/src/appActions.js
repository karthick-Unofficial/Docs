import * as t from "./actionTypes";
import { selectFloorPlan } from "./ListPanel/listPanelActions";
export { hydrateUser } from "orion-components/Session/Actions";
export {
	subscribeAppFeedPermissions,
	subscribeFeed,
	subscribeFloorPlansWithFacilityFeedId
} from "orion-components/GlobalData/Actions";
export { getAppState, getGlobalAppState } from "orion-components/AppState/Actions";

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

export const openSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_OPEN
	};
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};

export const closeSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_CLOSE
	};
};
