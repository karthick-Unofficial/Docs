import React, { useEffect, memo } from "react";
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
import BaseMapService from "orion-components/Services/BaseMapService/BaseMapsService";
import CamerasListPanel from "./CamerasListPanel/CamerasListPanel";
import CameraView from "./CameraView/CameraView";
import { ToastContainer } from "react-toastify"; // cSpell:ignore toastify
import { feedService } from "client-app-core";
import { appendReducer } from "./index.js";
import { collections, dataByFeed, notifications, events, listLookupData } from "orion-components/GlobalData/Reducers";
import "react-toastify/dist/ReactToastify.css";
import { WavCam } from "orion-components/Dock";
import * as cameraViewActions from "./CameraView/cameraViewActions";
import { useParams } from "react-router-dom";

const App = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { entityId, widget } = useParams() || {};

	const identity = useSelector((state) => state.session.identity);
	const isHydrated = useSelector((state) => state.session.user.isHydrated);
	const servicesReady = useSelector((state) => state.servicesReady);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);

	useEffect(() => {
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
		feeds.forEach((feed) => {
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
					res.forEach((feed) => {
						if (feed.entityType === "camera" || ("accessPoint" && feed.config.canView)) {
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
	}, [dispatch, identity, navigate]);

	return isHydrated ? (
		<div className="app-wrapper">
			<Services>
				<BaseMapService setReady={true} />
			</Services>
			<ErrorBoundary>
				<CamerasAppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div
				style={{
					height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}`
				}}
				className="content-wrapper"
			>
				<ErrorBoundary>
					<CamerasListPanel />
				</ErrorBoundary>
				{servicesReady && (
					<ErrorBoundary>
						<CameraView {...cameraViewActions} />
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
