import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { Router, Route, Redirect, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import ErrorBoundary from "orion-components/ErrorBoundary";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
import AppContainer from "./AppContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("camera-wall-app");
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts)),
	dynostore(dynamicReducers())
);

export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

import Apm from "orion-components/Apm"; 
import I18nContainer from "orion-components/i18n/I18nContainer";

window.redux = store;
store.subscribe(()=>console.log("camera-wall-store", store.getState()));

export const history = syncHistoryWithStore(hashHistory, store);

render(
	<Apm serviceName="camera-wall-app-client">
		<I18nContainer store={store} appId="camera-wall-app"/>
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<MuiThemeProvider theme={createTheme(theme)}>
					<Router history={history}>
						<ErrorBoundary>
							<Route exact path="/" component={AuthAppContainer} />
							<Route path="/entityId/:entityId/entityName/:entityName/entityType/:entityType/type/:type" component={AuthAppContainer} />
						</ErrorBoundary>
						<Redirect from="*" to="/" />
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
