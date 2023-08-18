import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Services } from "orion-components/Services";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsService";

// if (process.env.NODE_ENV !== "production") {
// 	const {whyDidYouUpdate} = require("why-did-you-update");
// 	whyDidYouUpdate(React);
// }

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Components
import EventsAppBar from "./EventsAppBar/EventsAppBar";
import EventsListPanel from "./EventsListPanel/EventsListPanel";
import EventView from "./EventView/EventView";
import ShapePanel from "./ShapePanel/ShapePanel";
import { WavCam } from "orion-components/Dock";
import { useSelector, useDispatch } from "react-redux";

import { getAppState } from "orion-components/AppState/Actions";


import {
	getMapAppState, hydrateUser, toggleMapVisible, getGlobalAppState,
	subscribeAppFeedPermissions, subscribeFloorPlansWithFacilityFeedId, getEventTypes, updateWidgetLaunchData
} from "./appActions";
import {
	subscribeCameras,
	getAllEvents,
	getAllTemplates,
	subscribeCollections
} from "orion-components/GlobalData/Actions";


const App = (props) => {

	const identity = useSelector(state => state.session.identity);
	const isHydrated = useSelector(state => state.session.user.isHydrated);
	const orgId = useSelector(state => state.session.user.profile.orgId);
	const servicesReady = useSelector(state => state.servicesReady);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	const dispatch = useDispatch();

	const navigate = useNavigate();
	const location = useLocation();

	const [serviceReady, setServiceReady] = useState(false);

	useEffect(() => {
		const { params } = props;
		const { entityId, widget } = params || {};

		Promise.all([
			dispatch(getAppState("events-app")),
			dispatch(getGlobalAppState()),
			dispatch(getMapAppState()),
			dispatch(hydrateUser(identity.userId)),
			dispatch(subscribeAppFeedPermissions(identity.userId, "events-app")),
			dispatch(subscribeFloorPlansWithFacilityFeedId())
		]).then(() => {
			// New Orion-Components actions
			dispatch(subscribeCameras());
			dispatch(getAllEvents());
			dispatch(getAllTemplates());
			dispatch(subscribeCollections());
			dispatch(getEventTypes());
			dispatch(toggleMapVisible());
		});

		if (entityId && widget) {
			// -- store entityId and widget in local state
			const data = { entityId, widget };
			dispatch(updateWidgetLaunchData(data));

			// -- remove params from URL
			navigate("/");
		}
	}, []);



	return isHydrated ? (
		<div className="app-wrapper">
			<Services>
				<BaseMapservice setReady={() => setServiceReady(true)} />
			</Services>
			<ErrorBoundary>
				<EventsAppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className="content-wrapper">
				<ErrorBoundary>
					<EventsListPanel />
				</ErrorBoundary>

				<ErrorBoundary>
					<ShapePanel />
				</ErrorBoundary>

				{servicesReady && (
					<ErrorBoundary>
						<EventView />
					</ErrorBoundary>
				)}
			</div>
		</div >
	) : (
		<div className="app-wrapper" />
	);
};

export default App;