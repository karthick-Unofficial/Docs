import { connect } from "react-redux";
import UserAccount from "./UserAccount";
import { bindActionCreators } from "redux";
import * as actionCreators from "./userAccountActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	// -- don't do anything until globalData is populated
	if (Object.keys(state.globalData.users).length === 0) return null;

	// Read url parameters to  determine if this is the viewing user's profile or not, and
	// retrieve correct id from state
	const username = ownProps.params.id || state.session.user.profile.id;
	const user = username ? state.globalData.users[username] :
		(state.appState.viewing.selectedEntity.type === "user" ?
			state.globalData.users[state.appState.viewing.selectedEntity.id] : null);
	const isMyUser = username === state.session.user.profile.id;
	const isAdmin = state.session.user.profile.admin;
	const isMyOrg = user && state.session.user.profile.orgId === user.orgId;
	const org = user ? state.globalData.orgs[user.orgId] : null;

	// Only users in the same organization can view each other
	const canViewThisUser = isMyUser || (isAdmin && isMyOrg);
	const canEditThisUser = isMyUser || (isAdmin && isMyOrg && user && !user.admin);
	// ------------------------------------------------------
	const globalState = state.appState.global;
	return {
		canViewThisUser,
		canEditThisUser,
		globalState,
		isMyUser,
		org,
		user,
		username,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const UserAccountContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UserAccount);

export default UserAccountContainer;
