import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { default as Expand } from '@mui/icons-material/ZoomOutMap';
import LaunchIcon from "@mui/icons-material/Launch";
import CameraCard from "../Cameras/components/CameraCard";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const propTypes = {
	camera: PropTypes.object.isRequired,
	expanded: PropTypes.bool,
	enabled: PropTypes.bool,
	dockedCameras: PropTypes.array,
	sidebarOpen: PropTypes.bool,
	canControl: PropTypes.bool,
	subscriberRef: PropTypes.string,
	selectWidget: PropTypes.func,
	unsubscribeFromFeed: PropTypes.func,
	addCameraToDockMode: PropTypes.func,
	widgetsExpandable: PropTypes.bool,
	order: PropTypes.number,
	selected: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	expanded: false,
	enabled: true,
	dockedCameras: [],
	sidebarOpen: false,
	subscriberRef: "profile",
	selectWidget: () => { },
	unsubscribeFromFeed: () => { },
	addCameraToDockMode: () => { },
	widgetsExpandable: false,
	order: 0,
	selected: false,
	dir: "ltr"
};

const LiveCameraWidget = ({
	camera,
	unsubscribeFromFeed,
	subscriberRef,
	expanded,
	selectWidget,
	contextId,
	entityType,
	selected,
	order,
	enabled,
	widgetsExpandable,
	widgetsLaunchable,
	sidebarOpen,
	dockedCameras,
	removeDockedCamera,
	canControl,
	dialog,
	openDialog,
	closeDialog,
	setCameraPriority,
	fullscreenCamera,
	addCameraToDockMode,
	readOnly,
	user,
	dir
}) => {
	const dispatch = useDispatch();

	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 })
		}
	};

	useEffect(() => {
		return () => {
			const { id } = camera;
			if (!expanded) dispatch(unsubscribeFromFeed(id, "liveCamera", subscriberRef));
		};
	}, []);


	const handleExpand = () => {
		dispatch(selectWidget("Live Camera"));
	};

	const handleLaunch = () => {
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/live-camera`);
		}
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div
			className={`widget-wrapper ${expanded ? "expanded" : "collapsed"
				} ${"index-" + order} `}
		>
			{!expanded && (
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.liveCam.title" /></div>
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton
									style={styles.widgetExpandButton}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						)}
						{widgetsLaunchable && (
							<div className="widget-expand-button">
								<IconButton
									style={styles.widgetExpandButton}
									onClick={handleLaunch}
								>
									<LaunchIcon />
								</IconButton>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="widget-content">
				<CameraCard
					contextId={contextId}
					cameraIndex={0}
					canUnlink={false}
					entityType={entityType}
					useCameraGeometry={false}
					geometry={null}
					loadProfile={null}
					unlinkCameras={null}
					camera={camera}
					canExpand={false}
					handleCardExpand={() => { }}
					canTarget={false}
					hasMenu={true}
					expanded={true}
					disableSlew={true}
					sidebarOpen={sidebarOpen}
					dockedCameras={dockedCameras}
					addCameraToDockMode={addCameraToDockMode}
					removeDockedCamera={removeDockedCamera}
					dialog={dialog}
					openDialog={openDialog}
					closeDialog={closeDialog}
					readOnly={readOnly}
					canControl={
						!readOnly &&
						user && user.integrations
						&& user.integrations.find(int => int.intId === camera.feedId)
						&& user.integrations.find(int => int.intId === camera.feedId).permissions
						&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control")
					}
					subscriberRef={subscriberRef}
					setCameraPriority={setCameraPriority}
					fullscreenCamera={fullscreenCamera}
					dir={dir}
				/>
			</div>
		</div>
	);
};

LiveCameraWidget.propTypes = propTypes;
LiveCameraWidget.defaultProps = defaultProps;

export default LiveCameraWidget;
