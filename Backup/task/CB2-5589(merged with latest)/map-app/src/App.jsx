import React, { Fragment, useEffect, useState, useRef } from "react";
import { feedService } from "client-app-core";
import { Services } from "orion-components/Services";

import MapAppBar from "./MapAppBar/MapAppBar";
import MapBase from "./MapBase/MapBase";
import ListPanel from "./ListPanel/ListPanel";
import ShapePanel from "./ShapePanel/ShapePanel";
import ResumeSpotlightDialog from "./Spotlight/ResumeSpotlightDialog/ResumeSpotlightDialog";
import BaseMapService from "orion-components/Services/BaseMapService/BaseMapsService";
import ErrorBoundary from "orion-components/ErrorBoundary";

// Metrics
import browsingMetrics from "browser-metrics/lib/browsingMetrics";

// Reducer Appending
import { appendReducer } from "./index.js";
import {
	collections,
	notifications,
	dataByFeed,
	events,
	gisData,
	exclusions,
	listLookupData,
	floorPlan,
	unitMembers,
	units
} from "orion-components/GlobalData/Reducers";
import floorPlans from "./reducers/floorPlans";
import { WavCam } from "orion-components/Dock";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./appActions.js";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import each from "lodash/each";
import PropTypes from "prop-types";

const usePrevious = (value) => {
	const ref = useRef(null);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const AppWrapper = () => {
	const userFeeds = useSelector((state) => userFeedsSelector(state));
	const identity = useSelector((state) => state.session.identity);
	const isHydrated = useSelector((state) => state.session.user.isHydrated);
	const userId = useSelector((state) => state.session.user.profile.id);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const servicesReady = useSelector((state) => state.servicesReady);
	const useFeedQueue = useSelector((state) => state.clientConfig.useFeedQueue || false);

	return (
		<App
			{...actionCreators}
			userFeeds={userFeeds}
			identity={identity}
			isHydrated={isHydrated}
			userId={userId}
			WavCamOpen={WavCamOpen}
			servicesReady={servicesReady}
			useFeedQueue={useFeedQueue}
		/>
	);
};

const propTypes = {
	servicesReady: PropTypes.bool,
	identity: PropTypes.object,
	getEventTypes: PropTypes.func,
	checkActiveSpotlights: PropTypes.func,
	useFeedQueue: PropTypes.object,
	getGlobalAppState: PropTypes.func,
	subscribeAppFeedPermissions: PropTypes.func,
	getAppState: PropTypes.func,
	hydrateUser: PropTypes.func,
	userFeeds: PropTypes.object,
	userId: PropTypes.string,
	runQueue: PropTypes.func,
	subscribeFeed: PropTypes.func,
	subscribeCollections: PropTypes.func,
	subscribeFloorPlansWithFacilityFeedId: PropTypes.func,
	getAllEvents: PropTypes.func,
	getGISServices: PropTypes.func,
	toggleMapVisible: PropTypes.func,
	subscribeExclusions: PropTypes.func,
	isHydrated: PropTypes.bool,
	WavCamOpen: PropTypes.bool,
	subscribeUnitMembers: PropTypes.func,
	subscribeUnits: PropTypes.func
};

const App = (props) => {
	const dispatch = useDispatch();
	const {
		servicesReady,
		identity,
		getEventTypes,
		checkActiveSpotlights,
		useFeedQueue,
		getGlobalAppState,
		subscribeAppFeedPermissions,
		getAppState,
		hydrateUser,
		userFeeds,
		userId,
		runQueue,
		subscribeFeed,
		subscribeCollections,
		subscribeFloorPlansWithFacilityFeedId,
		getAllEvents,
		getGISServices,
		toggleMapVisible,
		subscribeExclusions,
		isHydrated,
		WavCamOpen,
		subscribeUnitMembers,
		subscribeUnits
	} = props;
	const [sessionHydrated, setSessionHydrated] = useState(false);
	const [queueTimers, setQueueTimers] = useState([]);
	const [baseMapsReady, setBaseMapsReady] = useState(false);

	const userFeedsRef = useRef(null);

	const prevProps = usePrevious(props);

	useEffect(() => {
		browsingMetrics({
			trackTiming: () => {
				// Now, we can send the metrics to a third party to keep track of them.
			},
			sampleRate: 20,
			log: true
		});

		// -- don't load feeds until services ready (this is to wait for the clientConfig to load in) - CD
		if (servicesReady) {
			hydrateAndSubscribe();
		}

		return () => {
			if (useFeedQueue) {
				queueTimers.forEach((timerId) => clearInterval(timerId));
			}
		};
	}, []);

	useEffect(() => {
		userFeedsRef.current = userFeeds;
		// -- don't load feeds until services ready (this is to wait for the clientConfig to load in) - CD
		if (servicesReady && !prevProps.servicesReady) {
			hydrateAndSubscribe();
		}
	}, [props]);

	const hydrateAndSubscribe = () => {
		const hydrate = async () => {
			dispatch(getGlobalAppState());
			const feeds = await dispatch(subscribeAppFeedPermissions(identity.userId, "map-app"));
			const state = await dispatch(getAppState("map-app"));
			const hydrated = await dispatch(hydrateUser(identity.userId));

			if (feeds && state && hydrated) {
				return userFeeds;
			}
		};

		// Rest call to get integrations
		const getIntegrations = () => {
			return new Promise((resolve, reject) => {
				feedService.getUserAppIntegration(userId, "map-app", (err, res) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					if (res) {
						resolve(res);
					}
				});
			});
		};

		Promise.all([getIntegrations(), hydrate()])
			.then((values) => {
				// Set default, system feeds
				const globalFeeds = [
					{ collections: collections },
					{ notifications: notifications },
					{ events: events },
					{ gisData: gisData },
					{ fovs: dataByFeed("fovs", "globalData", false) },
					{ exclusions: exclusions },
					{ floorPlans: floorPlans },
					{ floorPlanWithFacilityFeedId: floorPlan },
					{
						listLookupData: listLookupData
					},
					{ unitMembers: unitMembers },
					{ units: units }
				];

				// Create a globalData reducer for each system feed
				const newQueueTimers = [...queueTimers];
				each(globalFeeds, (globalFeed) => {
					const name = "globalData." + Object.keys(globalFeed)[0];
					const reducer = Object.values(globalFeed)[0];
					appendReducer(name, reducer);

					// Fix for FOVs until we make it a feed
					if (Object.keys(globalFeed)[0] === "fovs") {
						appendReducer("globalGeo.fovs", dataByFeed("fovs", "globalGeo", useFeedQueue));

						if (useFeedQueue) {
							const intId = setInterval(() => {
								dispatch(runQueue("fovs", "globalGeo"));
							}, 1000);
							newQueueTimers.push(intId);
						}
					}
				});

				// For each integration, returned by getIntegrations(), create a reducer
				// for globalData and globalGeo. This should use streamProperties eventually
				// from sys_feedTypes to do this dynamically
				each(values[0], (feed) => {
					const geoName = "globalGeo." + feed.intId;
					const dataName = "globalData." + feed.intId;
					const geoReducer = dataByFeed(feed.intId, "globalGeo", useFeedQueue);
					const dataReducer = dataByFeed(feed.intId, "globalData", false);
					appendReducer(geoName, geoReducer);
					appendReducer(dataName, dataReducer);

					if (useFeedQueue) {
						const intId = setInterval(() => {
							dispatch(runQueue(feed.intId, "globalGeo"));
						}, 1000);
						newQueueTimers.push(intId);
					}
				});

				// Reducers are there, go ahead and set sessionHydrated to true
				setSessionHydrated(true);
				setQueueTimers(newQueueTimers);

				return;
			})
			.then(() => {
				// This still needs to wait 1.5 seconds minimum (maybe more) as it can
				// still fire too early at times. Increase the time to 2 seconds if you
				// notice feeds aren't loading.
				setTimeout(() => {
					each(userFeedsRef.current, (feed) => {
						if (feed) {
							dispatch(subscribeFeed(feed.feedId, feed.source));
						}
					});
				}, 1500);

				dispatch(subscribeCollections());
				dispatch(subscribeFloorPlansWithFacilityFeedId());
				dispatch(getAllEvents("intermediate", ["active", "closed", "upcoming"]));
				dispatch(getGISServices());
				dispatch(toggleMapVisible());
				dispatch(subscribeExclusions());
				dispatch(getEventTypes());
				dispatch(checkActiveSpotlights());
				dispatch(subscribeUnitMembers());
				dispatch(subscribeUnits());
				return;
			});
	};

	return (
		<div className="App">
			<Services>
				<BaseMapService
					setReady={() => {
						setBaseMapsReady(true);
					}}
				/>
			</Services>
			{isHydrated && sessionHydrated && servicesReady && baseMapsReady && (
				<Fragment>
					<ErrorBoundary>
						<MapAppBar />
					</ErrorBoundary>
					<WavCam />
					<div
						className="mapPanelWrapper"
						style={{
							height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
						}}
					>
						<ErrorBoundary>
							<ListPanel />
						</ErrorBoundary>

						<ErrorBoundary>
							<ShapePanel />
						</ErrorBoundary>

						<ErrorBoundary>
							<MapBase />
						</ErrorBoundary>
					</div>
					<ResumeSpotlightDialog />
				</Fragment>
			)}
		</div>
	);
};

App.propTypes = propTypes;

export default AppWrapper;
