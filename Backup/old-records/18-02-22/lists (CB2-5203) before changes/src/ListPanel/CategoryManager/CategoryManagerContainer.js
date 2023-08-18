import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./categoryManagerActions";

import CategoryManager from "./CategoryManager";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const dialog = state.appState.dialog.openDialog;
	const categories = state.globalData.listCategories.data;
	const user = state.session.user.profile;
	return { categories, dialog, user, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CategoryManagerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryManager);

export default CategoryManagerContainer;
