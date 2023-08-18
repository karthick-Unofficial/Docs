import { connect } from "react-redux";
import EditUser from "./EditUser";
import { bindActionCreators } from "redux";
import * as actionCreators from "./editUserActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	// -- don't do anything until globalData is populated
	if (Object.keys(state.globalData.users).length === 0) return null;

	const userId = ownProps.params.id || state.session.user.profile.id;
	const user = state.globalData.users[userId] ? state.globalData.users[userId] : null;
	const passwordError = state.appState.errors.passwordChangeError;
	const isMyUser = userId === state.session.user.profile.id;
	const isAdmin = state.session.user.profile.admin;
	const isMyOrg = user && state.session.user.profile.orgId === user.orgId;
	const canEditThisUser = isMyUser || (isAdmin && isMyOrg && user && !user.admin);


	return {
		user,
		userId,
		passwordError,
		isMyUser,
		canEditThisUser,
		dir:  getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EditUserContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EditUser);

export default EditUserContainer;
