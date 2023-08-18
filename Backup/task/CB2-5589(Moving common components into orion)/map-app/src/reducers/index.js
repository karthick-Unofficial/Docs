import { combineReducers } from "redux";
import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { userFeeds } from "orion-components/GlobalData/Reducers";
import floorPlan from "./floorPlan";
import ssrRadarTiles from "./ssrRadarTiles";
import {
	listPanel,
	contextPanelData
} from "orion-components/ContextPanel/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, baseMaps, i18nRootReducer, statusCards } from "orion-components/Services";
import {
	persisted,
	mapRef,
	profile,
	dialog,
	global,
	loading
} from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { baseMap, mapTools, distanceTool, spotlights } from "orion-components/Map/Reducers";

import optimist from "redux-optimist";

const phoenixApp = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		contextualData,
		appState: combineReducers({
			global,
			persisted,
			dock,
			contextPanel: combineReducers({ contextPanelData, listPanel, profile }),
			mapRef,
			dialog,
			loading
		}),
		mapState: combineReducers({ baseMap, mapTools, distanceTool }),
		spotlights,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		floorPlan,
		ssrRadarTiles,
		baseMaps,
		appId: (state = "map-app") => {
			return state;
		},
		i18n: i18nRootReducer,
		statusCards
	})
);

export default phoenixApp;
