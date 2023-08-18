import { connect } from "react-redux";
import UserIntegrations from "./UserIntegrations";
import { bindActionCreators } from "redux";
import * as actionCreators from "./userIntegrationsActions";
import _ from "lodash";

const mapStateToProps = state => {
	const userId = state.session.user.profile.id;
	const user =
		state.appState.viewing.selectedEntity.type === "user"
			? state.globalData.users[state.appState.viewing.selectedEntity.id]
			: null;
	// Any admin can edit the integrations of any user
	const canAssignIntegrations = state.session.user.profile.admin;
	const orgs = _.keyBy(state.globalData.orgs, "orgId");

	return {
		user,
		ecoIntegrations: state.globalData.integrations,
		integrationsSaveState: state.appState.saveStates.integrationsSaveState,
		canAssignIntegrations,
		userId,
		orgs
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const UserIntegrationsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UserIntegrations);

export default UserIntegrationsContainer;