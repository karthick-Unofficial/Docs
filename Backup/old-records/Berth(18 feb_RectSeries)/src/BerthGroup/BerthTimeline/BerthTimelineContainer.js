import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthTimelineActions";
import BerthTimeline from "./BerthTimeline.jsx";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	getTimelineAssignmentsByBerth,
	getBerthsByGroup
} from "../../selectors";

const mapStateToProps = (state, ownProps) => {
	const { date, formPanel } = state;
	const berths = getBerthsByGroup(state, ownProps);
	const assignments = getTimelineAssignmentsByBerth(state, ownProps);
	return {
		assignments,
		berths,
		selectedId: formPanel.data.id,
		date,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthTimelineContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthTimeline);

export default BerthTimelineContainer;
