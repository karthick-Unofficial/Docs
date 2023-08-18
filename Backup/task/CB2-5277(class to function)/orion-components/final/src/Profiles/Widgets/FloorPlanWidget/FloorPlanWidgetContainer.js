import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectedContextSelector } from "../../../ContextPanel/Selectors";
import * as actionCreators from "./floorPlanWidgetActions";
import FloorPlanWidget from "./FloorPlanWidget";

import { floorPlanSelector } from "orion-components/Map/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const context = selectedContextSelector(state);
	const { selectedFloor } = floorPlanSelector(state) || {};
	
	return {
		selectedFloor,
		subscriptions: context && context.subscriptions ? context.subscriptions.floorPlanCameras : null,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FloorPlanWidgetContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FloorPlanWidget);

export default FloorPlanWidgetContainer;
