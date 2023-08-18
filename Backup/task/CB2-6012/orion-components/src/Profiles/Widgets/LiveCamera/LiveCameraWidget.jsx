import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
import CameraCard from "../Cameras/components/CameraCard";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { setCameraPriority } from "orion-components/Dock/Actions/index.js";

import { getWidgetState, getSelectedContextData } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { addCameraToDockMode } from "orion-components/Dock/Actions/index.js";
import { removeDockedCamera } from "orion-components/Dock/Cameras/actions";

const propTypes = {
	expanded: PropTypes.bool,
	subscriberRef: PropTypes.string,
	selectWidget: PropTypes.func,
	selected: PropTypes.bool,
	canControl: PropTypes.bool,
	id: PropTypes.string,
	contextId: PropTypes.string,
	readOnly: PropTypes.bool,
	widgetsExpandable: PropTypes.bool
};

const defaultProps = {
	expanded: false,
	subscriberRef: "profile",
	selectWidget: () => { },
	selected: false,
	widgetsExpandable: false
};

const LiveCameraWidget = ({
	id,
	subscriberRef,
	expanded,
	selectWidget,
	contextId,
	selected,
	readOnly,
	canControl,
	widgetsExpandable
}) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));

	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || {};
	const { entityType } = entity || { entityType: "" };
	const dialog = entity && useSelector((state) => state.appState?.dialog?.openDialog || "");
	const fullscreenCamera = useSelector((state) => entity && fullscreenCameraOpen(state));
	const sidebarOpen = useSelector((state) => state?.appState?.dock?.dockData?.isOpen) || false;

	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 })
		}
	};

	useEffect(() => {
		return () => {
			const { id } = entity;
			if (!expanded) dispatch(unsubscribeFromFeed(id, "liveCamera", subscriberRef));
		};
	}, []);

	const handleExpand = () => {
		dispatch(selectWidget(id));
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
					camera={entity}
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
