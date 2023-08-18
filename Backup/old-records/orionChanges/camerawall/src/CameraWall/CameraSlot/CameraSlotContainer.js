import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraSlotActions";
import CameraSlot from "./CameraSlot";
import { userCamerasSelector } from "orion-components/Dock/Cameras/selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const { profile } = state.session.user;
	const { dialog, dock, persisted } = state.appState;
	const { selectedPinnedItem, selectedGroup } = persisted;
	const { cameras, stagedItem } = state.cameraWall;
	const id = ownProps.id || cameras[ownProps.index];
	const dialogKey = `camera-wall-${id}`;
	const { cameraPriority, dockedCameras } = dock.cameraDock;
	const modal = dialog.openDialog === dialogKey || cameraPriority.modalOpen;
	const docked = cameraPriority.dockOpen && dockedCameras.includes(id);
	const camera = userCamerasSelector(state).find((cam) => cam.id === id);
	const { user } = state.session;
	const canManage = user.profile.applications
		&& user.profile.applications.find(app => app.appId === "camera-wall-app")
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions
		&& user.profile.applications.find(app => app.appId === "camera-wall-app").permissions.includes("manage");
	return {
		camera,
		canManage,
		dialog: dialog.openDialog,
		dialogKey,
		docked,
		groupId: selectedGroup ? selectedGroup.id : null,
		id,
		modal,
		profile,
		readOnly: !!selectedPinnedItem || !!stagedItem,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraSlotContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CameraSlot);

export default CameraSlotContainer;
