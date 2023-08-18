import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import { default as LegacyMuiThemeProvider } from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import theme from "orion-components/theme";
import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import dynostore, {
	dynamicReducers
} from "@redux-dynostore/core";
import AppContainer from "./AppContainer";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(AppContainer)("facilities-app");
import requireAuthentication from "orion-components/Authenticate";
import Apm from "orion-components/Apm";
import I18nContainer from "orion-components/i18n/I18nContainer";

const AuthAppContainer = requireAuthentication(CheckAppContainer);

const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk, optimisticAlerts),
		dynostore(dynamicReducers())
	)
);


export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};

window.redux = store;

render(
	<Apm serviceName="facilities-app-client">
		<I18nContainer store={store} appId="facilities-app">
			<Provider store={store}>
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<MuiThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthAppContainer/>} />
									<Route path="/entity/:entityId" element={<AuthAppContainer/>} />
								</Routes>
							</ErrorBoundary>
						</HashRouter>
					</MuiThemeProvider>
				</LegacyMuiThemeProvider>
			</Provider>
		</I18nContainer>
	</Apm>,
	document.getElementById("root")
);
