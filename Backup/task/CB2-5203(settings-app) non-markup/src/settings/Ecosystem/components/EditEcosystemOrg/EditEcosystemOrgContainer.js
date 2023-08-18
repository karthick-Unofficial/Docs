import { connect } from "react-redux";
import EditEcosystemOrg from "./EditEcosystemOrg";
import * as actionCreators from "./editEcosystemOrgActions";
import { bindActionCreators } from "redux";
import _ from "lodash";
// Utility
import { getLastName } from "../../../utility";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const orgId = ownProps.params.orgId;
	const org = state.globalData.orgs[orgId];
	const ecoApps = state.globalData.apps;
	const orgApplicationsById = org && org.applications ? org.applications.map(app => app.appId) : [];
	// Get all admins in the ecosystem that aren't disabled and alphabetize
	const users = Object.keys(state.globalData.users);
	const orgAdmins = users
		.map(key => state.globalData.users[key])
		.filter(user => {
			return user.admin === true && user.disabled !== true && user.orgId === orgId;
		})
		.sort((a, b) => {
			if (
				getLastName(a.name.toUpperCase()) > getLastName(b.name.toUpperCase())
			) {
				return 1;
			} else if (
				getLastName(a.name.toUpperCase()) < getLastName(b.name.toUpperCase())
			) {
				return -1;
			} else {
				return 0;
			}
		});
	return {
		ecoApps,
		org,
		orgAdmins,
		orgApplicationsById,
		dir :  getDir(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};

const EditEcosystemOrgContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EditEcosystemOrg);

export default EditEcosystemOrgContainer;