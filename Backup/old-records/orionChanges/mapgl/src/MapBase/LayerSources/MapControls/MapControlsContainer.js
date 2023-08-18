import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./mapControlsActions.js";
import MapControls from "./MapControls";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { mapState } = state;
	const { distanceTool, mapTools } = mapState;
	const { dockData } = state.appState.dock;
	const canCreateShapes = state.session.user.profile.integrations &&
		state.session.user.profile.integrations.find(int => int.intId === state.session.user.profile.orgId + "_shapes") &&
		state.session.user.profile.integrations.find(int => int.intId === state.session.user.profile.orgId + "_shapes").permissions &&
		state.session.user.profile.integrations.find(int => int.intId === state.session.user.profile.orgId + "_shapes").permissions.includes("manage");
	return {
		canCreateShapes,
		mapTools,
		activePath: distanceTool.activePath,
		dockOpen: dockData.isOpen,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const MapControlsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapControls);

export default MapControlsContainer;
