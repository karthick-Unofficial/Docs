import React, { PureComponent } from "react";
import { withSpan } from "../../../Apm";
import { cameraService } from "client-app-core";
import { IconButton, Button, Typography } from "@material-ui/core";
import Expand from "@material-ui/icons/ZoomOutMap";
import LaunchIcon from "@material-ui/icons/Launch";
import CameraCard from "./components/CameraCard";
import { debounce } from "../../../lib/utils";
import { LinkDialog } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

class CamerasWidget extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			open: null,
			camerasLoaded: false,
			cameraExpandDebounce: null
		};
	}

	componentDidMount() {
		const _cameraExpandDebounce = debounce((cameras) => {
			if (!this.state.camerasLoaded) {
				if (cameras.length === 1) {
					this.handleCardExpand(cameras[0].id);
				}
				this.setState({ camerasLoaded: true });
			}
		}, 500);
		this.setState({
			cameraExpandDebounce: _cameraExpandDebounce
		});
	}

	componentDidUpdate(prevProps, prevState) {
		// CB2-3814 load single camera video automatically
		if (!this.state.camerasLoaded) {
			const { cameras } = this.props;
			this.state.cameraExpandDebounce(cameras);
		}
	}

	componentWillUnmount() {
		const {
			contextId,
			unsubscribeFromFeed,
			subscriberRef,
			entityType
		} = this.props;

		if (unsubscribeFromFeed) {

			// Event profile uses a different stream that includes both cameras in range and pinned cameras
			if (entityType === "event") {
				unsubscribeFromFeed(contextId, "eventCameras", subscriberRef);
			}
			else {
				unsubscribeFromFeed(contextId, "camerasInRange", subscriberRef);
			}
		}
	}

	handleExpand = () => {
		this.props.selectWidget("Cameras");
	};

	handleLaunch = () => {
		const { contextId } = this.props;

		// -- camera-wall expects entityType of "shape", but entityType on all shape properties is set to "shapes"
		const entityType = this.props.entityType === "shapes" ? "shape" : this.props.entityType;

		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "floorplan") {
			window.open(`/facilities-app/#/entity/${contextId}`);
		}
		else {
			// -- build out properties based on how the Camera-Wall App does it
			const edProps = this.props.entity.entityData.properties;
			const name = this.props.entity.name || (edProps ? edProps.name : "Unknown");
			const backupType = entityType.charAt(0).toUpperCase() + entityType.slice(1);
			const type = edProps ? (edProps.subtype || edProps.type || backupType) : backupType;
			const displayName = (name ? name.replace("/", "%2F") : contextId).toUpperCase();

			window.open(`/camera-wall-app/#/entityId/${contextId}/entityName/${displayName}/entityType/${entityType}/type/${type}`);
		}
	};

	handleCardExpand = id => {
		const { open } = this.state;

		if (open === id) {
			this.setState({ open: null });
		} else {
			this.setState({ open: id });
		}
	};

	handleSlewAll = () => {
		const { geometry, cameras } = this.props;
		const { coordinates } = geometry;
		cameras.forEach(camera => {
			// Params: cameraId, latitude, longitude, altitude, speed (0 to 1), callback
			// -- don't slew virtual ptz cams (i.e. wavcam) as they are already locked to target
			if (!(camera.entityData.properties.features && camera.entityData.properties.features.includes("ribbon"))) {
				cameraService.moveGeo(camera.id, coordinates[1], coordinates[0], 0, 1);
			}
		});
	};

	render() {
		const {
			selected,
			order,
			canLink,
			enabled,
			entity,
			widgetsExpandable,
			widgetsLaunchable,
			cameras,
			loadProfile,
			sidebarOpen,
			dockedCameras,
			addCameraToDockMode,
			removeDockedCamera,
			entityType,
			geometry,
			useCameraGeometry,
			readOnly,
			contextId,
			dialog,
			openDialog,
			closeDialog,
			subscriberRef,
			setCameraPriority,
			fullscreenCamera,
			disableSlew,
			linkEntities,
			unlinkCameras,
			user,
			eventEnded,
			isAlertProfile,
			dir
		} = this.props;
		const { open } = this.state;

		const styles = {
			label: {
				textTransform: "none"
			},
			cameraButton: {
				display: "flex",
				alignItems: "center",
				backgroundColor: "lighten($darkGray, 2 %)"
			}
		};
		const canSlewAll =
			cameras && cameras.findIndex(camera => {
				return camera.entityData.properties.features &&
					camera.entityData.properties.features.includes("auto-slew");
			}) > -1;

		return selected || !enabled ? (
			<div />
		) : (
			<div
				className={`widget-wrapper collapsed ${"index-" + order} `}
			>
				{!isAlertProfile && (
					<div className="widget-header">
						<div className="cb-font-b2"><Translate value="global.profiles.widgets.cameras.main.title" /></div>
						{["camera", "shapes", "track", "accessPoint"].includes(entityType) && canLink && (
							<div className="widget-option-button" style={{ marginLeft: "auto" }}>
								<Button onClick={() => openDialog("link-entity-dialog")} style={styles.label}
									color="primary" >
									<Translate value="global.profiles.widgets.cameras.main.linkCamera" />
								</Button>
							</div>
						)}
						{canSlewAll && !readOnly && !disableSlew && (
							<div
								className="widget-option-button"
								style={dir && dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }}
							>
								<Button
									style={styles.label}
									color="primary"
									onClick={this.handleSlewAll}
								>
									<Translate value="global.profiles.widgets.cameras.main.slewAll" />
								</Button>
							</div>
						)}
						<div className="widget-header-buttons">
							{widgetsExpandable && (
								<div className="widget-expand-button">
									<IconButton
										style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={this.handleExpand}
									>
										<Expand />
									</IconButton>
								</div>
							)}
							{widgetsLaunchable && (
								<div className="widget-expand-button">
									<IconButton
										style={dir && dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
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
					{cameras && cameras.length > 0 ? (
						cameras.map((camera, index) => {
							const cameraDisabled = camera.isDeleted || eventEnded;
							return (
								<CameraCard
									contextId={contextId}
									cameraIndex={index}
									canUnlink={canLink}
									canControl={!readOnly && user.integrations
										&& user.integrations.find(int => int.intId === camera.feedId)
										&& user.integrations.find(int => int.intId === camera.feedId).permissions
										&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control")}
									entityType={entityType}
									useCameraGeometry={useCameraGeometry}
									geometry={geometry}
									key={camera.id}
									loadProfile={loadProfile}
									unlinkCameras={unlinkCameras}
									camera={camera}
									canExpand={!cameraDisabled}
									handleCardExpand={this.handleCardExpand}
									canTarget={!cameraDisabled}
									hasMenu={open === camera.id && !cameraDisabled}
									expanded={open === camera.id}
									disableSlew={disableSlew}
									sidebarOpen={sidebarOpen}
									dockedCameras={dockedCameras}
									addCameraToDockMode={addCameraToDockMode}
									removeDockedCamera={removeDockedCamera}
									dialog={dialog}
									openDialog={openDialog}
									closeDialog={closeDialog}
									readOnly={readOnly}
									subscriberRef={subscriberRef}
									setCameraPriority={setCameraPriority}
									fullscreenCamera={fullscreenCamera}
									dir={dir}
								/>
							);
						})
					) : (
						<Typography
							style={{ margin: "12px auto" }}
							align="center"
							variant="caption"
						>
							<Translate value="global.profiles.widgets.cameras.main.noCamsAvailable" />
						</Typography>
					)}
				</div>
				{["camera", "shapes", "track"].includes(entityType) &&
					<LinkDialog
						dialog={dialog || ""}
						title={getTranslation("global.profiles.widgets.cameras.main.linkCams")}
						closeDialog={closeDialog}
						entity={entity}
						linkEntities={linkEntities}
						dir={dir}
					>
					</LinkDialog>
				}
			</div>
		);
	}
}

export default withSpan("cameras-widget", "profile-widget")(CamerasWidget);
