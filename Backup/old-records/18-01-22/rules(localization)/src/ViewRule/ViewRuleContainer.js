import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import * as actionCreators from "./viewRuleActions";
import ViewRule from "./ViewRule";

const mapStateToProps = (state) => {

	const rules = Object.keys(state.globalData.rules).map((key) => {
		return state.globalData.rules[key];
	});

	const collections = Object.keys(state.globalData.collections).map((key) => {
		return state.globalData.collections[key];
	});
	const user = state.session.user.profile;
	const canManage = user.applications
		&& user.applications.find(app => app.appId === "rules-app")
		&& user.applications.find(app => app.appId === "rules-app").permissions
		&& user.applications.find(app => app.appId === "rules-app").permissions.includes("manage");
	return {
		canManage,
		rules,
		user: state.session.user,
		userId: state.session.user.profile.id,
		orgUsers: state.globalData.org.orgUsers,
		collections,
		isOpen: state.appState.dialog.openDialog,
		timeFormatPreference: state.appState.global.timeFormat,
		WavCamOpen: state.appState.dock.dockData.WavCam
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ ...actionCreators, openDialog, closeDialog }, dispatch);
}

const ViewRuleContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewRule);

export default ViewRuleContainer;