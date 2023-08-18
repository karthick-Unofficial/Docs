import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthToolbarActions";
import BerthToolbar from "./BerthToolbar.jsx";
const mapStateToProps = state => {
	const { assignments, map, view, session, clientConfig } = state;
	const { mapFeedIds, mapInclusionZone } = clientConfig;
	const user = session.user.profile;
	const canEdit = user.applications && user.applications.find(app => app.appId === "berth-schedule-app") &&
		user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	return {
		assignments: Object.values(assignments.allAssignments),
		map,
		view,
		canEdit,
		mapFeedIds,
		mapInclusionZone
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthToolbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthToolbar);

export default BerthToolbarContainer;
