import { userService } from "client-app-core";

import * as t from "./actionTypes";

export { hydrateUser } from "orion-components/Session/Actions";
export {
	subscribeAppFeedPermissions,
	getEventTypes
} from "orion-components/GlobalData/Actions";
export {
	toggleMapVisible,
	getGlobalAppState
} from "orion-components/AppState/Actions";
import { toggleMapVisible } from "orion-components/AppState/Actions";

// ONLY PULL WHAT WE NEED OFF OF THIS
export const mapAppStateReceived = userAppState => {
	return {
		type: t.MAP_APP_STATE_RECEIVED,
		payload: userAppState
	};
};

export const getMapAppState = () => {
	return dispatch => {
		const app = "map-app";
		return new Promise((resolve, reject) => {
			userService.getAppState(app, (err, result) => {
				if (err) {
					console.log(err);
				} else {
					dispatch(mapAppStateReceived(result.state));
					resolve();
				}
			});
		});
	};
};

export const setAppState = keyVal => {
	return dispatch => {
		const app = "events-app";
		userService.setAppState(app, keyVal, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

// This action is async. Refer to /middleware/optimisticListUpdating
export const updateListCheckbox = (listId, list) => {
	return {
		type: t.UPDATE_LIST_CHECKBOX,
		payload: {
			listId: listId,
			list: list
		}
	};
};

export const setWidgetLaunchData = widgetLaunchData => {
	return {
		type: t.SET_WIDGET_LAUNCH_DATA,
		payload: widgetLaunchData
	};
};

export const updateWidgetLaunchData = (data) => {
	return dispatch => {
		dispatch(setWidgetLaunchData({ widgetLaunchData: data }));
	};
};

export const _selectWidget = widget => {
	return {
		type: t.SELECT_WIDGET,
		payload: widget
	};
};

export const selectWidget = widget => {
	return (dispatch, getState) => {
		const prevWidget = getState().userAppState.eventView;

		if (
			(prevWidget !== "Map Planner" && widget === "Map Planner") ||
			(prevWidget === "Map Planner" && widget !== "Map Planner")
		) {
			dispatch(toggleMapVisible());
		}
		dispatch(_selectWidget(widget));
	};
};