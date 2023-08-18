import { connect } from "react-redux";
import UserApps from "./UserApps";
import { bindActionCreators } from "redux";
import * as actionCreators from "./userAppsActions";

const mapStateToProps = (state) => {

	// Any admin can edit the integrations of any user
	const canAssignApplications = (state.session.user.profile.admin);
	const user = state.appState.viewing.selectedEntity.type === "user" ? state.globalData.users[state.appState.viewing.selectedEntity.id] : null;

	return {
		user,
		ecoApplications: state.globalData.orgs[user.orgId] ? state.globalData.orgs[user.orgId].applications : [],
		canAssignApplications,
		appsSaveState: state.appState.saveStates.appsSaveState

	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

const UserAppsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UserApps);

export default UserAppsContainer;