import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { userFeeds, webrtcPlay, playSettings } from "orion-components/GlobalData/Reducers";
import { global, dialog, persisted } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import {
	servicesReady,
	systemHealth,
	clientConfig,
	systemNotifications,
	applicationProfile,
	i18nRootReducer,
	statusCards
} from "orion-components/Services";
import { contextPanelData, listPanel } from "orion-components/ContextPanel/Reducers";
import cameraWall from "./cameraWall";
import camerasByContext from "./camerasByContext";
import { combineReducers } from "redux";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({
			dock,
			global,
			dialog,
			contextPanel: combineReducers({ contextPanelData, listPanel }),
			persisted
		}),
		cameraWall,
		camerasByContext,
		contextualData,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		i18n: i18nRootReducer,
		statusCards,
		webrtcPlay,
		playSettings
	})
);

export default rootReducer;
