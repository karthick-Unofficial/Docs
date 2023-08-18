import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";

import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import theme from "orion-components/theme";
import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
import App from "./App";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(App)("camera-wall-app");
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);
const store = createStore(rootReducer, compose(applyMiddleware(thunk, optimisticAlerts), dynostore(dynamicReducers())));

export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";

window.redux = store;

render(
	<Apm serviceName="camera-wall-app-client">
		<Provider store={store}>
			<I18n appId="camera-wall-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthAppContainer />} />
									<Route
										path="/entityId/:entityId/entityName/:entityName/entityType/:entityType/type/:type"
										element={<AuthAppContainer />}
									/>
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
