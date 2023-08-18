import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IconButton } from "material-ui";
import { Button } from "@material-ui/core";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import LaunchIcon from "@material-ui/icons/Launch";
import CameraCard from "../Cameras/components/CameraCard";
import { Translate } from "orion-components/i18n/I18nContainer";

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
	selectWidget: () => {},
	unsubscribeFromFeed: () => {},
	addCameraToDockMode: () => {},
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

	useEffect(() => {
		return () => {
			const { id } = camera;
			if (!expanded) unsubscribeFromFeed(id, "liveCamera", subscriberRef);
		};
	}, []);


	const handleExpand = () => {
		selectWidget("Live Camera");
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
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						)}
						{widgetsLaunchable && (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
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
					handleCardExpand={() => {}}
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
