import React, { Fragment, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBar from "orion-components/AppBar/AppBar";
import { Services } from "orion-components/Services";
import FacilityMap from "./FacilityMap/FacilityMap";
import ListPanel from "./ListPanel/ListPanel";
import DrawingPanel from "./DrawingPanel/DrawingPanel";
import BaseMapService from "orion-components/Services/BaseMapService/BaseMapsService";
import { appendReducer } from "./index.js";
import { dataByFeed, notifications, floorPlan } from "orion-components/GlobalData/Reducers";
import floorPlans from "./reducers/floorPlans";
import { feedService } from "client-app-core";
import { WavCam } from "orion-components/Dock";
import { useDispatch, useSelector } from "react-redux";
import {
	hydrateUser,
	subscribeAppFeedPermissions,
	subscribeFeed,
	subscribeFloorPlansWithFacilityFeedId,
	getAppState,
	getGlobalAppState,
	setWidgetLaunchData,
	openSettingsMenu,
	selectFloorPlanOn,
	closeSettingsMenu
} from "./appActions";
import isEqual from "lodash/isEqual";
import OptionsDrawer from "orion-components/AppBar/OptionsDrawer/OptionsDrawer";
import { useLocation } from "react-router-dom";

const App = () => {
	const session = useSelector((state) => state.session);
	const servicesReady = useSelector((state) => state.servicesReady);
	const identity = session.identity;
	const isHydrated = session.user.isHydrated;
	const orgId = session.user.profile.orgId;
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const open = useSelector((state) => state.appState.settingsMenu.open);

	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		// -- only runs on first render
		const { entityId } = params;

		if (entityId) {
			// -- store entityId and widget in local state
			const data = { entityId };
			dispatch(setWidgetLaunchData(data));

			// -- remove params from URL
			navigate("/");
		}
	}, [dispatch, navigate, params]);

	useEffect(() => {
		const { userId } = identity;
		const notificationsObject = { notifications: notifications };
		const floorPlansObject = { floorPlans: floorPlans };
		const floorPlanFacilityFeedObject = {
			floorPlanWithFacilityFeedId: floorPlan
		};
		appendReducer("globalData." + Object.keys(notificationsObject)[0], Object.values(notificationsObject)[0]);
		appendReducer("globalData." + Object.keys(floorPlansObject)[0], Object.values(floorPlansObject)[0]);
		appendReducer(
			"globalData." + Object.keys(floorPlanFacilityFeedObject)[0],
			Object.values(floorPlanFacilityFeedObject)[0]
		);
		dispatch(subscribeAppFeedPermissions(userId, "facilities-app"));
		dispatch(subscribeFloorPlansWithFacilityFeedId());
		dispatch(getGlobalAppState());
		dispatch(getAppState("facilities-app"));
		dispatch(hydrateUser(userId));
	}, [dispatch, identity, orgId]);

	useEffect(() => {
		const { userId } = identity;
		async function getIntegrations() {
			await feedService.getUserAppIntegration(userId, "facilities-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach((feed) => {
						if (feed.entityType === "facility" && feed.config.canView) {
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
		}
		getIntegrations();
	}, [dispatch, identity]);

	const styles = {
		wrapper: {
			position: "relative",
			width: "100%",
			display: "block",
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		}
	};

	const floorPlansWithFacilityFeed = useSelector(
		(state) => (state.globalData ? state.globalData.floorPlanWithFacilityFeedId.floorPlans : null),
		isEqual
	);

	const handleSelectFloorPlanOn = (floorplan, feedId) => {
		dispatch(selectFloorPlanOn(floorplan, feedId));
	};

	const toggleOptionsDrawer = () => {
		dispatch(openSettingsMenu());
	};

	const handleDrawerClose = () => {
		dispatch(closeSettingsMenu());
	};

	return isHydrated ? (
		<div style={{ overflow: "hidden" }}>
			<Services>
				<BaseMapService setReady={true} />
			</Services>
			<ErrorBoundary>
				<AppBar
					floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
					selectFloorPlanOn={handleSelectFloorPlanOn}
					isMenu={true}
					toggleOptionsDrawer={toggleOptionsDrawer}
					titleText="Facilities"
				/>
				<OptionsDrawer open={open} toggleClosed={handleDrawerClose} settingsMenu={true} />
			</ErrorBoundary>
			<WavCam />
			<div style={styles.wrapper}>
				<ListPanel location={location} />
				<DrawingPanel />
				{servicesReady && <FacilityMap />}
			</div>
		</div>
	) : (
		<Fragment />
	);
};

export default memo(App);
