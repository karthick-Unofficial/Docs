import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { userFeeds, webrtcPlay, playSettings } from "orion-components/GlobalData/Reducers";
import { global, dialog, persisted, profile, mapRef } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import {
	systemHealth,
	servicesReady,
	clientConfig,
	systemNotifications,
	applicationProfile,
	baseMaps,
	i18nRootReducer,
	statusCards
} from "orion-components/Services";
import { listPanel, contextPanelData } from "orion-components/ContextPanel/Reducers";
import { baseMap, mapTools } from "orion-components/Map/Reducers";
import floorPlan from "./floorPlan";
import userAppState from "./userAppState";
import facilitiesImport from "./facilitiesImport";
import { combineReducers } from "redux";

import optimist from "redux-optimist";

const initialState = { open: false };

const settingsMenu = (state = initialState, action) => {
	const { type } = action;
	switch (type) {
		case "SETTINGS_MENU_OPEN":
			return {
				...state,
				open: true
			};
		case "SETTINGS_MENU_CLOSE":
			return {
				...state,
				open: false
			};
		default:
			return state;
	}
};

const rootReducer = optimist(
	combineReducers({
		baseMaps,
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({
			dock,
			global,
			dialog,
			settingsMenu,
			persisted,
			mapRef,
			contextPanel: combineReducers({
				contextPanelData,
				listPanel,
				profile
			})
		}),
		mapState: combineReducers({ baseMap, mapTools }),
		userAppState,
		contextualData,
		systemHealth,
		servicesReady,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		floorPlan,
		facilitiesImportData: facilitiesImport,
		i18n: i18nRootReducer,
		statusCards,
		webrtcPlay,
		playSettings
	})
);

export default rootReducer;
