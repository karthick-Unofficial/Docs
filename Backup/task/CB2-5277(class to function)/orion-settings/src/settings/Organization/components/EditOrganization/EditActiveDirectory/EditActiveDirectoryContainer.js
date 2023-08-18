import { connect } from "react-redux";
import EditActiveDirectory from "./EditActiveDirectory";
import { bindActionCreators } from "redux";
import * as actionCreators from "./editActiveDirectoryActions";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const org = state.session.user.profile.orgId;
	// ---------------------------------------------------------------

	return {
		org,
		dir: getDir(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
};



const EditActiveDirectoryContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EditActiveDirectory);

export default EditActiveDirectoryContainer;