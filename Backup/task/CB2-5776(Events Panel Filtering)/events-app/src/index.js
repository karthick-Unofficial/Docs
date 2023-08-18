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
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";

// Router
import { HashRouter, Route, Routes } from "react-router-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// components
import App from "./App";

// access to app
import checkAppAccess from "orion-components/CheckAppAccess";

// authentication
import requireAuthentication from "orion-components/Authenticate";

// debounce for search update
import createDebounce from "redux-debounced";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";

import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";
const CheckApp = checkAppAccess(App)("events-app");
const AuthApp = requireAuthentication(CheckApp);

// Create Store
const store = createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(createDebounce(), thunk, optimisticAlerts, optimisticListUpdating),
		dynostore(dynamicReducers())
	)
);

window.redux = store;

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};

render(
	<Apm serviceName="events-app-client">
		<Provider store={store}>
			<I18n appId="events-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthApp />} />
									<Route path="/entity/:entityId/widget/:widget" element={<AuthApp />} />
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
