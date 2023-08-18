import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { loadProfile, loadProfileOffline } from "orion-components/ContextPanel/Actions";
import { setMapEntities } from "../../replayMapActions";
import {
	mapSettingsSelector,
	disabledFeedsSelector,
	persistedState
} from "orion-components/AppState/Selectors";
import {
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { userIntegrationByFeedIdSelector } from "orion-components/Session/Selectors";

import MapLayer from "../../../NewReplay/NewMapReplay/LiveMap/LayerSources/MapLayer/MapLayer";
import _ from "lodash";
import { getInitialPlayBarData } from "../../../shared/utility/utilities";

const mapStateToProps = (state, props) => {
	const settings = mapSettingsSelector(state);
	const { playBarValue } = state.playBar;
	const userFeeds = userFeedsSelector(state);
	const disabledFeeds = disabledFeedsSelector(state);
	const feed = _.find(
		userFeeds,
		feed => feed.feedId === props.feedId
	);
	const { selectedFloors } = persistedState(state);
	const canView = feed ? feed.canView : true;
	const data = [];
	const timeData = getInitialPlayBarData(playBarValue, state.replay.timeTransactions);
	if (timeData) {
		Object.keys(timeData).map(key => {
			if ((props.feedId === "fovs" && timeData[key].entityData.properties.type === "FOV") || 
				timeData[key].feedId === props.feedId && timeData[key].entityData.properties.type !== "FOV") {
				// -- ignore deleted entities so they won't be displayed on the map
				if (!timeData[key].isDeleted) {
					data.push(timeData[key]);
				}
			}
		});
	}

	const filters = mapFiltersById(state);
	// const userFeed = userIntegrationByFeedIdSelector(props.feedId)(state);
	const feedEntType = feed ? feed.entityType : "track";
	const mapIconTemplate = feed ? feed.mapIconTemplate : null;
	return {
		feedEntType,
		data,
		selectedFloors,
		labelsVisible: settings.entityLabels ? settings.entityLabels.visible : true,
		disabledFeeds,
		canView,
		style: settings.mapStyle,
		filters,
		mapIconTemplate,
		mapTools: {}
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			loadProfile,
			loadProfileOffline,
			setMapEntities
		},
		dispatch
	);
};

const ReplayMapLayerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapLayer);

export default ReplayMapLayerContainer;
