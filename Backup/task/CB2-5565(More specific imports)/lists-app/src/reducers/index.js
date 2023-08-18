import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import {
	listPanel,
	contextPanelData
} from "orion-components/ContextPanel/Reducers";
import {
	loading,
	dialog,
	persisted,
	global
} from "orion-components/AppState/Reducers";
import { userFeeds } from "orion-components/GlobalData/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, i18nRootReducer } from "orion-components/Services";
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		routing: routerReducer,
		session: combineReducers({ identity, user, userFeeds, organization }),
		globalData: {},
		contextualData,
		appState: combineReducers({
			global,
			loading,
			persisted,
			dialog,
			dock,
			contextPanel: combineReducers({
				contextPanelData,
				listPanel
			})
		}),
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		i18n: i18nRootReducer
	})
);

export default rootReducer;
