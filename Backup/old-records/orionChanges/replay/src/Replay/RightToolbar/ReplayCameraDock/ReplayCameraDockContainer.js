import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./replayCameraDockActions";
import ReplayCameraDock from "./ReplayCameraDock";

import { cameraDockSelector, dockedCamerasSelector } from "./selectors";

const mapStateToProps = (state) => {
	const user = state.session.user.profile;

	// -- grab cameras available from map
	const cameraIntIds = user.integrations.filter(int => int.entityType === "camera").map(int => int.intId);
	let userCameras = [];
	if (state.appState.replayMapRef.entities) {
		cameraIntIds.forEach(intId => {
			if (state.appState.replayMapRef.entities[intId]) {
				const cameras = Object.keys(state.appState.replayMapRef.entities[intId]).map(key => state.appState.replayMapRef.entities[intId][key]);
				userCameras.push(...cameras.filter(camera => !!camera.cameraReplaySystem));
			}
		});
	}

	const audioVideoDock = cameraDockSelector(state);
	const { findNearestMode, findNearestPosition, cameraReplaceMode, cameraPriority, currentMedia } = audioVideoDock;
	const { replayMapRef } = state.appState;
	const mapRef = replayMapRef ? replayMapRef.mapObject : null;
	const cameraView = replayMapRef ? replayMapRef.visible : null;
	const dialog = state.appState.dialog.openDialog || "";
	const hasProfile = !!state.appState.contextPanel;
	const { playBarValue, playing } = state.playBar;
	const { clientConfig } = state;

	const permissions = {};

	const camerasInt = user.integrations.filter(int => int.intId === "cameras")[0];
	if (camerasInt && camerasInt.permissions) {
		permissions.canControl = camerasInt.permissions.includes("control");
	}

	return {
		userCameras,
		dockedCameras: dockedCamerasSelector(state),
		cameraView,
		user,
		mapRef,
		findNearestMode,
		findNearestPosition,
		cameraReplaceMode,
		permissions,
		dialog,
		hasProfile,
		fullscreenCameraOpen: cameraPriority.modalOpen,
		currentMedia,
		playBarValue,
		playing,
		eventideEndpoint: clientConfig.eventideEndpoint
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators(actionCreators, dispatch);
}; 

const ReplayCameraDockContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ReplayCameraDock);

export default ReplayCameraDockContainer;