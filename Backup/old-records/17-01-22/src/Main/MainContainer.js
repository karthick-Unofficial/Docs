import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import * as actionCreators from "./mainActions";
import Main from "./Main";

const mapStateToProps = (state) => {

	const canCreateVesselEventRule = state.session.user.profile.applications.some(application => {
		return application.appId === "berth-schedule-app";
	});
	const rules = Object.keys(state.globalData.rules).map((key) => {
		return state.globalData.rules[key];
	});
	const user = state.session.user.profile;
	const canManage = user.applications
		&& user.applications.find(app => app.appId === "rules-app")
		&& user.applications.find(app => app.appId === "rules-app").permissions
		&& user.applications.find(app => app.appId === "rules-app").permissions.includes("manage");

	return {
		rules,
		canManage,
		userId: state.session.user.profile.id,
		orgUsers: state.globalData.org.orgUsers,
		filterTriggerExit: state.appState.indexPage.filterTriggerExit,
		filterTriggerEnter: state.appState.indexPage.filterTriggerEnter,
		filterTriggerCross: state.appState.indexPage.filterTriggerCross,
		filterTriggerSystemHealth: state.appState.indexPage.filterTriggerSystemHealth,
		filterTriggerLoiter: state.appState.indexPage.filterTriggerLoiter,
		filterTriggerNewRequest: state.appState.indexPage.filterTriggerNewRequest,
		filterTriggerRequestApproval: state.appState.indexPage.filterTriggerRequestApproval,
		filterTriggerBerthUpdates: state.appState.indexPage.filterTriggerBerthUpdates,
		filterTriggerArrivals: state.appState.indexPage.filterTriggerArrivals,
		filterTriggerDepartures: state.appState.indexPage.filterTriggerDepartures,
		filterTriggerSecurityViolations: state.appState.indexPage.filterTriggerSecurityViolations,
		typeAheadFilter: state.appState.indexPage.typeAheadFilter,
		canCreateVesselEventRule,
		isOpen: state.appState.dialog.openDialog
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ ...actionCreators, openDialog, closeDialog }, dispatch);
}

const MainContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);

export default MainContainer;