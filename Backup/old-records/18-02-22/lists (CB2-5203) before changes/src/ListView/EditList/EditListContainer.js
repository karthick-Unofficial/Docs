import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./editListActions";
import { getDir } from "orion-components/i18n/Config/selector";

import EditList from "./EditList";

const mapStateToProps = state => {
	const dialog = state.appState.dialog.openDialog;
	const user = state.session.user.profile;
	const categories = state.globalData.listCategories.data;

	return { dialog, categories, user, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EditListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EditList);

export default EditListContainer;
