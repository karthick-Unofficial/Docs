import React, { PureComponent, useEffect, useState } from "react";
import { hashHistory } from "react-router";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";

// Components
import AppBarContainer from "./AppBar/AppBarContainer";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import CamerasListPanelContainer from "./CamerasListPanel/CamerasListPanelContainer";
import CameraViewContainer from "./CameraView/CameraViewContainer";
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


const App = ({
	identity,
	params,
	getAppState,
	getGlobalAppState,
	hydrateUser,
	subscribeAppFeedPermissions,
	subscribeFeed,
	subscribeCollections,
	toggleMapVisible,
	getEventTypes,
	setWidgetLaunchData,
	location,
	isHydrated,
	servicesReady,
	WavCamOpen
}) => {

	const [serviceReady, setServiceReady] = useState(false);

	useEffect(() => {
		const { entityId, widget } = params;
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
			getAppState("cameras-app"),
			getGlobalAppState(),
			hydrateUser(identity.userId),
			subscribeAppFeedPermissions(identity.userId, "cameras-app")
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
							subscribeFeed(feed.intId);
						}
					});
				}
			});
			subscribeCollections();
			toggleMapVisible();
			getEventTypes();
		});

		if (entityId && widget) {
			// -- store entityId and widget in local state
			const data = { entityId, widget };
			setWidgetLaunchData(data);

			// -- remove params from URL
			hashHistory.push({
				pathname: "/"
			});
		}
	}, []);

	return isHydrated ? (
		<div className="app-wrapper">
			<Services>
				<BaseMapservice setReady={() => setServiceReady(true)} />
			</Services>
			<ErrorBoundary>
				<AppBarContainer location={location} />
			</ErrorBoundary>
			<WavCam />
			<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"}` }} className="content-wrapper">
				<ErrorBoundary>
					<CamerasListPanelContainer />
				</ErrorBoundary>
				{servicesReady && (
					<ErrorBoundary>
						<CameraViewContainer />
					</ErrorBoundary>
				)}
			</div>
			<ToastContainer hideProgressBar={true} />
		</div>
	) : (
		<div className="app-wrapper" />
	);
};

export default App;
