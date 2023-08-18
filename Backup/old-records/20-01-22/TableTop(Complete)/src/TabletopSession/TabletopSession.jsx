import _ from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { dataByFeed } from "orion-components/GlobalData/Reducers";
//import ErrorBoundary from "orion-components/ErrorBoundary";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import { appendReducer } from "../index";
import MapContainer from "./MapBase/MapBaseContainer";
import DockContainer from "./Controls/Dock/DockContainer";
import SimulationTreeContainer from "./Controls/SimulationTree/SimulationTreeContainer";
import UserBannerContainer from "./Controls/UserBanner/UserBannerContainer";
import PlaybackContainer from "./Controls/Playback/PlaybackContainer";
import MapFloorPlanContainer from "./Controls/MapFloorPlan/MapFloorPlanContainer";
import MapTraceGeneratorContainer from "./MapTraces/MapTraceGeneratorContainer";
import AudioTraceGeneratorContainer from "./MapTraces/AudioTraceGeneratorContainer";
import ModificationsCoordinatorContainer from "./Widgets/Modifications/ModificationsCoordinatorContainer";
import NotificationsContainer from "./Controls/Notifications/NotificationsContainer";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	user: PropTypes.object,
	isHydrated: PropTypes.bool.isRequired,
	userFeeds: PropTypes.array,
	sessionId: PropTypes.string,
	simId: PropTypes.number,
	sessionStatus: PropTypes.string,
	simulations: PropTypes.object,
	userInfo: PropTypes.object,
	controller: PropTypes.string,
	subscribeSessionState: PropTypes.func.isRequired,
	loadSimulation: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	subscribeFeed: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const TabletopSession = ( { 
	user, 
	isHydrated, 
	userFeeds, 
	sessionId, 
	simId, 
	sessionStatus,
	simulations, 
	userInfo, 
	controller,
	subscribeSessionState, 
	loadSimulation, 
	location, 
	subscribeFeed,
	dir
} ) => {
	useEffect(() => {
		if (isHydrated && location && location.query) {
			subscribeSessionState(user.id, location.query.sessionId);
		}
	}, [isHydrated, location, user.id]);

	useEffect(() => {
		if (isHydrated && userFeeds && userFeeds.length > 0) {
			// This still needs to wait 1.5 seconds minimum (maybe more) as it can
			// still fire too early at times. Increase the time to 2 seconds if you
			// notice feeds aren't loading (comment picked from mapgl-app).
			setTimeout(() => {
				_.each(userFeeds, feed => {
					if (feed && feed.entityType === "facility" && feed.canView) {
						const geoName = "globalGeo." + feed.feedId;
						const dataName = "globalData." + feed.feedId;
						const geoReducer = dataByFeed(feed.feedId, "globalGeo");
						const dataReducer = dataByFeed(feed.feedId, "globalData");
						appendReducer(geoName, geoReducer);
						appendReducer(dataName, dataReducer);
						subscribeFeed(feed.feedId, feed.source);
					}
				});
			}, 1500);
		}
	}, [ isHydrated, userFeeds ]);

	const [ baseSimLoadNeeded, setBaseSimLoadNeeded ] = useState(true);
	const [ playbackHeight, setPlaybackHeight ] = useState(0);
	const [ leftDockWidth, setLeftDockWidth ] = useState(0);
	const [ rightDockWidth, setRightDockWidth ] = useState(0);

	// Load the base simulation if needed
	useEffect(() => {
		if (baseSimLoadNeeded && sessionId) {
			if (!userInfo.isFacilitator && userInfo.userId !== controller) {
				// Not the facilitator or controller. So does not need to worry about loading simulations
				setBaseSimLoadNeeded(false);
				return;
			}
			if (simId) {
				// Simulation is already loaded. We dont need to trigger base sim load
				setBaseSimLoadNeeded(false);
			} else {
				if (simulations) {
					const baseSim = _.values(simulations).find(sim => sim.parentSimId == null || sim.parentSimId === -1 );
					if (baseSim) {
						loadSimulation(sessionId, baseSim.simId);
						setBaseSimLoadNeeded(false);
					}
				}
			}
		}
	}, [user, sessionId, simId, simulations, userInfo, controller, loadSimulation, baseSimLoadNeeded]);

	if (sessionStatus && sessionStatus !== "active") {
		setTimeout(() => {
			window.location = `${window.location.origin}/tabletop-app/`;
		}, 5000);
		return (
			<h4 style={{margin: 10}}><Translate value="tableopSession.main.sessionStatus"/></h4>
		);
	}

	const mapContainerStyle = {
		height: "calc(100vh - 48px)"
	};

	return isHydrated && sessionId ? (
		<ErrorBoundary componentName="tabletopSession">
			<DockContainer dockDirection={dir == "rtl" ? "right" : "left"} reportWidth={setLeftDockWidth} />
			<DockContainer dockDirection={dir == "rtl" ? "left" : "right"} reportWidth={setRightDockWidth} />
			<ErrorBoundary componentName="MapTraceGeneratorContainer">
				<MapTraceGeneratorContainer />
			</ErrorBoundary>
			<ErrorBoundary componentName="AudioTraceGeneratorContainer">
				<AudioTraceGeneratorContainer />
			</ErrorBoundary>
			<div style={mapContainerStyle}>
				<ErrorBoundary componentName="MapContainer">
					<MapContainer isMainMap={true} rightOffset={rightDockWidth} />
				</ErrorBoundary>
			</div>
			<div className="tabletopHeader" style={{left: `${leftDockWidth}px`, right: `${rightDockWidth}px`}}>
				<ErrorBoundary componentName="SimulationTreeContainer">
					<SimulationTreeContainer docksWidth={leftDockWidth + rightDockWidth} />
					<UserBannerContainer />
				</ErrorBoundary>
			</div>
			<div className="playbackContainer" style={{left: `${leftDockWidth}px`, right: `${rightDockWidth}px`}}>
				<ErrorBoundary componentName="PlaybackContainer">
					<PlaybackContainer reportPlaybackHeight={setPlaybackHeight} />
				</ErrorBoundary>
			</div>
			<ErrorBoundary componentName="MapFloorPlanContainer">
				<MapFloorPlanContainer bottomOffset={playbackHeight} leftOffset={leftDockWidth} rightOffset={rightDockWidth} />
			</ErrorBoundary>
			<ModificationsCoordinatorContainer sessionId={sessionId} />
			<ErrorBoundary componentName="NotificationsContainer" >
				<NotificationsContainer></NotificationsContainer>
			</ErrorBoundary>
		</ErrorBoundary>
	) : (
		<Fragment />
	);	
};

TabletopSession.propTypes = propTypes;
export default TabletopSession;