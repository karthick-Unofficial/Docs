import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./searchFormActions";
import SearchForm from "./SearchForm.jsx";
import {getDir} from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { type } = state.searchForm;
	const values = state.searchForm[type];
	const canSave = state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app")
		&& state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions
		&& state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions.includes("manage");
	return { type, values, canSave, dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SearchFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchForm);

export default SearchFormContainer;
