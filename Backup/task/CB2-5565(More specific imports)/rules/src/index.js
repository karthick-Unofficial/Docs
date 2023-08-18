// React
import React from "react";
import { render } from "react-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Metrics
import metricsMiddleware from "browser-metrics/lib/reduxMetricsMiddleware";

import { HashRouter, Route, Routes, Outlet } from "react-router-dom";

import HookWrapper from "./HookWrapper";

// Containers
import App from "./App";
import Main from "./Main/Main";
import ViewRule from "./ViewRule/ViewRule";
import CreateEditRule from "./CreateEditRule/CreateEditRule";
import TrackMovement from "./CreateEditRule/TrackMovement/TrackMovement";
import SystemHealth from "./CreateEditRule/SystemHealth/SystemHealth";
import VesselEvent from "./CreateEditRule/VesselEvent/VesselEvent";
import Alarm from "./CreateEditRule/Alarm/Alarm";
import CreateEvent from "./CreateEditRule/CreateEvent/CreateEvent";
import AlertGenerator from "./AlertGenerator/AlertGenerator";

import "./index.css";

// Redux
import { createStore, applyMiddleware /*, compose */ } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { optimisticAlerts } from "orion-components/Dock";

import rulesApp from "./reducers";


import customTheme from "./customTheme";
import theme from "orion-components/theme";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";

// const injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

import checkAppAccess from "orion-components/CheckAppAccess";

import requireAuthentication from "orion-components/Authenticate";

// debounce for search update
import createDebounce from "redux-debounced";

import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";

require("babel-polyfill");
require("viewport-units-buggyfill").init();
const CheckAppContainer = checkAppAccess(App)("rules-app");
const CheckAppAuthContainer = requireAuthentication(CheckAppContainer);

const store = createStore(
	rulesApp,
	composeWithDevTools(
		applyMiddleware(
			createDebounce(),
			thunkMiddleware,
			optimisticAlerts,
			metricsMiddleware({
				trackTiming: (category, name, duration) => {
					// Display metric in a table for legibility
					// Uncomment to log in console
					// console.table([{['name']: name, ['duration']: duration}])
				},
				minDuration: 0
			})
		)
	)
);

window.redux = store;

render(
	<Apm serviceName="rules-app-client">
		<Provider store={store}>
			<I18n appId="rules-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(customTheme)}>
						<ThemeProvider theme={createTheme(theme)}>
							<HashRouter>
								<Routes>
									<Route path="/" element={<CheckAppAuthContainer><Outlet /></CheckAppAuthContainer>}>
										<Route index element={<HookWrapper><Main /></HookWrapper>} />
										<Route path="/create/track-movement" element={<HookWrapper><CreateEditRule><TrackMovement /></CreateEditRule></HookWrapper>} />
										<Route path="/create/system-health" element={<HookWrapper><CreateEditRule><SystemHealth /></CreateEditRule></HookWrapper>} />
										<Route path="/create/vessel-event" element={<HookWrapper><CreateEditRule><VesselEvent /></CreateEditRule></HookWrapper>} />
										<Route path="/create/alarm" element={<HookWrapper><CreateEditRule><Alarm /></CreateEditRule></HookWrapper>} />
										<Route path="/create/create-event" element={<HookWrapper><CreateEditRule><CreateEvent /></CreateEditRule></HookWrapper>} />
										<Route path="/edit/:id" element={<HookWrapper><CreateEditRule editMode={true} /></HookWrapper>} />
										<Route path="/rule/:id" element={<HookWrapper><ViewRule /></HookWrapper>} />
										<Route path="/alert-generator" element={<AlertGenerator />} />
									</Route>
								</Routes>
							</HashRouter>
						</ThemeProvider>
					</ThemeProvider>
				</StyledEngineProvider>
			</I18n>
		</Provider>
	</Apm >,
	document.getElementById("root")
);
