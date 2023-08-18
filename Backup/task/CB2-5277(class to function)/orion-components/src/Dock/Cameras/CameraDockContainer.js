import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions";
import CamerasDock from "./CameraDock";

import { cameraDockSelector, dockDataSelector, dockedCamerasSelector } from "./selectors";
import { mapState, fullscreenCameraOpen } from "../../AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state) => {
	const user = state.session.user.profile;
	const cameraDock = cameraDockSelector(state);
	const dockData = dockDataSelector(state);
	const cameraView = mapState(state);
	const dialog = state.appState.dialog.openDialog || "";
	const hasProfile = !!state.appState.contextPanel;
	// Check which org created camera

	const permissions = {};

	const camerasInt = user.integrations.filter(int => int.intId === "cameras")[0];
	if (camerasInt && camerasInt.permissions) {
		permissions.canControl = camerasInt.permissions.includes("control");
	}

	return {
		userCameras: cameraDock.userCameras,
		dockedCameras: dockedCamerasSelector(state),
		cameraView: cameraView ? cameraView.visible : false,
		cameraPriority: cameraDock.cameraPriority,
		sidebarOpen: dockData.isOpen,
		user,
		findNearestMode: cameraDock.findNearestMode,
		findNearestPosition: cameraDock.findNearestPosition,
		cameraReplaceMode: cameraDock.cameraReplaceMode,
		permissions,
		dialog,
		hasProfile,
		fullscreenCameraOpen: fullscreenCameraOpen(state),
		dir: getDir(state)
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
}; 

const CamerasDockContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CamerasDock);

export default CamerasDockContainer;