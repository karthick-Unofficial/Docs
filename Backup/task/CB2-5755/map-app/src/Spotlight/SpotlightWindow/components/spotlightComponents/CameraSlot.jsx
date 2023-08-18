import React from "react";
import PropTypes from "prop-types";
import { Button, Card, CardActions, CardContent } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { VideoPlayerWrapper } from "orion-components/CBComponents";

const propTypes = {
	user: PropTypes.object.isRequired,
	camerasAndSlots: PropTypes.array.isRequired,
	isEmpty: PropTypes.bool.isRequired,
	sendMessage: PropTypes.func.isRequired,
	gridHeight: PropTypes.number,
	camera: PropTypes.object
};

const defaultProps = {
	user: {},
	camerasAndSlots: [],
	isEmpty: true,
	sendMessage: () => {},
	gridHeight: null
};

const styles = {
	emptySlot: {
		border: "2px dashed #41454a"
	},
	card: {
		backgroundColor: "#000"
	},
	cardActions: {
		backgroundColor: "#1F1F21",
		padding: 0,
		justifyContent: "space-between"
	}
};

const CameraSlot = ({ user, camera, isEmpty, gridHeight, sendMessage }) => {
	const emptySlot = (
		<div
			style={{
				...styles.emptySlot,
				height: gridHeight ? gridHeight : ""
			}}
		/>
	);

	const canControlCamera = !!(
		user.integrations &&
		camera &&
		user.integrations.find((int) => int.intId === camera.feedId) &&
		user.integrations.find((int) => int.intId === camera.feedId)
			.permissions &&
		user.integrations
			.find((int) => int.intId === camera.feedId)
			.permissions.includes("control")
	);

	return isEmpty ? (
		emptySlot
	) : (
		<Card
			style={{
				...styles.card,
				height: gridHeight ? gridHeight : ""
			}}
		>
			<CardActions style={styles.cardActions}>
				<p style={{ marginLeft: "10px" }}>
					{camera.entityData.properties.name}
				</p>
				<Button
					onClick={() => sendMessage({ selectedCamera: camera.id })}
					style={{ padding: "12px", color: "rgba(255,255,255, 0.3)" }}
				>
					<Visibility />
				</Button>
			</CardActions>
			<CardContent style={{ padding: 0, height: "calc(100% - 48px)" }}>
				{/* Min-height is causing bugs here */}
				<VideoPlayerWrapper
					key={camera.id}
					camera={camera}
					canControl={canControlCamera}
					dialogKey={"no-dialog"}
					docked={false}
					modal={false}
					expanded={true}
					fillAvailable={true}
				/>
			</CardContent>
		</Card>
	);
};

CameraSlot.propTypes = propTypes;
CameraSlot.defaultProps = defaultProps;

export default CameraSlot;
