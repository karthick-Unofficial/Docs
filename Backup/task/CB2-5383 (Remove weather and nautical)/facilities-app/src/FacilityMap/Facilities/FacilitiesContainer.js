import { connect } from "react-redux";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilitiesActions";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import {
	layerSourcesSelector,
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import _ from "lodash";
const mapStateToProps = state => {
	const { appState } = state;
	const { persisted } = appState;
	const context = primaryContextSelector(state);
	const { baseMap, mapTools } = state.mapState;
	const { mapRef } = baseMap;
	const facilityFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (feed && feed.entityType === "facility");
			}
		), "feedId");
	let facilities = {};
	if (state.globalData && state.globalGeo) {
		facilityFeeds.map(feed => {
			facilities = _.merge(facilities, (_.cloneDeep(layerSourcesSelector(state, {feedId: feed})) || {}));
		});
	}
	/**
	 * TODO: Add a selector to grab correct facilities/facility in context
	 * TODO: Container should be client specific -- visible facilities will depend on application
	 */
	if (persisted.mapSettings) {
		const { entityLabels } = persisted.mapSettings;
		return {
			map: mapRef,
			facilities:
				context && context.entity
					? { [context.entity.id]: context.entity }
					: facilities,
			labelsVisible: entityLabels && entityLabels.visible,
			mapTools
		};
	} else {
		return {
			map: mapRef,
			facilities:
				context && context.entity
					? { [context.entity.id]: context.entity }
					: facilities,
			mapTools
		};
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilitiesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilitiesLayer);

export default FacilitiesContainer;
