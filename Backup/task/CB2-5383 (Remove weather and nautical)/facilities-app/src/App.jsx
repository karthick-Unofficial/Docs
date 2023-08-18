import React, { Fragment, useEffect, memo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBarContainer from "./AppBar/AppBarContainer";
import { Services } from "orion-components/Services";
import FacilityMapContainer from "./FacilityMap/FacilityMapContainer";
import SettingsMenuContainer from "./SettingsMenu/SettingsMenuContainer";
import ListPanelContainer from "./ListPanel/ListPanelContainer";
import DrawingPanelContainer from "./DrawingPanel/DrawingPanelContainer";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import { appendReducer } from "./index.js";
import { dataByFeed, notifications, floorPlan } from "orion-components/GlobalData/Reducers";
import floorPlans from "./reducers/floorPlans";
import { feedService } from "client-app-core";
import { WavCam } from "orion-components/Dock";

const propTypes = {
	getGlobalAppState: PropTypes.func.isRequired,
	hydrateUser: PropTypes.func.isRequired,
	identity: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		userId: PropTypes.string.isRequired
	}),
	isHydrated: PropTypes.bool.isRequired,
	orgId: PropTypes.string,
	subscribeAppFeedPermissions: PropTypes.func.isRequired,
	getAppState: PropTypes.func.isRequired,
	servicesReady: PropTypes.bool.isRequired,
	subscribeFeed: PropTypes.func.isRequired,
	setWidgetLaunchData: PropTypes.func.isRequired,
	WavCamOpen: PropTypes.bool,
	subscribeFloorPlansWithFacilityFeedId: PropTypes.func.isRequired
};

const App = ({
	getGlobalAppState,
	hydrateUser,
	identity,
	isHydrated,
	subscribeAppFeedPermissions,
	getAppState,
	subscribeFeed,
	servicesReady,
	orgId,
	setWidgetLaunchData,
	WavCamOpen,
	subscribeFloorPlansWithFacilityFeedId
}) => {
	
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	useEffect(() => {
		// -- only runs on first render
		const { entityId } = params;

		if (entityId) {
			// -- store entityId and widget in local state
			const data = { entityId };
			setWidgetLaunchData(data);

			// -- remove params from URL
			navigate("/");
		}
	}, [params, setWidgetLaunchData]);

	useEffect(() => {
		const { userId } = identity;
		const notificationsObject = { notifications: notifications };
		const floorPlansObject = { floorPlans: floorPlans };
		const floorPlanFacilityFeedObject = { floorPlanWithFacilityFeedId: floorPlan };
		appendReducer("globalData." + Object.keys(notificationsObject)[0], Object.values(notificationsObject)[0]);
		appendReducer("globalData." + Object.keys(floorPlansObject)[0], Object.values(floorPlansObject)[0]);
		appendReducer("globalData." + Object.keys(floorPlanFacilityFeedObject)[0], Object.values(floorPlanFacilityFeedObject)[0]);
		subscribeAppFeedPermissions(userId, "facilities-app");
		subscribeFloorPlansWithFacilityFeedId();
		getGlobalAppState();
		getAppState("facilities-app");
		hydrateUser(userId);
	}, [getAppState, getGlobalAppState, hydrateUser, identity, orgId, subscribeAppFeedPermissions]);

	useEffect(() => {
		const { userId } = identity;
		async function getInts() {
			await feedService.getUserAppIntegration(userId, "facilities-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach(feed => {
						if (feed.entityType === "facility" && feed.config.canView) {
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
		}
		getInts();
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
			<Services >
				<BaseMapservice />
			</Services>
			<ErrorBoundary>
				<AppBarContainer location={location} />
			</ErrorBoundary>
			<WavCam />
			<SettingsMenuContainer />
			<div style={styles.wrapper}>
				<ListPanelContainer />
				<DrawingPanelContainer />
				{servicesReady && <FacilityMapContainer />}
			</div>
		</div>
	) : (
		<Fragment />
	);
};

App.propTypes = propTypes;

export default memo(App);
