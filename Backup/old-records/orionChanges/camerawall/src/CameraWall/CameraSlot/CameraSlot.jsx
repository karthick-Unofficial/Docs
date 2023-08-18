import React, { memo } from "react";
import PropTypes from "prop-types";
import { VideoPlayerWrapper } from "orion-components/CBComponents";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { default as EmptySlot } from "./EmptySlot/EmptySlotContainer";
import CameraControls from "./components/CameraControls";

const propTypes = {
	camera: PropTypes.object,
	canManage: PropTypes.bool,
	closeDialog: PropTypes.func.isRequired,
	dialog: PropTypes.string,
	dialogKey: PropTypes.string,
	docked: PropTypes.bool,
	groupId: PropTypes.string,
	id: PropTypes.string,
	index: PropTypes.string,
	modal: PropTypes.bool,
	openDialog: PropTypes.func.isRequired,
	gridHeight: PropTypes.number,
	profile: PropTypes.object.isRequired,
	removeFromWall: PropTypes.func.isRequired,
	readOnly: PropTypes.bool,
	setCameraPriority: PropTypes.func.isRequired,
	removeFromGroup: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	camera: null,
	dialog: null,
	dialogKey: "",
	docked: false,
	groupId: null,
	id: null,
	index: null,
	modal: false,
	gridHeight: null,
	readOnly: false,
	dir: "ltr"
};

const CameraSlot = ({
	camera,
	canManage, 
	closeDialog,
	dialog,
	dialogKey,
	docked,
	groupId,
	id,
	index,
	modal,
	openDialog,
	gridHeight,
	profile,
	readOnly,
	removeFromWall,
	setCameraPriority,
	removeFromGroup,
	dir
}) => {
	const handleRemove = () => {
		if (!groupId) {
			removeFromWall(id, index);
		} else {
			removeFromGroup(groupId, index);
		}
	};
	if (camera) {
		const { entityData } = camera;
		const canControl = profile.integrations 
		&& profile.integrations.find(int => int.intId === camera.feedId)
			&& profile.integrations.find(int => int.intId === camera.feedId).permissions
			&& profile.integrations.find(int => int.intId === camera.feedId).permissions.includes("control");

			
		return (
			<Card style={{ backgroundColor: "#1F1F21" }}>
				<CardActions style={{ padding: 0, justifyContent: "space-between" }}>
					<Button
						color="primary"
						onClick={() => openDialog(dialogKey)}
						style={{ textTransform: "none" }}
					>
						{entityData.properties.name}
					</Button>
					{!readOnly && canManage && (
						<IconButton onClick={handleRemove}>
							<Cancel />
						</IconButton>
					)}
				</CardActions>
				<CardContent
					style={{
						padding: 0
					}}
				>
					<VideoPlayerWrapper
						camera={camera}
						canControl={canControl}
						closeDialog={closeDialog}
						dialog={dialog}
						dialogKey={dialogKey}
						docked={docked}
						modal={modal}
						openDialog={openDialog}
						setCameraPriority={setCameraPriority}
						fillAvailable={true}
						dir={dir}
					/>
				</CardContent>
				<CameraControls camera={camera} canControl={canControl} />
			</Card>
		);
	} else {
		return (
			<EmptySlot
				gridHeight={gridHeight}
				groupId={groupId}
				index={index}
				readOnly={readOnly}
			/>
		);
	}
};
CameraSlot.propTypes = propTypes;
CameraSlot.defaultProps = defaultProps;

export default memo(CameraSlot);
