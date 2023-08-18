import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import App from "./App";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(App)("berth-schedule-app");
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;

import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";

render(
	<Apm serviceName="berth-schedule-app-client">
		<I18nContainer store={store} appId="berth-schedule-app">
			<Provider store={store}>
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<MuiThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route path="/" element={<AuthAppContainer/>} />
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
