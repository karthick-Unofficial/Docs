import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./savedSearchActions";
import SavedSearch from "./SavedSearch";

const mapStateToProps = (state, ownProps) => {
	const { selected } = state.searchForm;
	const canManage = state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app")
		&& state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions
		&& state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions.includes("manage");
	return {
		selected: Boolean(selected === ownProps.id),
		canManage,
		timeFormatPreference: state.appState.global.timeFormat
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SavedSearchContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SavedSearch);

export default SavedSearchContainer;
