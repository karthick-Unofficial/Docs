import { connect } from "react-redux";
import ActiveFloorPlan from "./ActiveFloorPlan.jsx";
import { floorPlanSelector } from "orion-components/Map/Selectors";
const mapStateToProps = state => {
	const { mapState } = state;
	const { selectedFloor, coordinates, creating, image } = floorPlanSelector(state);
	const { mode } = mapState.mapTools;
	const { mapRef } = state.mapState.baseMap;
	return { selectedFloor: selectedFloor ? selectedFloor : null, coordinates, creating, mode, map: mapRef, image };
};

const ActiveFloorPlanContainer = connect(mapStateToProps)(ActiveFloorPlan);

export default ActiveFloorPlanContainer;
