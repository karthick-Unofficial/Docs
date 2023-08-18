import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { loadProfile } from "orion-components/ContextPanel/Actions";
import { setMapEntities } from "orion-components/AppState/Actions";
import {
	mapSettingsSelector,
	disabledFeedsSelector,
	persistedState
} from "orion-components/AppState/Selectors";
import {
	layerSourcesSelector,
	userFeedsSelector,
	alertSelector
} from "orion-components/GlobalData/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { userIntegrationByFeedIdSelector } from "orion-components/Session/Selectors";

import MapLayer from "./MapLayer";

import _ from "lodash";

const mapStateToProps = (state, props) => {
	const settings = mapSettingsSelector(state);
	const disabledFeeds = disabledFeedsSelector(state);
	const feed = _.find(
		userFeedsSelector(state),
		feed => feed.feedId === props.feedId
	);
	const { selectedFloors } = persistedState(state);
	const canView = feed ? feed.canView : true;
	const data = layerSourcesSelector(state, props);
	const alerts = alertSelector(state);
	const filters = mapFiltersById(state);
	const userFeed = userIntegrationByFeedIdSelector(props.feedId)(state);
	const feedEntType = userFeed ? userFeed.entityType : "track";
	const { mapTools } = state.mapState;
	const mapIconTemplate = feed ? feed.mapIconTemplate : null;
	const renderSilhouette = feed && feed.renderSilhouette;
	const { clusteringEnabled, clusterMaxZoomLevel, silhouetteMinZoomLevel } = state.clientConfig.mapSettings;

	return {
		feedEntType,
		data,
		selectedFloors,
		mapTools,
		labelsVisible: settings.entityLabelsVisible,
		disabledFeeds,
		canView,
		alerts,
		style: settings.mapStyle,
		filters,
		mapIconTemplate,
		renderSilhouette,
		clusteringEnabled: typeof clusteringEnabled !== "undefined" ? clusteringEnabled : true,
		clusterMaxZoomLevel: clusterMaxZoomLevel || 11,
		silhouetteMinZoomLevel: silhouetteMinZoomLevel || 11
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			loadProfile,
			setMapEntities
		},
		dispatch
	);
};

const MapLayerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapLayer);

export default MapLayerContainer;
