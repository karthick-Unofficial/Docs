import React from "react";
import { render } from "react-dom";
import theme from "orion-components/theme";

// Components and Containers
import AppContainer from "./AppContainer";
import SpotlightWindow from "./Spotlight/SpotlightWindow/SpotlightWindow";

// Access to app
import checkAppAccess from "orion-components/CheckAppAccess";

// Auth
import requireAuthentication from "orion-components/Authenticate";
import ErrorBoundary from "orion-components/ErrorBoundary";

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

// Material-ui
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";
const CheckAppContainer = checkAppAccess(AppContainer)("map-app");
const CheckAppAuthContainer = requireAuthentication(CheckAppContainer);
const config = { search: 150 };
const debouncer = createDebounce(config);

require("viewport-units-buggyfill").init();

// const injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

const store = createStore(
	phoenixApp,
	compose(
		applyMiddleware(
			thunkMiddleware,
			debouncer,
			optimisticAlerts
		), 
		dynostore(dynamicReducers())
	)
);

window.redux = store;

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};

render(
	<Apm serviceName="map-app-client">
		<I18nContainer store={store} appId="map-app">
			<Provider store={store}>
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<ThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<Routes>
								<Route index path="/" element={<CheckAppAuthContainer />} />
								<Route path="/spotlight" element={<SpotlightWindow />} />
							</Routes>
						</HashRouter>
					</ThemeProvider>
				</LegacyMuiThemeProvider>
			</Provider>
		</I18nContainer>
	</Apm>,
	document.getElementById("root")
);
