import { connect } from "react-redux";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilitiesActions";
import {
	primaryContextSelector,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import _ from "lodash";
const mapStateToProps = state => {
	const { appState, contextualData} = state;
	const { persisted } = appState;
	const context = selectedContextSelector(state);
	const primaryId = primaryContextSelector(state);
	const primary = contextualData[primaryId];
	const { mapRef } = state.mapState.baseMap;
	const facilities = {};
	const proximityEntities = context && context.proximityEntities ? context.proximityEntities : [];
	const pinnedEntities = primary && primary.pinnedItems ? primary.pinnedItems : [];
	[...proximityEntities, ...pinnedEntities].forEach(item => {
		if (item.entityType === "facility" && item.entityData.geometry) {
			facilities[item.id] = item;
		}
	});

	/**
	 * TODO: Add a selector to grab correct facilities/facility in context
	 * TODO: Container should be client specific -- visible facilities will depend on application
	 */
	if (persisted.mapSettings) {
		const { entityLabelsVisible } = persisted.mapSettings;
		return {
			map: mapRef,
			secondary: true,
			facilities:
				facilities,
			labelsVisible: entityLabelsVisible
		};
	} else {
		return {
			map: mapRef,
			secondary: true,
			facilities:
				facilities
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
