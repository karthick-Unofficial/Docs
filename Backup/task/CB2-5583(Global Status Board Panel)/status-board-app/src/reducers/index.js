import { combineReducers } from "redux";
import optimist from "redux-optimist";

import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import { global, dialog, persisted } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import {
	contextPanelData,
	listPanel
} from "orion-components/ContextPanel/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, i18nRootReducer, statusCards } from "orion-components/Services";

// import statusCards from "./statusCards";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({
			persisted,
			dock,
			global,
			dialog,
			contextPanel: combineReducers({ contextPanelData, listPanel })
		}),
		globalData: combineReducers({ notifications }),
		contextualData,
		statusCards,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		i18n: i18nRootReducer
	})
);

export default rootReducer;
