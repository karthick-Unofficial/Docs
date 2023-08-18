import React, { Fragment } from "react";
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
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { Router, Route, Redirect, IndexRedirect, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import ErrorBoundary from "../src/shared/components/ErrorBoundary";
import AppContainer from "./AppContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("tabletop-app");
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts)),
	dynostore(dynamicReducers())
);
export const history = syncHistoryWithStore(hashHistory, store);
import I18nContainer from "orion-components/i18n/I18nContainer";
import TabletopSessionListContainer from "./TabletopSessionList/TabletopSessionListContainer";
import TabletopSessionContainer from "./TabletopSession/TabletopSessionContainer";

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};

export const removeReducer = (path) => {
	store.detachReducers([path]);
};

render(
	<Fragment>
		<I18nContainer store={store} appId="tabletop-app" />
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<MuiThemeProvider theme={createMuiTheme(theme)}>
					<Router history={history}>
						<ErrorBoundary componentName="root">
							<Route path="/" component={AuthAppContainer} >
								<IndexRedirect to="/tabletopSessions" />
								<Route path="/tabletopSessions" component={TabletopSessionListContainer} />
								<Route path="/tabletopSession" component={TabletopSessionContainer} />
							</Route>
						</ErrorBoundary>
						<Redirect from="*" to="/" />
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Fragment>,
	document.getElementById("root")
);
