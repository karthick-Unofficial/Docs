import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import {default as users} from "./users";

import { persisted, mapRef, global, dialog } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { systemHealth, clientConfig, i18nRootReducer } from "orion-components/Services";
import { baseMap, mapTools, distanceTool } from "orion-components/Map/Reducers";
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import error from "./error";
import componentMessage from "./componentMessage";
import localState from "./localState";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		routing: routerReducer,
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({ dock, global, persisted, mapRef, dialog }),
		globalData: combineReducers({ notifications, users }),
		contextualData,
		mapState: combineReducers({ baseMap, mapTools, distanceTool }),
		systemHealth,
		clientConfig,
		error,
		componentMessage,
		localState,
		i18n: i18nRootReducer
	})
);

export default rootReducer;
