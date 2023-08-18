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
import I18nContainer from "orion-components/i18n/I18nContainer";

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk, optimisticAlerts))
);

window.redux = store;
store.subscribe(() => console.log("#store", store.getState()));
render(
	<Apm serviceName="berth-request-app-client">
		<I18nContainer store={store} appId="berth-request-app">
			<Provider store={store}>
				<HashRouter>
					<ErrorBoundary>
						<Routes>
							<Route path="/" element={<BerthRequest/>} />
							<Route path="/vessel-report" element={<VesselReport/>} />
						</Routes>
					</ErrorBoundary>
				</HashRouter>
			</Provider>
		</I18nContainer>
	</Apm>,
	document.getElementById("root")
);
