import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./spotlightToolActions.js";
import SpotlightTool from "./SpotlightTool";

const mapStateToProps = state => {
	const { baseMap, mapTools } = state.mapState;
	return {
		feature: mapTools.feature,
		map: baseMap.mapRef
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SpotlightToolContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SpotlightTool);

export default SpotlightToolContainer;
