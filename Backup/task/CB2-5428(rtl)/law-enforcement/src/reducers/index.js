import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import { global, dialog, persisted } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, i18nRootReducer } from "orion-components/Services";
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import {
	listPanel,
	contextPanelData
} from "orion-components/ContextPanel/Reducers";
import searchForm from "./searchForm";
import results from "./results";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		routing: routerReducer,
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({
			contextPanel: combineReducers({ contextPanelData, listPanel }),
			dock,
			global,
			dialog,
			persisted
		}),
		globalData: combineReducers({ notifications }),
		contextualData,
		searchForm,
		results,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
	    i18n: i18nRootReducer
	})
);

export default rootReducer;
