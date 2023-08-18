import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./floorPlanToolActions.js";
import FloorPlanTool from "./FloorPlanTool";

const mapStateToProps = state => {
	const { coordinates } = state.floorPlan;
	const { mapRef: map } = state.mapState.baseMap;
	const coordinatesCopy = coordinates.map(coordinate => {
		return coordinate.slice();
	});

	return {
		map,
		geometry: {
			type: "Polygon",
			coordinates: [coordinatesCopy]
			
		}
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FloorPlanToolContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FloorPlanTool);

export default FloorPlanToolContainer;
