import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";
import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, compose, applyMiddleware } from "redux";
import dynostore, { dynamicReducers } from "@redux-dynostore/core";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { HashRouter, Route, Routes, Outlet, Navigate } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppContainer from "./AppContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
import requireAuthentication from "orion-components/Authenticate";
let AuthAppContainer = null;
if (!window.api) {
	const CheckAppContainer = checkAppAccess(AppContainer)("replay-app");
	AuthAppContainer = requireAuthentication(CheckAppContainer);
}
else {
	AuthAppContainer = AppContainer;
}

const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk, optimisticAlerts),
		dynostore(dynamicReducers())
	)
);


window.redux = store;

export const appendReducer = (path, reducer) => {
	store.attachReducers({ [path]: reducer });
};

//components
import NewReplayContainer from "./NewReplay/NewReplayContainer";
import NewMapReplayContainer from "./NewReplay/NewMapReplay/NewMapReplayContainer";
import NewZoneReplayContainer from "./NewReplay/NewZoneReplay/NewZoneReplayContainer";
import NewTrackReplayContainer from "./NewReplay/NewTrackReplay/NewTrackReplayContainer";
import NewEventReplayContainer from "./NewReplay/NewEventReplay/NewEventReplayContainer";
import ReplayContainer from "./Replay/ReplayContainer";

render(
	<Apm serviceName={"replay-app-client"}>
		<I18nContainer store={store} appId="replay-app">
			<Provider store={store}>
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<MuiThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route path="/" element={<AuthAppContainer><Outlet/></AuthAppContainer>}>
										<Route index element={window.api ? <ReplayContainer/> : <NewReplayContainer/>} />
										<Route path="new-replay" element={<NewReplayContainer/>} />
										<Route path="new-map-replay" element={<NewMapReplayContainer/>} />
										<Route path="new-zone-replay" element={<NewZoneReplayContainer/>} />
										<Route path="new-track-replay" element={<NewTrackReplayContainer/>} />
										<Route path="new-event-replay" element={<NewEventReplayContainer/>} />
										<Route path="replay" element={<ReplayContainer/>} />
									</Route>
								</Routes>
							</ErrorBoundary>
							{/* <Redirect from="*" to="/" /> */}
						</HashRouter>
					</MuiThemeProvider>
				</LegacyMuiThemeProvider>
			</Provider>
		</I18nContainer>
	</Apm>,
	document.getElementById("root")
);
