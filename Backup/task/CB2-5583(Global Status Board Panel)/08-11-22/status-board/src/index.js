import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";

import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";
import theme from "orion-components/theme";
import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import App from "./App";
import checkAppAccess from "orion-components/CheckAppAccess";
const CheckAppContainer = checkAppAccess(App)("status-board-app");
import requireAuthentication from "orion-components/Authenticate";
const AuthAppContainer = requireAuthentication(CheckAppContainer);
import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;

render(
	<Apm serviceName="status-board-app-client">
		<Provider store={store}>
			<I18n appId="status-board-app">
				
					<StyledEngineProvider injectFirst>
                        <ThemeProvider theme={createTheme(theme)}>
                            <HashRouter>
                                <ErrorBoundary>
                                    <Routes>
                                        <Route index path="/" element={<AuthAppContainer />} />
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
