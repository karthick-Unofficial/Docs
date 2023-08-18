import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { moveToTarget } from "../../AppState/Actions";

import TargetingIcon from "./TargetingIcon";

import { mapState as mapRef } from "orion-components/AppState/Selectors";
import { replayMapState } from "orion-components/AppState/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { makeGetEntity } from "orion-components/GlobalData/Selectors";

const makeMapStateToProps = () => {
	const getEntity = makeGetEntity();
	const mapStateToProps = (state, ownProps) => {
		// if there's a replayMapState then we want replay entities not live map entities
		const mapAppState = state.replayMapState ? replayMapState(state) : mapRef(state);
		const map = ownProps.map ? ownProps.map : state.replayMapState ? 
			state.replayMapState.replayBaseMap.mapRef : state.mapState ? state.mapState.baseMap.mapRef : null;
		const filters = mapAppState ? mapFiltersById(state) : null;

		let geometry = state.replayMapState ? null : ownProps.geometry;
		//Get entity
		const entity = mapAppState && mapAppState.entities[ownProps.feedId] ? getEntity(state, ownProps) : null;
		//Check if entity's displayType is map (or not set)
		if (entity && entity.entityData && ["map", "facility"].includes((entity.entityData.displayType || "map").toLowerCase())) {
			if (!geometry || typeof geometry !== "object") {
				geometry = entity.entityData.geometry;
			}
		} else if (typeof geometry !== "object") {
			geometry = false;
		}

		return {
			map,
			mapVisible: state.replayMapState ? state.replayMapState.replayBaseMap.visible : state.mapState ? state.mapState.baseMap.visible :  false,
			geometry,
			filters
		};
	};
	return mapStateToProps;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ moveToTarget }, dispatch);
};

const TargetingIconContainer = connect(
	makeMapStateToProps,
	mapDispatchToProps
)(TargetingIcon);

export default TargetingIconContainer;
