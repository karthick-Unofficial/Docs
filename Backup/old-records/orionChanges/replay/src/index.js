import Apm from "orion-components/Apm"; 

import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, applyMiddleware } from "redux";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { Router, Route, Redirect, hashHistory, IndexRedirect } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppContainer from "./AppContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
import requireAuthentication from "orion-components/Authenticate";
let AuthAppContainer = null;
if(!window.api) {
	const CheckAppContainer = checkAppAccess(AppContainer)("replay-app");
	AuthAppContainer = requireAuthentication(CheckAppContainer);
}
else {
	AuthAppContainer = AppContainer;
}
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts)),
	dynostore(dynamicReducers())
);

window.redux = store;

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};
export const history = syncHistoryWithStore(hashHistory, store);

//components
import NewReplayContainer from "./NewReplay/NewReplayContainer";
import NewMapReplayContainer from "./NewReplay/NewMapReplay/NewMapReplayContainer";
import NewZoneReplayContainer from "./NewReplay/NewZoneReplay/NewZoneReplayContainer";
import NewTrackReplayContainer from "./NewReplay/NewTrackReplay/NewTrackReplayContainer";
import NewEventReplayContainer from "./NewReplay/NewEventReplay/NewEventReplayContainer";
import ReplayContainer from "./Replay/ReplayContianer";

render(
	<Apm serviceName={"replay-app-client"}>
		<Provider store={store}>
			<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
				<MuiThemeProvider theme={createMuiTheme(theme)}>
					<Router history={history}>
						<ErrorBoundary>
							<Route path="/" component={AuthAppContainer}>
								<IndexRedirect to={window.api ? "/replay" : "new-replay"} />
								<Route path={"new-replay"} component={NewReplayContainer} />
								<Route path={"new-map-replay"} component={NewMapReplayContainer} />
								<Route path={"new-zone-replay"} component={NewZoneReplayContainer} />
								<Route path={"new-track-replay"} component={NewTrackReplayContainer} />
								<Route path={"new-event-replay"} component={NewEventReplayContainer} />
								<Route path={"/replay"} component={ReplayContainer} />
							</Route>
						
						</ErrorBoundary>
						<Redirect from="*" to="/" />
					</Router>
				</MuiThemeProvider>
			</LegacyMuiThemeProvider>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
