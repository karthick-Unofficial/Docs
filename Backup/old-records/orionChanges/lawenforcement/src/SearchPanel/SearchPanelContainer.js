import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./searchPanelActions";
import SearchPanel from "./SearchPanel.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { savedSearches } = state.appState.persisted;
	const canManage = state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app")
		&& state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions
		&& state.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions.includes("manage");
	return {
		savedSearches,
		canManage,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const SearchPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchPanel);

export default SearchPanelContainer;
