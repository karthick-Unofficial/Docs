import React, { PureComponent, Fragment } from "react";
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
	listLookupData
} from "orion-components/GlobalData/Reducers";
import floorPlans from "./reducers/floorPlans";
import { WavCam } from "orion-components/Dock";
class App extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			sessionHydrated: false,
			queueTimers: [],
			serviceReady: false
		};
	}

	componentDidMount() {
		browsingMetrics({
			trackTiming: (category, name, duration) => {
				// Now, we can send the metrics to a third party to keep track of them.
			},
			sampleRate: 20,
			log: true
		});

		// -- don't load feeds until services ready (this is to wait for the clientConfig to load in) - CD
		if (this.props.servicesReady) {
			this.hydrateAndSubscribe();
		}
	}

	componentDidUpdate(prevProps) {
		// -- don't load feeds until services ready (this is to wait for the clientConfig to load in) - CD
		if (this.props.servicesReady && !prevProps.servicesReady) {
			this.hydrateAndSubscribe();
		}
	}

	hydrateAndSubscribe() {
		const { identity, getEventTypes, checkActiveSpotlights, useFeedQueue } = this.props;

		const hydrate = async () => {
			this.props.getGlobalAppState();
			const feeds = await this.props.subscribeAppFeedPermissions(identity.userId, "map-app");
			const state = await this.props.getAppState("map-app");
			const hydrated = await this.props.hydrateUser(identity.userId);

			if (feeds && state && hydrated) {
				return this.props.userFeeds;
			}
		};

		// Rest call to get integrations
		const getInts = () => {
			return new Promise((resolve, reject) => {
				feedService.getUserAppIntegration(this.props.userId, "map-app", (err, res) => {
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
					{
						listLookupData: listLookupData
					}
				];

				// Create a globalData reducer for each system feed
				const newQueueTimers = [...this.state.queueTimers];
				_.each(globalFeeds, globalFeed => {
					const name = "globalData." + Object.keys(globalFeed)[0];
					const reducer = Object.values(globalFeed)[0];
					appendReducer(name, reducer);

					// Fix for FOVs until we make it a feed
					if (Object.keys(globalFeed)[0] === "fovs") {
						appendReducer("globalGeo.fovs", dataByFeed("fovs", "globalGeo", useFeedQueue));

						if (useFeedQueue) {
							const intId = setInterval(() => {
								this.props.runQueue("fovs", "globalGeo");
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
							this.props.runQueue(feed.intId, "globalGeo");
						}, 1000);
						newQueueTimers.push(intId);
					}
				});

				// Reducers are there, go ahead and set sessionHydrated to true
				this.setState({
					sessionHydrated: true,
					queueTimers: newQueueTimers
				});

				return;
			})
			.then(() => {
				// This still needs to wait 1.5 seconds minimum (maybe more) as it can
				// still fire too early at times. Increase the time to 2 seconds if you
				// notice feeds aren't loading.
				setTimeout(() => {
					_.each(this.props.userFeeds, feed => {
						if (feed) {
							this.props.subscribeFeed(feed.feedId, feed.source);
						}
					});
				}, 1500);

				this.props.subscribeCollections();
				this.props.getAllEvents("intermediate", ["active"]);
				this.props.getGISServices();
				this.props.toggleMapVisible();
				this.props.subscribeExclusions();
				getEventTypes();
				checkActiveSpotlights();
				return;
			});
	}

	componentWillUnmount() {
		if (this.props.useFeedQueue) {
			this.state.queueTimers.forEach(timerId => clearInterval(timerId));
		}
	}

	render() {
		const { isHydrated, servicesReady, WavCamOpen } = this.props;

		return (
			<div className="App">
				<Services>
					<BaseMapservice setReady={() => this.setState({ serviceReady: true })} />
				</Services>
				{isHydrated && this.state.sessionHydrated && servicesReady && (
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
	}
}

export default App;
