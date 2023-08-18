import React, { Fragment, useEffect, useState, useRef } from "react";
import _ from "lodash";
import { feedService } from "client-app-core";
import { Services } from "orion-components/Services";

import MapAppBarContainer from "./MapAppBar/MapAppBarContainer";
import MapBaseContainer from "./MapBase/MapBaseContainer";
import ListPanelContainer from "./ListPanel/ListPanelContainer";
import ShapePanelContainer from "./ShapePanel/ShapePanelContainer";
import ResumeSpotlightDialogContainer from "./Spotlight/ResumeSpotlightDialog/ResumeSpotlightDialogContainer";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import ErrorBoundary from "orion-components/ErrorBoundary";

// Metrics
import browsingMetrics from "browser-metrics/lib/browsingMetrics";

// Reducer Appendation
import { appendReducer } from "./index.js";
import {
	collections,
	notifications,
	dataByFeed,
	events,
	gisData,
	exclusions,
	listLookupData,
	floorPlan
} from "orion-components/GlobalData/Reducers";
import floorPlans from "./reducers/floorPlans";
import { WavCam } from "orion-components/Dock";

const usePrevious = (value) => {
	const ref = useRef(null);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const App = (props) => {
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
		WavCamOpen
	} = props;
	const [sessionHydrated, setSessionHydrated] = useState(false);
	const [queueTimers, setQueueTimers] = useState([]);
	const [serviceReady, setServiceReady] = useState(false);

	const userFeedsRef = useRef(null);

	const prevProps = usePrevious(props);

	useEffect(() => {
		browsingMetrics({
			trackTiming: (category, name, duration) => {
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
				queueTimers.forEach(timerId => clearInterval(timerId));
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
			getGlobalAppState();
			const feeds = await subscribeAppFeedPermissions(identity.userId, "map-app");
			const state = await getAppState("map-app");
			const hydrated = await hydrateUser(identity.userId);

			if (feeds && state && hydrated) {
				return userFeeds;
			}
		};

		// Rest call to get integrations
		const getInts = () => {
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

		Promise.all([getInts(), hydrate()])
			.then(values => {
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
					}
				];

				// Create a globalData reducer for each system feed
				const newQueueTimers = [...queueTimers];
				_.each(globalFeeds, globalFeed => {
					const name = "globalData." + Object.keys(globalFeed)[0];
					const reducer = Object.values(globalFeed)[0];
					appendReducer(name, reducer);

					// Fix for FOVs until we make it a feed
					if (Object.keys(globalFeed)[0] === "fovs") {
						appendReducer("globalGeo.fovs", dataByFeed("fovs", "globalGeo", useFeedQueue));

						if (useFeedQueue) {
							const intId = setInterval(() => {
								runQueue("fovs", "globalGeo");
							}, 1000);
							newQueueTimers.push(intId);
						}
					}
				});

				// For each integration, returned by getInts(), create a reducer
				// for globalData and globalGeo. This should use streamProperties eventually
				// from sys_feedTypes to do this dynamically
				_.each(values[0], feed => {
					const geoName = "globalGeo." + feed.intId;
					const dataName = "globalData." + feed.intId;
					const geoReducer = dataByFeed(feed.intId, "globalGeo", useFeedQueue);
					const dataReducer = dataByFeed(feed.intId, "globalData", false);
					appendReducer(geoName, geoReducer);
					appendReducer(dataName, dataReducer);

					if (useFeedQueue) {
						const intId = setInterval(() => {
							runQueue(feed.intId, "globalGeo");
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
					_.each(userFeedsRef.current, feed => {
						if (feed) {
							subscribeFeed(feed.feedId, feed.source);
						}
					});
				}, 1500);

				subscribeCollections();
				subscribeFloorPlansWithFacilityFeedId();
				getAllEvents("intermediate", ["active"]);
				getGISServices();
				toggleMapVisible();
				subscribeExclusions();
				getEventTypes();
				checkActiveSpotlights();
				return;
			});
	};

	return (
		<div className="App">
			<Services>
				<BaseMapservice setReady={() => { setServiceReady(true); }} />
			</Services>
			{isHydrated && sessionHydrated && servicesReady && (
				<Fragment>
					<ErrorBoundary>
						<MapAppBarContainer />
					</ErrorBoundary>
					<WavCam />
					<div className="mapPanelWrapper" style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}>
						<ErrorBoundary>
							<ListPanelContainer />
						</ErrorBoundary>

						<ErrorBoundary>
							<ShapePanelContainer />
						</ErrorBoundary>

						<ErrorBoundary>
							<MapBaseContainer />
						</ErrorBoundary>
					</div>
					<ResumeSpotlightDialogContainer />
				</Fragment>
			)}
		</div>
	);
};

export default App;
