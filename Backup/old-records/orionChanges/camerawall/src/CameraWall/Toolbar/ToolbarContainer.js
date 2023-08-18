import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./toolbarActions";
import Toolbar from "./Toolbar";

const mapStateToProps = state => {
	const {
		selectedGroup,
		selectedPinnedItem,
		pinnedItems
	} = state.appState.persisted;
	const { user } = state.session;
	const { cameras, stagedItem } = state.cameraWall;
	const canManage = user.profile.applications
		&& user.profile.applications.find(app => app.appId === "camera-wall-app")
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions.includes("manage");
	return {
		cameras,
		canManage,
		pinnedItems,
		selectedGroup,
		selectedPinnedItem,
		stagedItem
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ToolbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Toolbar);

export default ToolbarContainer;
