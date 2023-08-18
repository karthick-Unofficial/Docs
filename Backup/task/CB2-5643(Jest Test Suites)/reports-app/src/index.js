import React from "react";
import { render } from "react-dom";
import "./index.css";

// Redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

import { optimisticAlerts } from "orion-components/Dock";

// Material UI
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import theme from "orion-components/theme";
import I18n from "orion-components/i18n";
// Router
import { HashRouter, Route, Routes, Outlet } from "react-router-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// components
import App from "./App";
import NotFound from "./components/NotFound";
import Reports from "./Reports/Reports";
import ReportBuilder from "./ReportBuilder/ReportBuilder";
import DownloadReport from "./components/DownloadReport";

// access to app
import checkAppAccess from "orion-components/CheckAppAccess";

// authentication
import requireAuthentication from "orion-components/Authenticate";

import Apm from "orion-components/Apm";
const CheckAppContainer = checkAppAccess(App)("reports-app");
const AuthAppContainer = requireAuthentication(CheckAppContainer);

// Create Store
const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;

render(
	<Apm serviceName="reports-app-client">
		<Provider store={store}>
			<I18n appId="reports-app">
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={createTheme(theme)}>
						<HashRouter>
							<ErrorBoundary>
								<Routes>
									<Route path="/" element={<AuthAppContainer><Outlet /></AuthAppContainer>}>
										<Route index element={<Reports />} />
										<Route path="reports" element={<Reports />} />
										<Route path="not-found" element={<NotFound />} />
										<Route
											path="report-builder/:id"
											element={<ReportBuilder />}
										/>
										<Route
											path="download/:fileType/:handle"
											element={<DownloadReport />}
										/>
									</Route>
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
