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
	layerOpacitySelector,
	roadAndLabelLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import {
	mapFiltersSelector
} from "orion-components/ContextPanel/Selectors";

import _ from "lodash";

const mapStateToProps = state => {
	const settings = mapSettingsSelector(state);
	const filters = _.map(mapFiltersSelector(state), entity =>
		_.get(entity, "properties.id")
	);
	const disabledFeeds = [];
	const events = activeEventsSelector(state);

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

	const gisLayers = gisLayerSelector(state);
	return {
		facilityFeeds,
		roadsVisible: true,
		mapName: settings.mapStyle,
		labelsVisible: settings.entityLabelsVisible,
		primaryOpen: false,
		secondaryOpen: false,
		layerOpacity: layerOpacitySelector(state),
		roadAndLabelLayerOpacity: roadAndLabelLayerOpacitySelector(state),
		filters,
		activeFeeds,
		events,
		eventsVisible: true,
		gisLayers
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
