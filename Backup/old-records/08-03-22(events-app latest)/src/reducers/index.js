import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, baseMaps, i18nRootReducer }
	from "orion-components/Services";
import {
	listPanel,
	contextPanelData
} from "orion-components/ContextPanel/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import {
	loading,
	dialog,
	profile,
	persisted,
	global,
	mapRef
} from "orion-components/AppState/Reducers";
import {
	notifications,
	collections,
	cameras,
	events,
	rules,
	dataByFeed,
	listLookupData,
	userFeeds
} from "orion-components/GlobalData/Reducers";
import { baseMap, mapTools } from "orion-components/Map/Reducers";
import floorPlan from "./floorPlan";
import floorPlans from "./floorPlans";
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import userAppState from "./userAppState";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		routing: routerReducer,
		session: combineReducers({ user, identity, userFeeds, organization }),
		floorPlan,
		globalData: combineReducers({
			notifications,
			collections,
			cameras,
			events,
			listLookupData,
			rules,
			fovs: dataByFeed("fovs", "globalData"),
			floorPlans
		}),
		contextualData,
		appState: combineReducers({
			persisted,
			loading,
			contextPanel: combineReducers({
				contextPanelData,
				listPanel,
				profile
			}),
			global,
			mapRef,
			dock,
			dialog
		}),
		mapState: combineReducers({
			baseMap,
			mapTools
		}),
		userAppState,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		baseMaps,
		appId: (state = "events-app") => {
			return state;
		},
		i18n: i18nRootReducer
	})
);

export default rootReducer;
