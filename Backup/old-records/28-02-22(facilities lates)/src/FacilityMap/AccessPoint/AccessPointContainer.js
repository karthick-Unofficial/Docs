import { connect } from "react-redux";
import { AccessPointLayer } from "orion-components/Map/Layers";
import { bindActionCreators } from "redux";
import * as actionCreators from "./accessPointActions";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import _ from "lodash";

const mapStateToProps = state => {
	const facilityId = primaryContextSelector(state);
	const facility = state.contextualData[facilityId];
	const { selectedFloor } = floorPlanSelector(state);
	const { mapRef } = state.mapState.baseMap;

	return {
		accessPoints: facility && facility.floorPlanAccesssPoints ? facility.floorPlanAccesssPoints : [],
		map: mapRef,
		labelsVisible: true,
		selectedFloor
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AccessPointContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AccessPointLayer);

export default AccessPointContainer;
