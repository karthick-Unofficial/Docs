import { connect } from "react-redux";
import ManageUserRoles from "./ManageUserRoles";
import { bindActionCreators } from "redux";
import * as actionCreators from "./manageUserRolesActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state) => {
	const org = state.globalData.orgs[state.session.user.profile.orgId];
	let orgMembers;
	const users = Object.keys(state.globalData.users);

	if (org) {
		orgMembers =
			users
				.map((key) => state.globalData.users[key])
				.filter((user) => user.orgId === org.orgId);
	}
	return {
		members: orgMembers,
		user: state.session.user,
		org,
		dialog: state.appState.dialog.openDialog,
		orgRoles: org ? org.roles : [], 
		orgId: org ? org.orgId : "",
		dir: getDir(state)

	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

const ManageUserRolesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ManageUserRoles);

export default ManageUserRolesContainer;