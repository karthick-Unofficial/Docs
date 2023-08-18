import { connect } from "react-redux";
import EditOrgProfile from "./EditOrgProfile";
import { bindActionCreators } from "redux";
import * as actionCreators from "./editOrgProfileActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {

	const org = state.globalData.orgs[state.session.user.profile.orgId];

	// ---------------------------------------------------------------

	return {
		org,
		dir: getDir(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};



const EditOrgProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EditOrgProfile);

export default EditOrgProfileContainer;