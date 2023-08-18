import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./layerSourcesActions.js";
import LayerSources from "./LayerSources";

import {
	userFeedsSelector,
	gisLayerSelector,
	activeEventsSelector
} from "orion-components/GlobalData/Selectors"; // Remove once all entites selector added

import {
	mapSettingsSelector,
	persistedState,
	disabledFeedsSelector,
	layerOpacitySelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector,
	ssrRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	mapFiltersSelector,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import _ from "lodash";

const mapStateToProps = state => {
	const settings = mapSettingsSelector(state);
	const filters = _.map(mapFiltersSelector(state), entity =>
		_.get(entity, "entityData.properties.id")
	);
	const showAllFOVs = persistedState(state).showAllFOVs;
	const disabledFeeds = disabledFeedsSelector(state);
	const events = activeEventsSelector(state);
	const trackHistory = trackHistorySelector(state, disabledFeeds);
	// Update with new FOV stream
	const activeFOVs =
		state.globalData.fovs.data && !_.isEmpty(state.globalData.fovs.data)
			? state.globalData.fovs.data
			: null;

	// Pass down as object
	const activeFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (
					feed &&
				!_.includes(disabledFeeds, feed.feedId) &&
				feed.entityType !== "facility" &&
				state.globalData[feed.feedId] &&
				!_.isEmpty(state.globalData[feed.feedId].data) &&
				state.globalGeo[feed.feedId] &&
				!_.isEmpty(state.globalGeo[feed.feedId].data)
				);
			}
		), "feedId");

	const facilityFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (
					feed &&
				!_.includes(disabledFeeds, feed.feedId) &&
				feed.entityType === "facility" &&
				state.globalData[feed.feedId] &&
				!_.isEmpty(state.globalData[feed.feedId].data) &&
				state.globalGeo[feed.feedId] &&
				!_.isEmpty(state.globalGeo[feed.feedId].data)
				);
			}
		), "feedId");

	const context = selectedContextSelector(state);
	let event;
	if (context && context.entity && context.entity.entityType === "event") {
		event = context.entity;
	}
	const gisLayers = gisLayerSelector(state);
	const { mapTools } = state.mapState;
	return {
		activeFOVs,
		showAllFOVs,
		facilityFeeds,
		nauticalChartsVisible: settings.nauticalChartsVisible || false,
		roadsVisible: settings.roadsVisible || false,
		weatherVisible: settings.weatherVisible || false,
		ssrRadarVisible: settings.ssrRadarVisible || false,
		mapName: settings.mapStyle,
		labelsVisible: settings.entityLabelsVisible,
		primaryOpen: contextPanelState(state).primaryOpen,
		secondaryOpen: contextPanelState(state).secondaryOpen,
		layerOpacity: layerOpacitySelector(state),
		nauticalChartLayerOpacity: nauticalChartLayerOpacitySelector(state),
		roadAndLabelLayerOpacity: roadAndLabelLayerOpacitySelector(state),
		weatherRadarLayerOpacity: weatherRadarLayerOpacitySelector(state),
		ssrRadarLayerOpacity: ssrRadarLayerOpacitySelector(state),
		trackHistory,
		filters,
		activeFeeds,
		event,
		events,
		eventsVisible: !disabledFeeds.includes("Event"),
		selectedEntity: context ? context.entity : null,
		gisLayers,
		aerisKey: state.clientConfig.mapSettings.AERIS_API_KEY,
		mapTools,
		spotlights: state.spotlights,
		timeFormatPreference: state.appState.global.timeFormat,
		ssrRadarOverlayEnabled: !!state.clientConfig.ssrRadarOverlayEnabled,
		ssrRadarTiles: state.ssrRadarTiles,
		ssrRadarTileUpdateInterval: state.clientConfig.ssrRadarTileUpdateInterval
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const LayerSourcesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LayerSources);

export default LayerSourcesContainer;
