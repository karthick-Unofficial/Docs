import { connect } from "react-redux";
import FeedSharingPolicies from "./FeedSharingPolicies";
import * as actionCreators from "./feedSharingPoliciesActions";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const params = ownProps.location.pathname.split("/");
	const feedId = params[params.length - 1];
	const userOrgId = state.session.user.profile.orgId;
	const org = state.globalData.orgs[userOrgId];
	const chosenIntegration = org.integrations.find(int => int.feedId === feedId);
	const sharingTokensEnabled = state.appState.sharingTokens.enabled;
	const policies = {};
	let ecosystem = [];
	if (chosenIntegration) {

		const intId = chosenIntegration.feedId;
		const intOwnerOrg = chosenIntegration.feedOwnerOrg;
		let orgIds = Object.keys(state.globalData.orgs);

		// If sharing tokens are in use, filter only orgs that you have an active token with
		if (sharingTokensEnabled) {
			const orgSharingConnections = state.globalData.orgs[state.session.user.profile.orgId].sharingConnections;
			const sharedWithOrgs = orgSharingConnections
				.filter((conn) => {
					return conn.sourceOrg === state.session.user.profile.orgId;
				})
				.map((conn) => {
					return conn.targetOrg;
				});
			orgIds = orgIds.filter(id => sharedWithOrgs.includes(id));
		}
		ecosystem = orgIds
			.filter((orgId) => orgId !== state.session.user.profile.orgId && !state.globalData.orgs[orgId].disabled)
			.map((orgId) => state.globalData.orgs[orgId]);
		ecosystem.forEach((org) => {
			const integration = org.integrations.find((int) => { 
				// handle case where org integration is from a remote
				// strip @@targetEcoId so can match to feed
				const feedId = int.feedId.includes("@@") ? int.feedId.split("@@")[0] : int.feedId;
				return feedId === intId && int.feedOwnerOrg === intOwnerOrg; 
			});
			if (!integration) {
				return;
			}
			policies[org.orgId] = integration.policy || { enabled: false };
		});

	}
	return {
		chosenIntegration,
		ecosystem,
		policies,
		dir :  getDir(state),
		locale: state.i18n.locale
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

const FeedSharingPoliciesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FeedSharingPolicies);

export default FeedSharingPoliciesContainer;