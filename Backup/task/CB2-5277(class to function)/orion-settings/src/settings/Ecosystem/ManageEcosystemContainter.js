// list of org app permissions

import { connect } from "react-redux";
import ManageEcosystem from "./ManageEcosystem";
import { bindActionCreators } from "redux";
import * as actionCreators from "./manageEcosystemActions";
import { getDir } from "orion-components/i18n/Config/selector";

// Utility
import { getLastName } from "../utility";

const mapStateToProps = state => {
	const orgs = Object.values(state.globalData.orgs);

	return {
		orgs,
		user: state.session.user,
		userOrgId: state.session.user.profile.orgId,
		sharingTokensEnabled: state.appState.sharingTokens.enabled,
		createOrgError: state.appState.errors.createOrgError,
		dialog: state.appState.dialog.openDialog,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ManageEcosystemContainer = connect(mapStateToProps, mapDispatchToProps)(
	ManageEcosystem
);

export default ManageEcosystemContainer;
