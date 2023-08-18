import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./replayLayerSourcesActions.js";
import ReplayLayerSources from "./ReplayLayerSources";

import {
	userFeedsSelector,
	gisLayerSelector
} from "orion-components/GlobalData/Selectors"; // Remove once all entites selector added

import {
	mapSettingsSelector,
	replayMapObject,
	persistedState,
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
import {
	mapFiltersSelector
} from "orion-components/ContextPanel/Selectors";
import _ from "lodash";
import { getInitialPlayBarData } from "../../shared/utility/utilities";

const mapStateToProps = state => {
	const { playBarValue } = state.playBar;
	const settings = mapSettingsSelector(state);
	const filters = _.map(mapFiltersSelector(state), entity =>
		_.get(entity, "properties.id")
	);
	const showAllFOVs = persistedState(state).showAllFOVs;
	const disabledFeeds = disabledFeedsSelector(state);
	// // Update with new FOV stream
	// const activeFOVs =
	// 	state.globalData.fovs.data && !_.isEmpty(state.globalData.fovs.data)
	// 		? state.globalData.fovs.data
	// : null;

	const userFeeds = userFeedsSelector(state);

	// Pass down as object
	const activeFeeds = _.map(
		_.filter(
			_.map(userFeeds),
			feed => {
				return (
					feed &&
					!_.includes(disabledFeeds, feed.feedId) &&
					feed.entityType !== "facility"
				);
			}
		), "feedId");

	const facilityFeeds = _.map(
		_.filter(
			_.map(userFeeds),
			feed => {
				return (
					feed &&
					!_.includes(disabledFeeds, feed.feedId) &&
					feed.entityType === "facility"
				);
			}
		), "feedId");
	const gisLayers = window.api ? [] : gisLayerSelector(state);
	const allAlerts = getInitialPlayBarData(playBarValue, state.replay.alerts);
	const alerts = {};
	for (const key in allAlerts) {
		if (!allAlerts[key].closed) {
			alerts[key] = allAlerts[key];
		}
	}
	const map = replayMapObject(state);
	return {
		alerts,
		activeFeeds,
		showAllFOVs,
		map,
		facilityFeeds,
		labelsVisible: settings.entityLabelsVisible,
		filters,
		eventsVisible: !disabledFeeds.includes("Event"),
		gisLayers,
		aerisKey: window.api ? "" : state.clientConfig.mapSettings.AERIS_API_KEY
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const ReplayLayerSourcesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReplayLayerSources);

export default ReplayLayerSourcesContainer;
