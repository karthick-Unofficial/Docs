import { connect } from "react-redux";
import ManageFeedSharingPolicies from "./ManageFeedSharingPolicies";
import * as actionCreators from "./manageFeedSharingPoliciesActions";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const userOrgId = state.session.user.profile.orgId;
	const org = state.globalData.orgs[userOrgId];
	return {
		integrations: org ? org.integrations : [],
		orgId: org ? org.orgId : "",
		dir :  getDir(state)
	};
	
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

const ManageFeedSharingPoliciesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ManageFeedSharingPolicies);

export default ManageFeedSharingPoliciesContainer;