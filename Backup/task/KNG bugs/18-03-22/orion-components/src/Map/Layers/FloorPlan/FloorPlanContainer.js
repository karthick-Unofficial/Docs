import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./floorPlanActions.js";
import FloorPlan from "./FloorPlan";

const mapStateToProps = (state, ownProps) => {
	const { floorPlan, mapState } = state;
	const { mapRef: map } = mapState.baseMap;
	const { image, coordinates } = ownProps;
	return {
		map,
		imgSrc: image
			? image
			: floorPlan && floorPlan.image
				? typeof floorPlan.image === "string"
					? floorPlan.image
					: URL.createObjectURL(floorPlan.image)
				: "",
		coordinates: coordinates
			? coordinates
			: floorPlan
				? floorPlan.coordinates
				: null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FloorPlanContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FloorPlan);

export default FloorPlanContainer;
