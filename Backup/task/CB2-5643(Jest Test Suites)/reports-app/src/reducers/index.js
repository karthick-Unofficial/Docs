import { combineReducers } from "redux";
import reportTypes from "./reportTypes.js";
import reportCategories from "./reportCategories.js";
import reportBuilder from "./reportBuilder";
import reportViewer from "./reportViewer";
import { 
	dialog, 
	persisted, 
	global 
} from "orion-components/AppState/Reducers";
import { 
	identity, 
	user,
	organization
} from "orion-components/Session/Reducers";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, i18nRootReducer, statusCards } from "orion-components/Services";


import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		globalData: combineReducers({ reportTypes, reportCategories, notifications }),
		contextualData,
		appState: combineReducers({ 
			global,
			persisted,
			dock,
			reportBuilder,
			reportViewer,
			dialog
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
