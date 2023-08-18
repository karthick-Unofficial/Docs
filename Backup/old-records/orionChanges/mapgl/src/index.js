import React from "react";
import { render } from "react-dom";
import theme from "orion-components/theme";

// import { Profiler } from "orion-components/CBComponents";
// if (process.env.NODE_ENV !== "production") {
// 	const { whyDidYouUpdate } = require("why-did-you-update");
// 	whyDidYouUpdate(React);
// }

// Components and Containers
import AppContainer from "./AppContainer";
import SpotlightWindow from "./Spotlight/SpotlightWindow/SpotlightWindow";

// Access to app
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("map-app");

// Auth
import requireAuthentication from "orion-components/Authenticate";
const CheckAppAuthContainer = requireAuthentication(CheckAppContainer);
import ErrorBoundary from "orion-components/ErrorBoundary";

// CSS
import "./index.css";

// Redux
import { createStore, applyMiddleware /*, compose */ } from "redux";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
import phoenixApp from "./reducers";
import { Provider } from "react-redux";

// Routing
import { 
	Router, 
	Route, 
	Redirect,
	hashHistory 
} from "react-router";

// Redux middleware
import thunkMiddleware from "redux-thunk";
import { optimisticAlerts } from "orion-components/Dock";
// import { logger } from "./middleware";

// Debounce for search update
import createDebounce from "redux-debounce";
const config = { search: 150 };
const debouncer = createDebounce(config);

// Material-ui
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import Apm from "orion-components/Apm"; 
import I18nContainer from "orion-components/i18n/I18nContainer";

require("viewport-units-buggyfill").init();

// const injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();

const store = createStore(
	phoenixApp,
	applyMiddleware(
		thunkMiddleware,
		debouncer,
		optimisticAlerts
		// logger
	),
	dynostore(dynamicReducers())
);

window.redux = store;
store.subscribe(()=>{console.log("store", store.getState());});

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};

render(
	<Apm serviceName="map-app-client">
		<I18nContainer store={store} appId="mapgl-app"/>
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<ThemeProvider theme={createMuiTheme(theme)}>
					{/* New Routing Begin */}
					<Router history={hashHistory}>

						<Route path="/" component={CheckAppAuthContainer} />
						<Route path="/spotlight" component={SpotlightWindow} />
					
						<Redirect from="*" to="/"/>

					
					</Router>
					{/* New Routing End */}

					{/* Old Stuff Begin */}
					{/* <ErrorBoundary>
						<CheckAppAuthContainer />
					</ErrorBoundary> */}
					{/* Old Stuff End */}
				</ThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
