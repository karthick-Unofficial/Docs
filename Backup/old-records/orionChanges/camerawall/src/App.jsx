import React, { Fragment, useEffect, memo } from "react";
import { hashHistory } from "react-router";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";
import { default as AppBar } from "./AppBar/AppBarContainer";
import { default as ListPanel } from "./ListPanel/ListPanelContainer";
import { default as CameraWall } from "./CameraWall/CameraWallContainer";
import { WavCam } from "orion-components/Dock";
import { feedService } from "client-app-core";
import { appendReducer } from "./index.js";
import { dataByFeed, notifications } from "orion-components/GlobalData/Reducers";
import cameraGroups from "./reducers/cameraGroups";

const propTypes = {
	getAppState: PropTypes.func.isRequired,
	getGlobalAppState: PropTypes.func.isRequired,
	getPersistedCameras: PropTypes.func.isRequired,
	hydrateUser: PropTypes.func.isRequired,
	identity: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		userId: PropTypes.string.isRequired
	}),
	isHydrated: PropTypes.bool.isRequired,
	location: PropTypes.object,
	subscribeCameraGroups: PropTypes.func.isRequired,
	subscribeFeed: PropTypes.func.isRequired,
	subscribeFeedPermissions: PropTypes.func.isRequired,
	updateWidgetLaunchData: PropTypes.func.isRequired,
	params: PropTypes.object,
	WavCamOpen: PropTypes.bool
};

const defaultProps = {
	location: null
};

const App = ({
	getAppState,
	getGlobalAppState,
	getPersistedCameras,
	hydrateUser,
	identity,
	isHydrated,
	location,
	subscribeCameraGroups,
	subscribeFeed,
	subscribeFeedPermissions,
	updateWidgetLaunchData,
	params, 
	WavCamOpen
}) => {
	useEffect(() => {
		// -- only runs on first render
		const { entityId, entityName, entityType, type } = params;

		if (entityId && entityName && entityType && type) {
			// -- store entityId in local state
			const data = { entityId, entityName, entityType, type };
			updateWidgetLaunchData(data);
	
			// -- remove params from URL
			hashHistory.push({
				pathname:"/"
			});
		}
	}, [params, updateWidgetLaunchData]);

	useEffect(() => {
		const { userId } = identity;

		Promise.all([
			hydrateUser(userId),
			subscribeFeedPermissions(userId),
			getGlobalAppState(),
			getAppState("camera-wall-app"),
			subscribeCameraGroups()
		]);
	}, [
		getAppState,
		getGlobalAppState,
		getPersistedCameras,
		hydrateUser,
		identity,
		subscribeCameraGroups,
		subscribeFeedPermissions
	]);

	useEffect(() => {
		const { userId } = identity;
		async function setupGlobalData() {
			appendReducer("globalData.cameraGroups", cameraGroups);
			appendReducer("globalData.notifications", notifications);
			await feedService.getUserAppIntegration(userId, "cameras-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach(feed => {
						if (feed.entityType === "camera" && feed.config.canView) {
							const dataName = "globalData." + feed.intId;
							const dataReducer = dataByFeed(feed.intId, "globalData");
							appendReducer(dataName, dataReducer);
							subscribeFeed(feed.intId);
						}
					});
				}
			});
		}
		setupGlobalData();
	}, [identity, subscribeFeed]);

	const styles = {
		wrapper: {
			position: "relative",
			width: "100%",
			display: "block",
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		}
	};
	return isHydrated ? (
		<div style={{ overflow: "hidden" }}>
			<Services />
			<ErrorBoundary>
				<AppBar location={location} />
			</ErrorBoundary>
			<WavCam />
			<div style={styles.wrapper}>
				<ListPanel />
				<CameraWall />
			</div>
		</div>
	) : (
		<Fragment />
	);
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default memo(App);
