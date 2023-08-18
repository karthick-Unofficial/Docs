import React, { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
	getAppState,
	getGlobalAppState,
	subscribeFeed,
	hydrateUser,
	subscribeAppFeedPermissions,
	subscribeCollections,
	toggleMapVisible,
	getEventTypes,
	setWidgetLaunchData
} from "./appActions.js";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";

// Components
import CamerasAppBar from "./AppBar/CamerasAppBar";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import CamerasListPanel from "./CamerasListPanel/CamerasListPanel";
import CameraView from "./CameraView/CameraView";
import { ToastContainer } from "react-toastify";
import { feedService } from "client-app-core";
import { appendReducer } from "./index.js";
import {
	collections,
	dataByFeed,
	notifications,
	events,
	listLookupData
} from "orion-components/GlobalData/Reducers";
import "react-toastify/dist/ReactToastify.css";
import { WavCam } from "orion-components/Dock";
import * as cameraViewActions from "./CameraView/cameraViewActions";

const App = ({
	params
}) => {

	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [serviceReady, setServiceReady] = useState(false);

	const identity = useSelector((state) => state.session.identity);
	const isHydrated = useSelector((state) => state.session.user.isHydrated);
	const orgId = useSelector((state) => state.session.user.profile.orgId);
	const servicesReady = useSelector((state) => state.servicesReady);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);

	useEffect(() => {
		const { entityId, widget } = params || {};
		const feeds = [
			{
				notifications: notifications
			},
			{
				events: events
			},
			{
				collections: collections
			},
			{
				listLookupData: listLookupData
			}
		];
		feeds.forEach(feed => {
			appendReducer("globalData." + Object.keys(feed)[0], Object.values(feed)[0]);
		});
		Promise.all([
			dispatch(getAppState("cameras-app")),
			dispatch(getGlobalAppState()),
			dispatch(hydrateUser(identity.userId)),
			dispatch(subscribeAppFeedPermissions(identity.userId, "cameras-app"))
		]).then(() => {
			const { userId } = identity;
			feedService.getUserAppIntegration(userId, "cameras-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach(feed => {
						if (feed.entityType === "camera" || "accessPoint" && feed.config.canView) {
							const geoName = "globalGeo." + feed.intId;
							const dataName = "globalData." + feed.intId;
							const geoReducer = dataByFeed(feed.intId, "globalGeo");
							const dataReducer = dataByFeed(feed.intId, "globalData");
							appendReducer(geoName, geoReducer);
							appendReducer(dataName, dataReducer);
							dispatch(subscribeFeed(feed.intId));
						}
					});
				}
			});
			// this.props.subscribeFeed("cameras");
			dispatch(subscribeCollections());
			dispatch(toggleMapVisible());
			dispatch(getEventTypes());
		});

		if (entityId && widget) {
			// -- store entityId and widget in local state
			const data = { entityId, widget };
			dispatch(setWidgetLaunchData(data));

			// -- remove params from URL
			navigate("/");
		}
	}, [identity, subscribeFeed]);

	return isHydrated ? (
		<div className="app-wrapper">
			<Services>
				<BaseMapservice />
			</Services>
			<ErrorBoundary>
				<CamerasAppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}` }} className="content-wrapper">
				<ErrorBoundary>
					<CamerasListPanel />
				</ErrorBoundary>
				{servicesReady && (
					<ErrorBoundary>
						<CameraView  {...cameraViewActions} />
					</ErrorBoundary>
				)}
			</div>
			<ToastContainer hideProgressBar={true} limit={1} />
		</div>
	) : (
		<div className="app-wrapper" />
	);
};

export default memo(App);