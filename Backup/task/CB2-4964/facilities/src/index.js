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
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { Router, Route, Redirect, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import ErrorBoundary from "orion-components/ErrorBoundary";
import dynostore, {
	dynamicReducers
} from "@redux-dynostore/core";
import AppContainer from "./AppContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("facilities-app");
import requireAuthentication from "orion-components/Authenticate";
import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";

const AuthAppContainer = requireAuthentication(CheckAppContainer);
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts)),
	dynostore(dynamicReducers())
);



export const history = syncHistoryWithStore(hashHistory, store);
export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

window.redux = store;

render(
	<Apm serviceName="facilities-app-client">
		<I18nContainer store={store} appId="facilities-app" />
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<MuiThemeProvider theme={createMuiTheme(theme)}>
					<Router history={history}>
						<ErrorBoundary>
							<Route exact path="/" component={AuthAppContainer} />
							<Route path="/entity/:entityId" component={AuthAppContainer} />
						</ErrorBoundary>
						<Redirect from="*" to="/" />
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
