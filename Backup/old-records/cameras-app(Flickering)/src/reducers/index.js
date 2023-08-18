// NEW
import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import {
	userFeeds
} from "orion-components/GlobalData/Reducers";
import {
	listPanel,
	contextPanelData
} from "orion-components/ContextPanel/Reducers";
import {
	persisted,
	mapRef,
	profile,
	dialog,
	loading,
	global
} from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, baseMaps, i18nRootReducer } from "orion-components/Services";

import { combineReducers } from "redux";

import { baseMap, mapTools, distanceTool } from "orion-components/Map/Reducers";

// OLD
import userAppState from "./userAppState";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		globalData: {},
		contextualData,
		appState: combineReducers({
			persisted,
			dock,
			contextPanel: combineReducers({ contextPanelData, listPanel, profile }),
			global,
			mapRef,
			dialog,
			loading
		}),
		mapState: combineReducers({ baseMap, mapTools, distanceTool }),
		userAppState,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		baseMaps,
		appId: (state = "cameras-app") => {
			return state;
		},
		i18n: i18nRootReducer
	})
);

export default rootReducer;
