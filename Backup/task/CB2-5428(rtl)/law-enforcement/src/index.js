import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import theme from "orion-components/theme";
import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import App from "./App";
import I18n from "orion-components/i18n";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(App)(
	"law-enforcement-search-app"
);
import requireAuthentication from "orion-components/Authenticate";
import Apm from "orion-components/Apm";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
const AuthAppContainer = requireAuthentication(CheckAppContainer);
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;

render(
	<Apm serviceName="law-enforcement-search-app-client">
		<Provider store={store}>
			<I18n appId="law-enforcement-search-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route path="/" element={<AuthAppContainer />} />
								</Routes>
							</ErrorBoundary>
							{/* <Redirect from="*" to="/" /> */}
						</HashRouter>
					</ThemeProvider>
				</StyledEngineProvider>
			</I18n>
		</Provider>
	</Apm>,
	document.getElementById("root")
);
