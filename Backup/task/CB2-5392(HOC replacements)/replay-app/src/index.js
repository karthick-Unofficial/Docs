import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";
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
import App from "./App";
import checkAppAccess from "orion-components/CheckAppAccess";
import requireAuthentication from "orion-components/Authenticate";
let AuthAppContainer = null;
if (!window.api) {
	const CheckAppContainer = checkAppAccess(App)("replay-app");
	AuthAppContainer = requireAuthentication(CheckAppContainer);
}
else {
	AuthAppContainer = App;
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
import NewReplay from "./NewReplay/NewReplay";
import NewMapReplay from "./NewReplay/NewMapReplay/NewMapReplay";
import NewZoneReplay from "./NewReplay/NewZoneReplay/NewZoneReplay";
import NewTrackReplay from "./NewReplay/NewTrackReplay/NewTrackReplay";
import NewEventReplay from "./NewReplay/NewEventReplay/NewEventReplay";
import Replay from "./Replay/Replay";

render(
	<Apm serviceName={"replay-app-client"}>
		<Provider store={store}>
			<I18n appId="replay-app">
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<MuiThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route path="/" element={<AuthAppContainer><Outlet /></AuthAppContainer>}>
										<Route index element={window.api ? <Replay /> : <NewReplay />} />
										<Route path="new-replay" element={<NewReplay />} />
										<Route path="new-map-replay" element={<NewMapReplay />} />
										<Route path="new-zone-replay" element={<NewZoneReplay />} />
										<Route path="new-track-replay" element={<NewTrackReplay />} />
										<Route path="new-event-replay" element={<NewEventReplay />} />
										<Route path="replay" element={<Replay />} />
									</Route>
								</Routes>
							</ErrorBoundary>
							{/* <Redirect from="*" to="/" /> */}
						</HashRouter>
					</MuiThemeProvider>
				</LegacyMuiThemeProvider>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
