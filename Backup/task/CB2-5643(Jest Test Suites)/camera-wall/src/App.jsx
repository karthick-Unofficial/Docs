import React, { Fragment, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";
import AppBar from "orion-components/AppBar/AppBar";
import ListPanel from "./ListPanel/ListPanel";
import CameraWall from "./CameraWall/CameraWall";
import { WavCam } from "orion-components/Dock";
import { feedService } from "client-app-core";
import { appendReducer } from "./index.js";
import { dataByFeed, notifications } from "orion-components/GlobalData/Reducers";
import cameraGroups from "./reducers/cameraGroups";

import { useDispatch, useSelector } from "react-redux";

import {
	hydrateUser,
	subscribeFeed,
	subscribeFeedPermissions,
	getAppState,
	getGlobalAppState,
	subscribeCameraGroups,
	updateWidgetLaunchData
} from "./appActions";
import { getTranslation } from "orion-components/i18n/Actions";

const propTypes = {
	params: PropTypes.object
};

const App = ({ params }) => {
	const identity = useSelector((state) => state.session.identity);
	const isHydrated = useSelector((state) => state.session.user.isHydrated);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	useEffect(() => {
		// -- only runs on first render
		const { entityId, entityName, entityType, type } = params || {};

		if (entityId && entityName && entityType && type) {
			// -- store entityId in local state
			const data = { entityId, entityName, entityType, type };
			dispatch(updateWidgetLaunchData(data));

			// -- remove params from URL
			navigate("/");
		}
	}, [dispatch, navigate, params]);

	useEffect(() => {
		const { userId } = identity;

		Promise.all([
			dispatch(hydrateUser(userId)),
			dispatch(subscribeFeedPermissions(userId)),
			dispatch(getGlobalAppState()),
			dispatch(getAppState("camera-wall-app")),
			dispatch(subscribeCameraGroups())
		]);
	}, [dispatch, identity]);

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
					res.forEach((feed) => {
						if (feed.entityType === "camera" && feed.config.canView) {
							const dataName = "globalData." + feed.intId;
							const dataReducer = dataByFeed(feed.intId, "globalData");
							appendReducer(dataName, dataReducer);
							dispatch(subscribeFeed(feed.intId));
						}
					});
				}
			});
		}
		setupGlobalData();
	}, [dispatch, identity]);

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
				<AppBar titleText={getTranslation("appBar.title")} />
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

export default memo(App);
