import React, { memo } from "react";
import PropTypes from "prop-types";
import { VideoPlayerWrapper } from "orion-components/CBComponents";
import { Button, Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import EmptySlot from "./EmptySlot/EmptySlot";
//import CameraControls from "./components/CameraControls";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { userCamerasSelector } from "orion-components/Dock/Cameras/selectors";

import { openDialog, closeDialog } from "./cameraSlotActions";
import { setCameraPriority } from "./cameraSlotActions";

import { removeFromWall } from "./cameraSlotActions";
import { removeFromGroup } from "./cameraSlotActions";

const propTypes = {
	index: PropTypes.string,
	gridHeight: PropTypes.number,
	id: PropTypes.object
};

const defaultProps = {
	index: null,
	gridHeight: null
};

const CameraSlot = (props) => {
	const { index, gridHeight } = props;

	const profile = useSelector((state) => state.session.user.profile);
	const dock = useSelector((state) => state.appState.dock);
	const persisted = useSelector((state) => state.appState.persisted);
	const Dialog = useSelector((state) => state.appState.dialog);
	const { selectedPinnedItem, selectedGroup } = persisted;
	const { cameras, stagedItem } = useSelector((state) => state.cameraWall);
	const id = props.id || cameras[props.index];
	const dialogKey = `camera-wall-${id}`;
	const { cameraPriority, dockedCameras } = dock.cameraDock;
	const modal = Dialog.openDialog === dialogKey || cameraPriority.modalOpen;
	const docked = cameraPriority.dockOpen && dockedCameras.includes(id);
	const camera = useSelector((state) => userCamerasSelector(state).find((cam) => cam.id === id));
	const user = useSelector((state) => state.session.user);
	const canManage =
		user.profile.applications &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app") &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions.includes("manage");
	const dialog = Dialog.openDialog;
	const groupId = selectedGroup ? selectedGroup.id : null;
	const readOnly = !!selectedPinnedItem || !!stagedItem;
	const dir = useSelector((state) => getDir(state));
	const dispatch = useDispatch();

	const handleRemove = () => {
		if (!groupId) {
			dispatch(removeFromWall(id, index));
		} else {
			dispatch(removeFromGroup(groupId, index));
		}
	};

	const handleOpenDialog = (dialogKey) => {
		dispatch(openDialog(dialogKey));
	};

	const handleCloseDialog = (dialogKey) => {
		dispatch(closeDialog(dialogKey));
	};

	const handleSetCameraPriority = (dockOpen, modalOpen) => {
		dispatch(setCameraPriority(dockOpen, modalOpen));
	};

	if (camera) {
		const { entityData } = camera;
		const canControl =
			profile.integrations &&
			profile.integrations.find((int) => int.intId === camera.feedId) &&
			profile.integrations.find((int) => int.intId === camera.feedId).permissions &&
			profile.integrations.find((int) => int.intId === camera.feedId).permissions.includes("control");

		return (
			<Card style={{ backgroundColor: "#1F1F21", height: gridHeight }}>
				<CardActions style={{ padding: 0, justifyContent: "space-between" }}>
					<Button
						color="primary"
						onClick={() => dispatch(openDialog(dialogKey))}
						style={{ textTransform: "none" }}
					>
						{entityData.properties.name}
					</Button>
					{!readOnly && canManage && (
						<IconButton onClick={handleRemove} style={{ padding: 8 }}>
							<Cancel />
						</IconButton>
					)}
				</CardActions>
				<CardContent
					style={{
						padding: 0,
						height: "calc(100% - 40px)"
					}}
				>
					<VideoPlayerWrapper
						camera={camera}
						canControl={canControl}
						closeDialog={handleCloseDialog}
						dialog={dialog}
						dialogKey={dialogKey}
						docked={docked}
						modal={modal}
						openDialog={handleOpenDialog}
						setCameraPriority={handleSetCameraPriority}
						fillAvailable={true}
						dir={dir}
						expanded={true}
					/>
				</CardContent>
				{/* <CameraControls camera={camera} canControl={canControl} /> */}
			</Card>
		);
	} else {
		return <EmptySlot gridHeight={gridHeight} groupId={groupId} index={index} readOnly={readOnly} />;
	}
};

CameraSlot.propTypes = propTypes;
CameraSlot.defaultProps = defaultProps;

export default memo(CameraSlot);
