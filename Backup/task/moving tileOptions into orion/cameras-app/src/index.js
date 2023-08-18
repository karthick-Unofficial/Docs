import React from "react";
import { render } from "react-dom";
import theme from "orion-components/theme";
import "./index.css";

// Redux
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

import { optimisticAlerts } from "orion-components/Dock";

// Material UI
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";

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
import I18n from "orion-components/i18n";
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
store.subscribe(() => console.log("#store", store.getState()));

export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

render(
	<Apm serviceName="cameras-app-client">
		<Provider store={store}>
			<I18n appId="cameras-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthAppContainer />} />
									<Route path="/entity/:entityId/widget/:widget" component={<AuthAppContainer />} />
								</Routes>
							</ErrorBoundary>
						</HashRouter>
					</ThemeProvider>
				</StyledEngineProvider>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
