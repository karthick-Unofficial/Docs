import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./listPanelActions";
import ListPanel from "./ListPanel";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { cameraGroups } = state.globalData;
	const { user } = state.session;
	const { pinnedItems } = state.appState.persisted;
	const { widgetLaunchData } = state.cameraWall;
	const canManage = user.profile.applications 
		&& user.profile.applications.find(app => app.appId === "camera-wall-app")
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions.includes("manage");
	return { 
		groups: cameraGroups, 
		pinnedItems,
		widgetLaunchData,
		canManage,
		dir: getDir(state)
	 };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ListPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListPanel);

export default ListPanelContainer;
