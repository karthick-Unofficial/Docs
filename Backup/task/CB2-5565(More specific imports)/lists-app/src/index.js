import React from "react";
import { render } from "react-dom";
import "./index.css";

// Redux
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import dynostore, {
	dynamicReducers
} from "@redux-dynostore/core";
import { optimisticAlerts } from "orion-components/Dock";

// Material UI
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import theme from "orion-components/theme";

// Router
import { HashRouter, Route, Routes } from "react-router-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// components
import App from "./App";


// access to app
import checkAppAccess from "orion-components/CheckAppAccess";

// authentication
import requireAuthentication from "orion-components/Authenticate";

import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";
const CheckAppContainer = checkAppAccess(App)("lists-app");
const AuthAppContainer = requireAuthentication(CheckAppContainer);


// Create Store
const store = createStore(
	rootReducer,
	compose(
		applyMiddleware(thunk, optimisticAlerts),
		dynostore(dynamicReducers())
	)
);

window.redux = store;

export const appendReducer = (path, reducer) => {
	store.attachReducers({
		[path]: reducer
	});
};
render(
	<Apm serviceName="lists-app-client">
		<Provider store={store}>
			<I18n appId="lists-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route index path="/" element={<AuthAppContainer />} />
								</Routes>
							</ErrorBoundary>
						</HashRouter>
					</ThemeProvider>
				</StyledEngineProvider>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
