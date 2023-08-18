import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./drawingToolActions.js";
import DrawingTool from "./DrawingTool";

const mapStateToProps = state => {
	const { baseMap, mapTools } = state.mapState;
	const { feature, mode } = mapTools;
	return {
		feature,
		map: baseMap.mapRef,
		mode
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const DrawingToolContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DrawingTool);

export default DrawingToolContainer;
