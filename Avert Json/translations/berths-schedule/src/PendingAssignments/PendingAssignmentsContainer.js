import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./pendingAssignmentsActions";
import PendingAssignments from "./PendingAssignments.jsx";
import { getScheduledPending, getPending } from "../selectors";

const mapStateToProps = state => {
	const { date, formPanel, session } = state;
	const pendingAssignments = getPending(state);
	const scheduled = getScheduledPending(state);
	const user = session.user.profile;
	const canEdit = user.applications && user.applications.find(app => app.appId === "berth-schedule-app") &&
		user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	return { data: formPanel.data, date, pendingAssignments, scheduled, canEdit };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const PendingAssignmentsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PendingAssignments);

export default PendingAssignmentsContainer;
