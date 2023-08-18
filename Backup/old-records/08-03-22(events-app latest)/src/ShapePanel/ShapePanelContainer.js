import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./shapePanelActions.js";
import ShapePanel from "./ShapePanel";
import {
	primaryContextSelector,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const context = selectedContextSelector(state);
	const { contextualData, mapState } = state;
	const { mapTools, baseMap } = mapState;
	const primaryId = primaryContextSelector(state);
	const primary = contextualData[primaryId];
	let event;

	if (primary && primary.entity) {
		const { entity } = primary;
		event = entity;
	}
	return {
		event,
		editing: context && context.entity && context.entity.id !== primaryId,
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
