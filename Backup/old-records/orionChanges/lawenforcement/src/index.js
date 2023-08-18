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
import AppContainer from "./AppContainer";
import I18nContainer from "orion-components/i18n/I18nContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)(
	"law-enforcement-search-app"
);
import requireAuthentication from "orion-components/Authenticate";
import Apm from "orion-components/Apm"; 
const AuthAppContainer = requireAuthentication(CheckAppContainer);
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;
store.subscribe(()=>console.log("store", store.getState()));
export const history = syncHistoryWithStore(hashHistory, store);

render(
	<Apm serviceName="law-enforcement-search-app-client">
	  <I18nContainer store={store} appId="law-enforcement-search-app"/>
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<MuiThemeProvider theme={createMuiTheme(theme)}>
					<Router history={history}>
						<ErrorBoundary>
							<Route path="/" component={AuthAppContainer} />
						</ErrorBoundary>
						<Redirect from="*" to="/" />
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
