import { combineReducers } from "redux";
// import rules from "./rules";
import { routerReducer } from "react-router-redux";
import profilePage from "./profilePage";
import indexPage from "./indexPage";
import healthSystems from "./healthSystems";
import org from "./org";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { dialog, persisted, global } from "orion-components/AppState/Reducers";
import { identity, user, organization } from "orion-components/Session/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, i18nRootReducer } from "orion-components/Services";
import {
	notifications,
	rules,
	collections,
	userFeeds
} from "orion-components/GlobalData/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import berths from "./berths";

import optimist from "redux-optimist";

const rulesReducers = optimist(
	combineReducers({
		routing: routerReducer,
		session: combineReducers({
			identity,
			user,
			userFeeds,
			organization
		}),
		globalData: combineReducers({
			rules,
			notifications,
			collections,
			healthSystems,
			org,
			berths
		}),
		contextualData,
		appState: combineReducers({
			global,
			persisted,
			dock,
			indexPage,
			profilePage,
			dialog
		}),
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		i18n: i18nRootReducer
	})
);

export default rulesReducers;
