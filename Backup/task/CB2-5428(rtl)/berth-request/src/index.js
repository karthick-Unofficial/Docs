import React from "react";
import { render } from "react-dom";
import "./index.css";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { optimisticAlerts } from "orion-components/Dock";
import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import BerthRequest from "./BerthRequest";
import VesselReport from "./VesselReport";
import Apm from "orion-components/Apm";
import I18n from "orion-components/i18n";

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;

render(
	<Apm serviceName="berth-request-app-client">
		<Provider store={store}>
			<I18n appId="berth-request-app">
				<HashRouter>
					<ErrorBoundary>
						<Routes>
							<Route path="/" element={<BerthRequest />} />
							<Route path="/vessel-report" element={<VesselReport />} />
						</Routes>
					</ErrorBoundary>
				</HashRouter>
			</I18n>
		</Provider>
	</Apm >,
	document.getElementById("root")
);
