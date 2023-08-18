import React, { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Services } from "orion-components/Services";
import BaseMapsService from "orion-components/Services/BaseMapService/BaseMapsService";

// if (process.env.NODE_ENV !== "production") {
// 	const {whyDidYouUpdate} = require("why-did-you-update");
// 	whyDidYouUpdate(React);
// }

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// Components
import EventsAppBar from "./EventsAppBar/EventsAppBar";
import EventsListPanel from "./EventsListPanel/EventsListPanel";
import EventView from "./EventView/EventView";
import ShapePanel from "./ShapePanel/ShapePanel";
import { WavCam } from "orion-components/Dock";
import { useSelector, useDispatch } from "react-redux";

import { getAppState } from "orion-components/AppState/Actions";

import {
	getMapAppState,
	hydrateUser,
	toggleMapVisible,
	getGlobalAppState,
	subscribeAppFeedPermissions,
	subscribeFloorPlansWithFacilityFeedId,
	getEventTypes,
	updateWidgetLaunchData,
	runQueue,
	subscribeFeed
} from "./appActions";
import {
	subscribeCameras,
	getAllEvents,
	getAllTemplates,
	subscribeCollections
} from "orion-components/GlobalData/Actions";

import { userFeedsSelector } from "orion-components/GlobalData/Selectors";

import { feedService } from "client-app-core";
import each from "lodash/each";
import { appendReducer } from "./index.js";

import {
	notifications,
	collections,
	cameras,
	events,
	rules,
	dataByFeed,
	listLookupData,
	floorPlan as floorPlanWithFacilityFeedId,
	units,
	unitMembers
} from "orion-components/GlobalData/Reducers";
import floorPlans from "./reducers/floorPlans";

const usePrevious = (value) => {
	const ref = useRef(null);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const propTypes = {
	identity: PropTypes.object,
	isHydrated: PropTypes.bool,
	servicesReady: PropTypes.bool,
	WavCamOpen: PropTypes.bool,
	userFeeds: PropTypes.array,
	userId: PropTypes.string,
	useFeedQueue: PropTypes.bool
};

const AppWrapper = () => {
	const identity = useSelector((state) => state.session.identity);
	const isHydrated = useSelector((state) => state.session.user.isHydrated);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const servicesReady = useSelector((state) => state.servicesReady);
	const userFeeds = useSelector((state) => userFeedsSelector(state));
	const userId = useSelector((state) => state.session.user.profile.id);
	const useFeedQueue = useSelector((state) => state.clientConfig.useFeedQueue || false);

	return (
		<App
			userFeeds={userFeeds}
			identity={identity}
			isHydrated={isHydrated}
			WavCamOpen={WavCamOpen}
			servicesReady={servicesReady}
			userId={userId}
			useFeedQueue={useFeedQueue}
		/>
	);
};

const App = (props) => {
	const { identity, isHydrated, servicesReady, WavCamOpen, userFeeds, userId, useFeedQueue } = props;

	const userFeedsRef = useRef(null);

	const dispatch = useDispatch();

	const navigate = useNavigate();
	const location = useLocation();

	const [sessionHydrated, setSessionHydrated] = useState(false);
	const [queueTimers, setQueueTimers] = useState([]);

	const prevProps = usePrevious(props);
	const { entityId, widget } = useParams() || {};

	useEffect(() => {
		if (entityId && widget) {
			// -- store entityId and widget in local state
			const data = { entityId, widget };
			dispatch(updateWidgetLaunchData(data));

			// -- remove params from URL
			navigate("/");
		}
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

	const hydrateAndSubscribe = () => {
		const hydrate = async () => {
			dispatch(getGlobalAppState());
			const feeds = await dispatch(subscribeAppFeedPermissions(identity.userId, "events-app"));
			const state = await dispatch(getAppState("events-app"));
			const hydrated = await dispatch(hydrateUser(identity.userId));

			if (feeds && state && hydrated) {
				return userFeeds;
			}
		};

		// Rest call to get integrations
		const getIntegrations = () => {
			return new Promise((resolve, reject) => {
				feedService.getUserAppIntegration(userId, "events-app", (err, res) => {
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
					{ fovs: dataByFeed("fovs", "globalData") },
					{ floorPlans: floorPlans },
					{ rules: rules },
					{ cameras: cameras },
					{
						floorPlanWithFacilityFeedId: floorPlanWithFacilityFeedId
					},
					{ listLookupData: listLookupData },
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
					//if (feed.entityType === "track") {
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
					//}
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

				dispatch(getMapAppState());
				dispatch(subscribeFloorPlansWithFacilityFeedId());
				dispatch(subscribeCameras());
				dispatch(getAllEvents());
				dispatch(getAllTemplates());
				dispatch(subscribeCollections());
				dispatch(getEventTypes());
				dispatch(toggleMapVisible());
				return;
			});
	};

	useEffect(() => {
		userFeedsRef.current = userFeeds;
		// -- don't load feeds until services ready (this is to wait for the clientConfig to load in) - CD
		if (servicesReady && !prevProps.servicesReady) {
			hydrateAndSubscribe();
		}
	}, [props]);

	return (
		<div className="app-wrapper">
			<Services>
				<BaseMapsService />
			</Services>
			{isHydrated && sessionHydrated && servicesReady && (
				<Fragment>
					<ErrorBoundary>
						<EventsAppBar location={location} />
					</ErrorBoundary>
					<WavCam />
					<div
						style={{
							height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
						}}
						className="content-wrapper"
					>
						<ErrorBoundary>
							<EventsListPanel />
						</ErrorBoundary>

						<ErrorBoundary>
							<ShapePanel />
						</ErrorBoundary>

						{servicesReady && (
							<ErrorBoundary>
								<EventView />
							</ErrorBoundary>
						)}
					</div>
				</Fragment>
			)}
		</div>
	);
};

App.propTypes = propTypes;

export default AppWrapper;
