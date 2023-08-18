import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./distanceChipsActions.js";
import DistanceChips from "./DistanceChips";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { distanceTool } = state.mapState;

	return {
		distanceTool,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const DistanceChipsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(DistanceChips);

export default DistanceChipsContainer;
