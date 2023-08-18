import _ from "lodash";
import { createSelector } from "reselect";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { createDefaultObject } from "../shared/utility/eventUtility";

const appStateSelector = state => state.appState;
const mapFloorPlanStateSelector = state => state.appState && state.appState.persisted
	? state.appState.persisted.mapFloorPlanSettings : null;
const teamsConfigSelector = state => state.clientConfig ? state.clientConfig.teamsConfig : null;

const globalDataSelector = state => state.globalData;
const globalGeoSelector = state => state.globalGeo;

const createDefaultMapLayerSettings = (teamsConfig) => {
	const settings = {
		displayTimeline: true,
		displayFloorPlan: true,
		mapLayers: {
			labels: true,
			objectives: true,
			interdictionSites: true,
			facilities: true
		}
	};

	//teams: {BLUE: {enabled: true, disabled: true}, RED: {enabled: true, disabled: true}}
	const teamsSettings = {};
	_.mapKeys(teamsConfig, (value, key) => {
		teamsSettings[key] = { enabled: true, disabled: false };
	});

	settings.mapLayers["teams"] = teamsSettings;

	const traceSettings = createDefaultObject(true, true);
	settings.traces = traceSettings;

	return settings;
};

export const mapLayerSettingsSelector = createSelector(
	appStateSelector,
	teamsConfigSelector,
	(appState, teamsConfig) => {
		if (appState && appState.persisted && appState.persisted.mapLayerSettings) {
			return appState.persisted.mapLayerSettings;
		}
		if (!teamsConfig) {
			return null;
		}

		return createDefaultMapLayerSettings(teamsConfig);
	}
);

export const mapFloorPlanSettingsSelector = createSelector(
	mapFloorPlanStateSelector,
	(mapFloorPlanState) => {
		if (mapFloorPlanState) {
			// Handling objects in rethink has issues where if we update an object, the properties 
			// that are not included in the updated object still remain in the object. Hence as a 
			// work-around we are converting the object to string when saving, and will have to 
			// convert back to object here.
			if (mapFloorPlanState.hasOwnProperty("facilityFloorplans")) {
				const newState = _.cloneDeep(mapFloorPlanState);
				newState.facilityFloorplans = JSON.parse(newState.facilityFloorplans);
				return newState;
			} else {
				mapFloorPlanState.facilityFloorplans = {};
				return mapFloorPlanState;
			}
		}

		return {
			dockLayout: "bottom",
			hideAll: false,
			facilityFloorplans: {}
		};
	}
);

export const exerciseSettingsSelector = createSelector(
	appStateSelector,
	teamsConfigSelector,
	(appState, teamsConfig) => {
		if(appState && appState.persisted && appState.persisted.exerciseSettings) {
			const exerciseSettings = appState.persisted.exerciseSettings;
			if(!exerciseSettings.hasOwnProperty("simTimePrecision")) {
				exerciseSettings.simTimePrecision = 0;
			}
			return exerciseSettings;
		}

		const settings = {
			mapDisplay: {
				traceDuration: 5,
				markerSizes: {
					agents: {
					},
					others: 1,
					trace: .8
				}
			},
			modifyTimerDuration: 300,
			simTimePrecision: 0
		};

		_.mapKeys(teamsConfig, (value, key) => {
			settings.mapDisplay.markerSizes.agents[key] = 1;
		});

		return settings;
	}
);

export const facilitiesSelector = createSelector(
	userFeedsSelector,
	globalDataSelector,
	globalGeoSelector,
	(userFeeds, globalData, globalGeo) => {
		let facilities;

		const facilityFeeds = _.map(
			_.filter(
				_.map(userFeeds),
				feed => {
					return (feed && feed.entityType === "facility");
				}
			), "feedId");

		if (globalData && globalGeo) {
			facilityFeeds.map(feed => {
				if (globalGeo[feed] && globalGeo[feed].data) {
					facilities = _.merge(facilities, (_.cloneDeep(globalGeo[feed].data)));
				}
			});
		}
		return facilities;
	}
);