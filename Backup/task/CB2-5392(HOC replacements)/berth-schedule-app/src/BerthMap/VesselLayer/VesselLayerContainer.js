import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./vesselLayerActions";
import VesselLayer from "./VesselLayer.jsx";
const mapStateToProps = state => {
	const { vessels } = state.map;
	return { vessels };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const VesselLayerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(VesselLayer);

export default VesselLayerContainer;
