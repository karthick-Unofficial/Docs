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
import optimisticListUpdating from "./middleware/optimisticListUpdating";

import { optimisticAlerts } from "orion-components/Dock";

// Material UI
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Router
import { Router, Route, Redirect, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// components
import AppContainer from "./AppContainer";

// access to app
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("events-app");

// authentication
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);

// debounce for search update
import createDebounce from "redux-debounced";

import Apm from "orion-components/Apm"; 
import I18nContainer from "orion-components/i18n/I18nContainer";

// Create Store
const store = createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(
			createDebounce(),
			thunk,
			optimisticAlerts,
			optimisticListUpdating
		)
	)
);

window.redux = store;
store.subscribe(() => console.log("store", store.getState()));

// Sync navigation with store
export const history = syncHistoryWithStore(hashHistory, store);

render(
	<Apm serviceName="events-app-client">
		<I18nContainer store={store} appId="events-app"/>
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
