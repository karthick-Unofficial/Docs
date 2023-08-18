import { identity, user, organization } from "orion-components/Session/Reducers";
import { default as dock } from "orion-components/Dock/Reducers";
import { notifications, userFeeds } from "orion-components/GlobalData/Reducers";
import { global, dialog } from "orion-components/AppState/Reducers";
import { default as contextualData } from "orion-components/ContextualData/Reducers";
import { servicesReady, clientConfig, i18nRootReducer } from "orion-components/Services";
import { combineReducers } from "redux";

import optimist from "redux-optimist";

const rootReducer = optimist(
	combineReducers({
		session: combineReducers({ identity, user, userFeeds, organization }),
		appState: combineReducers({ dock, global, dialog }),
		globalData: combineReducers({ notifications }),
		contextualData,
		servicesReady,
		clientConfig,
		i18n: i18nRootReducer
	})
);

export default rootReducer;
