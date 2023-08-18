import orgs from "./orgs";
import users from "./users";
import integrations from "./integrations";
import apps from "./apps";
import errors from "./errors";
import saveStates from "./saveStates";
import viewing from "./viewing";
import dialogData from "./dialogData";
import sharingTokens from "./sharingTokens";
import { combineReducers } from "redux";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import { user, identity, organization } from "orion-components/Session/Reducers";
import {
	dialog,
	loading,
	global
} from "orion-components/AppState/Reducers";
import { default as login } from "../Login/reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, i18nRootReducer, statusCards } from "orion-components/Services";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, login, userFeeds, organization }),
		globalData: combineReducers({
			notifications,
			orgs,
			users,
			integrations,
			apps
		}),
		contextualData,
		appState: combineReducers({
			dock,
			errors,
			global,
			saveStates,
			viewing,
			dialogData,
			loading,
			dialog,
			sharingTokens
		}),
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		i18n: i18nRootReducer,
		statusCards
	})
);

export default rootReducer;
