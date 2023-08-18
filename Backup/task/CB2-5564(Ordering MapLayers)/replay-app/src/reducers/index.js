import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { userFeeds } from "orion-components/GlobalData/Reducers";
import replay from "./replay";
import playBar from "./playBar";
import floorPlan from "./floorPlan";
import replayMapRef from "./replayMap";
import replayBaseMap from "./replayBaseMap";
import replayCamerasDock from "./replayCamerasDock";
import {
	global,
	dialog,
	persisted,
	profile,
	mapRef,
	loading
} from "orion-components/AppState/Reducers";
import { baseMap } from "orion-components/Map/Reducers";
import {
	listPanel,
	contextPanelData
} from "orion-components/ContextPanel/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { combineReducers } from "redux";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, baseMaps, i18nRootReducer, statusCards } from "orion-components/Services";
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
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({
			dock,
			global,
			loading,
			settingsMenu,
			dialog,
			persisted,
			mapRef,
			replayMapRef,
			contextPanel: combineReducers({ contextPanelData, listPanel, profile }),
			replayCamerasDock
		}),
		contextualData,
		mapState: combineReducers({ baseMap }),
		replayMapState: combineReducers({ replayBaseMap }),
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		replay,
		playBar,
		floorPlan,
		baseMaps,
		i18n: i18nRootReducer,
		statusCards
	})
);

export default rootReducer;
