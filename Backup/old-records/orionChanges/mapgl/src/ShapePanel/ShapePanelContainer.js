import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./shapePanelActions.js";
import ShapePanel from "./ShapePanel";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { mapTools, baseMap } = state.mapState;
	const context = selectedContextSelector(state);
	
	return {
		editing: context && context.entity && context.entity.entityType === "shapes" && mapTools.mode && !mapTools.mode.includes("draw_"),
		mapTools,
		baseMap,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ShapePanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ShapePanel);

export default ShapePanelContainer;
