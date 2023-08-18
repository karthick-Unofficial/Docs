import { connect } from "react-redux";
import ManageOrganization from "./ManageOrganization";
import { bindActionCreators } from "redux";
import * as actionCreators from "./manageOrganizationActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {

	// Read url parameters to  determine if this is the viewing user's organization or not, and
	// retrieve correct id from state

	const orgId = ownProps.params.orgId ? ownProps.params.orgId : state.session.user.profile.orgId;
	const loggedInUserOrg = state.session.user.profile.orgId;
	const isMyOrg = (orgId === loggedInUserOrg);
	let canViewThisOrg = true;
	// const isEcoAdmin = (state.user.profile.ecoAdmin);
	const org = state.appState.viewing.selectedEntity.type === "org" ? state.globalData.orgs[state.appState.viewing.selectedEntity.id] : null;
	let orgMembers;
	const users = Object.keys(state.globalData.users);

	if (org) {
		orgMembers =
			users
				.map((key) => state.globalData.users[key])
				.filter((user) => user.orgId === org.orgId);
	}

	let canCreateNewOrganization;

	if (org) {
		// Only eco-admin can create new organization
		canCreateNewOrganization = (state.session.user.profile.ecoAdmin);
	}

	let isEcoAdmin;
	if (org) {
		// Only eco-admin can configure org admins
		isEcoAdmin = (state.session.user.profile.ecoAdmin);
	}

	if (org && !isMyOrg) {
		canViewThisOrg = false;
	}

	let canConfigureOrgUsers;
	if (org) {
		// Only eco-admin can create new organization
		canConfigureOrgUsers = (state.session.user.profile.admin);
	}

	// ---------------------------------------------------------------

	return {
		location: ownProps.location,
		isSubmitting: state.appState.loading["orgDetails"],
		isLoading: state.appState.loading["orgProfile"],
		confirmDialogIsOpen: state.appState.dialog.openDialog === "confirmDialog",
		user: state.session.user,
		orgs: state.globalData.orgs,
		org,
		isMyOrg,
		canViewThisOrg,
		orgId,
		loggedInUserOrg,
		orgMembers,
		canCreateNewOrganization,
		isEcoAdmin,
		canConfigureOrgUsers,
		dialog: state.appState.dialog.openDialog,
		sharingTokensEnabled: state.appState.sharingTokens.enabled,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir :  getDir(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};



const ManageOrganizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ManageOrganization);

export default ManageOrganizationContainer;