import React from "react";
import { cameraService } from "client-app-core";
import PropTypes from "prop-types";
import {
	Typography,
	IconButton,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Dialog
	// Switch
} from "@mui/material";
import { Close } from "@mui/icons-material";
// import { withStyles } from "@mui/material/styles";
import PTZControls from "../../../Profiles/Widgets/PTZControls/PTZ-controls";
import LradControls from "../../../Profiles/Widgets/LradControls/LradControls";
import { useDispatch } from "react-redux";

// const CBSwitch = withStyles({
// 	switchBase: {
// 	  "&$checked": {
// 			color: "#29B6F6"
// 	  },
// 	  "&$checked + $track": {
// 			backgroundColor: "#84D5FA"
// 	  }
// 	},
// 	checked: {},
// 	track: {}
// })(Switch);

const propTypes = {
	camera: PropTypes.shape({
		id: PropTypes.string.isRequired,
		player: PropTypes.shape({
			type: PropTypes.string.isRequired,
			url: PropTypes.string
		})
	}).isRequired,
	dialogKey: PropTypes.string,
	canControl: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	camera: { player: { url: null } },
	dialogKey: "",
	canControl: false,
	dir: "ltr"
};

const FullscreenVideoModal = ({
	closeDialog,
	dialogKey,
	setCameraPriority,
	camera,
	dialog,
	canControl,
	children,
	dir
}) => {
	const dispatch = useDispatch();

	const closeFullscreen = () => {
		dispatch(setCameraPriority(null, false));
		dispatch(closeDialog(dialogKey));
	};

	const execFeatureCommand = (cmd) => {
		cameraService.sendAuxCmd(camera.id, cmd);
	};

	const hasCapability = (capability) => {
		return camera.entityData.properties.features && camera.entityData.properties.features.includes(capability);
	};

	// handleToggle = (e, name) => {
	// 	this.setState({ [name]: e.target.checked });
	// };

	const cameraFeatures = camera.entityData.properties.features || null;
	const buttonFeatures = cameraFeatures
		? cameraFeatures.filter((feat) => {
				return typeof feat === "object" && feat.type === "button";
		  })
		: null;

	const styles = {
		dialog: {
			backgroundColor: "rgb(44, 45, 47)"
		},
		header: {
			width: "100%",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			backgroundColor: "rgb(44, 45, 47)"
		},
		typography: {
			color: "#fff",
			...(dir === "ltr" && { paddingLeft: 12 }),
			...(dir === "rtl" && { paddingRight: 12 })
		},
		buttonFeatures: {
			width: 240,
			height: "100%",
			position: "relative",
			...(dir === "ltr" && { marginLeft: 90 }),
			...(dir === "rtl" && { marginRight: 90 })
		}
	};

	return (
		<Dialog fullScreen key={dialogKey} open={dialog === dialogKey} PaperProps={{ style: styles.dialog }}>
			<div style={styles.header}>
				<Typography style={styles.typography} color="textPrimary" variant="subtitle1">
					{camera.entityData.properties.name}
				</Typography>
				<IconButton onClick={closeFullscreen}>
					<Close style={{ color: "#FFF" }} />
				</IconButton>
			</div>
			<div
				style={{
					height: "calc(100vh - 48px)",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden"
				}}
			>
				{children}
				{canControl && hasCapability("control") && !hasCapability("ribbon") && (
					<div
						style={{
							flexGrow: 1,
							width: "100%",
							height: "clamp(30%, 35%, 40%)"
						}}
					>
						<div className="expanded-camera-ptz-wrapper">
							{buttonFeatures && buttonFeatures.length > 0 && (
								<div style={styles.buttonFeatures}>
									<List
										style={{
											width: "100%",
											position: "absolute",
											top: "50%",
											transform: "translateY(-50%)"
										}}
									>
										{/* <ListItem style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16}}>
												<ListItemText id="wipers-switch" primary="Wipers On/Off" />
												<ListItemSecondaryAction>
													<CBSwitch
														edge="end"
														onChange={e => this.handleToggle(e, "wipers")}
														checked={wipers}
														inputProps={{ "aria-labelledby": "wipers-switch" }}
													/>
												</ListItemSecondaryAction>
											</ListItem> */}
										{buttonFeatures.map((feat, index) => (
											<ListItem
												button
												style={{
													paddingTop: 8,
													paddingBottom: 8,
													paddingLeft: 16,
													paddingRight: 16
												}}
												key={`button-features-${index}`}
											>
												<ListItemText primary={feat.label} />
												<ListItemSecondaryAction
													onClick={() => execFeatureCommand(feat.auxCmd)}
												>
													<Button
														size="small"
														style={{
															height: "22px",
															backgroundColor: "#4DB5F4",
															color: "#FFF"
														}}
													>
														{feat.buttonLabel || " "}
													</Button>
												</ListItemSecondaryAction>
											</ListItem>
										))}
									</List>
								</div>
							)}
							{hasCapability("lrad") && <LradControls camera={camera} dir={dir} />}
							<div>
								<PTZControls dock={true} camera={camera} />
							</div>
						</div>
					</div>
				)}
			</div>
		</Dialog>
	);
};

FullscreenVideoModal.propTypes = propTypes;
FullscreenVideoModal.defaultProps = defaultProps;

export default FullscreenVideoModal;
