import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import CameraCard from "../Cameras/components/CameraCard";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { setCameraPriority } from "orion-components/Dock/Actions/index.js";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { fullscreenCameraOpen } from "orion-components/AppState/Selectors";

const propTypes = {
	camera: PropTypes.object.isRequired,
	expanded: PropTypes.bool,
	sidebarOpen: PropTypes.bool,
	subscriberRef: PropTypes.string,
	selectWidget: PropTypes.func,
	addCameraToDockMode: PropTypes.func,
	selected: PropTypes.bool,
	canControl: PropTypes.bool,
	id: PropTypes.string
};

const defaultProps = {
	expanded: false,
	sidebarOpen: false,
	subscriberRef: "profile",
	selectWidget: () => { },
	addCameraToDockMode: () => { },
	selected: false
};

const LiveCameraWidget = ({
	id,
	camera,
	subscriberRef,
	expanded,
	selectWidget,
	contextId,
	entityType,
	selected,
	sidebarOpen,
	removeDockedCamera,
	addCameraToDockMode,
	readOnly,
	canControl
}) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));

	const context = useSelector((state) => selectedContextSelector(state));
	const { entity } = context;
	const dialog = entity && useSelector((state) => state.appState?.dialog?.openDialog || "");
	const fullscreenCamera = useSelector((state) => entity && fullscreenCameraOpen(state));
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable, widgetsLaunchable } = launchableAndExpandable;

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
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
			{!expanded && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.liveCam.title" />
					</div>
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						)}
						{widgetsLaunchable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleLaunch}>
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
					addCameraToDockMode={addCameraToDockMode}
					removeDockedCamera={removeDockedCamera}
					dialog={dialog}
					readOnly={readOnly}
					canControl={canControl}
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
