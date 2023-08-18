import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import { global, dialog, persisted } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, systemHealth, clientConfig, systemNotifications, applicationProfile, baseMaps, i18nRootReducer, statusCards } from "orion-components/Services";
import { combineReducers } from "redux";
import formPanel from "./formPanel";
import date from "./date";
import berths from "./berths";
import berthGroups from "./berthGroups";
import management from "./management";
import assignments from "./assignments";
import map from "./map";
import view from "./view";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({ dock, global, dialog, persisted }),
		globalData: combineReducers({ notifications }),
		contextualData,
		formPanel,
		date,
		berths,
		berthGroups,
		management,
		assignments,
		map,
		view,
		servicesReady,
		systemHealth,
		clientConfig,
		systemNotifications,
		application: applicationProfile,
		i18n: i18nRootReducer,
		baseMaps,
		statusCards
	})
);

export default rootReducer;
