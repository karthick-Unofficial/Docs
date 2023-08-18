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
import App from "./App";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(App)("facilities-app");
import requireAuthentication from "orion-components/Authenticate";
import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";

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
store.subscribe(() => console.log("#store", store.getState()));
render(
	<Apm serviceName="facilities-app-client">
		<Provider store={store}>
			<I18n appId="facilities-app">
				<LegacyMuiThemeProvider muiTheme={getMuiTheme(theme)}>
					<MuiThemeProvider theme={createMuiTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthAppContainer />} />
									<Route path="/entity/:entityId" element={<AuthAppContainer />} />
								</Routes>
							</ErrorBoundary>
						</HashRouter>
					</MuiThemeProvider>
				</LegacyMuiThemeProvider>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
