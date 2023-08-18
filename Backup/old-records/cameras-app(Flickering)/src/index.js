import React from "react";
import { render } from "react-dom";
import theme from "orion-components/theme";
import "./index.css";

// Redux
import { createStore, compose, applyMiddleware } from "redux";
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
import { HashRouter, Route, Routes } from "react-router-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// components
import App from "./App";

// access to app
import checkAppAccess from "orion-components/CheckAppAccess";
import dynostore, {
	dynamicReducers
} from "@redux-dynostore/core";
// authentication
import requireAuthentication from "orion-components/Authenticate";

import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";
const CheckAppContainer = checkAppAccess(App)("cameras-app");
const AuthAppContainer = requireAuthentication(CheckAppContainer);

// touchTap
// import injectTapCameraPlugin from "react-tap-event-plugin";
// injectTapCameraPlugin();

// Create Store
const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk, optimisticAlerts),
		dynostore(dynamicReducers())
	)
);

window.redux = store;
store.subscribe(() => console.log("store", store.getState()));
export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

render(
	<Apm serviceName="cameras-app-client">
		<I18nContainer store={store} appId="cameras-app">
			<Provider store={store}>
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<MuiThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthAppContainer />} />
									<Route path="/entity/:entityId/widget/:widget" component={<AuthAppContainer />} />
								</Routes>
							</ErrorBoundary>
						</HashRouter>
					</MuiThemeProvider>
				</LegacyMuiThemeProvider>
			</Provider>
		</I18nContainer>
	</Apm>,
	document.getElementById("root")
);
