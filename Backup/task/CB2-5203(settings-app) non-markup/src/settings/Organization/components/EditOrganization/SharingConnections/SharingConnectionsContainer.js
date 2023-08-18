import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./sharingConnectionsActions";
import SharingConnections from "./SharingConnections";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state) => {
	const userOrgId = state.session.user.profile.orgId;
	const org = state.globalData.orgs[userOrgId];
	return {
		organization: org,
		dir :  getDir(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

const SharingConnectionsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SharingConnections);

export default SharingConnectionsContainer;