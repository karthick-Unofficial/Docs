import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./createListActions";
import { getDir } from "orion-components/i18n/Config/selector";

import CreateList from "./CreateList";

const mapStateToProps = state => {
	const dialog = state.appState.dialog.openDialog;
	const user = state.session.user.profile;
	const categories = state.globalData.listCategories.data;
	const canManageCategories = user && user.applications.find(app => app.appId === "lists-app")
		&& user.applications.find(app => app.appId === "lists-app").permissions
		&& user.applications.find(app => app.appId === "lists-app").permissions.includes("manage");
	return { categories, dialog, canManageCategories, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CreateListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateList);

export default CreateListContainer;
