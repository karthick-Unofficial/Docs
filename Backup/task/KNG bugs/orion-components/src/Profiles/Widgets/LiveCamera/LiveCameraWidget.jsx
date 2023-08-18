import React, { Component } from "react";
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

class LiveCameraWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillUnmount() {
		const { camera, unsubscribeFromFeed, subscriberRef, expanded } = this.props;
		const { id } = camera;
		if (!expanded) unsubscribeFromFeed(id, "liveCamera", subscriberRef);
	}

	handleExpand = () => {
		this.props.selectWidget("Live Camera");
	};

	handleLaunch = () => {
		const { contextId, entityType } = this.props;
		
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/live-camera`);
		}
	};

	render() {
		const {
			selected,
			order,
			enabled,
			expanded,
			widgetsExpandable,
			widgetsLaunchable,
			camera,
			sidebarOpen,
			dockedCameras,
			removeDockedCamera,
			canControl,
			dialog,
			openDialog,
			closeDialog,
			setCameraPriority,
			fullscreenCamera,
			contextId,
			entityType,
			addCameraToDockMode,
			readOnly,
			user,
			subscriberRef,
			dir
		} = this.props;

		return selected || !enabled ? (
			<div />
		) : (
			<div
				className={`widget-wrapper ${
					expanded ? "expanded" : "collapsed"
				} ${"index-" + order} `}
			>
				{!expanded && (
					<div className="widget-header">
						<div className="cb-font-b2"><Translate value="global.profiles.widgets.liveCam.title"/></div>
						<div className="widget-header-buttons">
							{widgetsExpandable && (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={this.handleExpand}
									>
										<Expand />
									</IconButton>
								</div>
							)}
							{widgetsLaunchable && (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } :{ paddingRight: 0, width: "auto" }}
										onClick={this.handleLaunch}
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
	}
}

LiveCameraWidget.propTypes = propTypes;
LiveCameraWidget.defaultProps = defaultProps;

export default LiveCameraWidget;
