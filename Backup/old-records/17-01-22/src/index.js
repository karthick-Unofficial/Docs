require("babel-polyfill");

// React
import React from "react";
import { render } from "react-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Metrics
import metricsMiddleware from "browser-metrics/lib/reduxMetricsMiddleware";

import { Router, Route, IndexRoute, hashHistory } from "react-router";

// Containers
import AppContainer from "./AppContainer";
import MainContainer from "./Main/MainContainer";
import ViewRuleContainer from "./ViewRule/ViewRuleContainer";
import CreateRuleContainer from "./CreateEditRule/CreateRuleContainer";
import TrackMovement from "./CreateEditRule/TrackMovement/TrackMovement";
import SystemHealthContainer from "./CreateEditRule/SystemHealth/SystemHealthContainer.js";
import VesselEventContainer from "./CreateEditRule/VesselEvent/VesselEventContainer.js";
import AlarmContainer from "./CreateEditRule/Alarm/AlarmContainer";
import CreateEventContainer from "./CreateEditRule/CreateEvent/CreateEventContainer";
import AlertGeneratorContainer from "./AlertGenerator/AlertGeneratorContainer";

import "./index.css";

// Redux
import { createStore, applyMiddleware /*, compose */ } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { optimisticAlerts } from "orion-components/Dock";

import rulesApp from "./reducers";

import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import customTheme from "./customTheme";
import theme from "orion-components/theme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
require("viewport-units-buggyfill").init();

// const injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("rules-app");

import requireAuthentication from "orion-components/Authenticate";
const CheckAppAuthContainer = requireAuthentication(CheckAppContainer);

// debounce for search update
import createDebounce from "redux-debounced";

import Apm from "orion-components/Apm"; 
import I18nContainer from "orion-components/i18n/I18nContainer";

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
		<I18nContainer store={store} appId="rules-app"/>
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
				<MuiThemeProvider theme={createMuiTheme(theme)}>
					<Router history={hashHistory}>
						<Route path="/" component={CheckAppAuthContainer}>
							<IndexRoute component={MainContainer} />
							<Route
								component={location => (
									<CreateRuleContainer location={location} editMode={false} />
								)}
							>
								<Route
									path="/create/track-movement"
									component={TrackMovement}
								/>
								<Route
									path="/create/system-health"
									component={SystemHealthContainer}
								/>
								<Route
									path="/create/vessel-event"
									component={VesselEventContainer}
								/>
								<Route
									path="/create/alarm"
									component={AlarmContainer}
								/>
								<Route
									path="/create/create-event"
									component={CreateEventContainer}
								/>
							</Route>
							<Route
								path="/edit/:id"
								component={props => (
									<CreateRuleContainer {...props} editMode={true} />
								)}
							/>
							<Route path="/rule/:id" component={ViewRuleContainer} />
							<Route path="/alert-generator" component={AlertGeneratorContainer} />
						</Route>
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
