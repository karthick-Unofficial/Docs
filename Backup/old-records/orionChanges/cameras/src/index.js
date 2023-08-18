import React from "react";
import { render } from "react-dom";
import theme from "orion-components/theme";
import "./index.css";

// Redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

import { optimisticAlerts } from "orion-components/Dock";

// Material UI
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Router
import {
	Router,
	Route,
	Redirect,
	IndexRedirect,
	hashHistory
} from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// components
import AppContainer from "./AppContainer";

// access to app
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("cameras-app");
import dynostore, {
	dynamicReducers
} from "@redux-dynostore/core";
// authentication
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);

import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";

// touchTap
// import injectTapCameraPlugin from "react-tap-event-plugin";
// injectTapCameraPlugin();

// Create Store
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts)),
	dynostore(dynamicReducers())
);

window.redux = store;

// Sync navigation with store
export const history = syncHistoryWithStore(hashHistory, store);
export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

render(
	<Apm serviceName="cameras-app-client">
		<I18nContainer store={store} appId="cameras-app" />
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<MuiThemeProvider theme={createMuiTheme(theme)}>
					<Router history={history}>
						<ErrorBoundary>
							<Route exact path="/" component={AuthAppContainer} />
							<Route path="/entity/:entityId/widget/:widget" component={AuthAppContainer} />
						</ErrorBoundary>
						<Redirect from="*" to="/" />
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
