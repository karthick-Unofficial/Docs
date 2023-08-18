import React from "react";
import { render } from "react-dom";
import theme from "orion-components/theme";

// Components and Containers
import App from "./App";
import SpotlightWindow from "./Spotlight/SpotlightWindow/SpotlightWindow";

// Access to app
import checkAppAccess from "orion-components/CheckAppAccess";

// Auth
import requireAuthentication from "orion-components/Authenticate";

// CSS
import "./index.css";

// Redux
import { createStore, compose, applyMiddleware /*, compose */ } from "redux";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
import phoenixApp from "./reducers";
import { Provider } from "react-redux";

// Routing
import { HashRouter, Route, Routes } from "react-router-dom";

// Redux middleware
import thunkMiddleware from "redux-thunk";
import { optimisticAlerts } from "orion-components/Dock";

// Debounce for search update
import createDebounce from "redux-debounce";

// Mui
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";

import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";
const CheckAppContainer = checkAppAccess(App)("map-app");
const CheckAppAuthContainer = requireAuthentication(CheckAppContainer);
const config = { search: 150 };
const debouncer = createDebounce(config);

require("viewport-units-buggyfill").init();

// const injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

const store = createStore(
	phoenixApp,
	compose(applyMiddleware(thunkMiddleware, debouncer, optimisticAlerts), dynostore(dynamicReducers()))
);

window.redux = store;

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};

render(
	<Apm serviceName="map-app-client">
		<Provider store={store}>
			<I18n appId="map-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<Routes>
								<Route index path="/" element={<CheckAppAuthContainer />} />
								<Route path="/spotlight" element={<SpotlightWindow />} />
							</Routes>
						</HashRouter>
					</ThemeProvider>
				</StyledEngineProvider>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
