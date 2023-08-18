import React, { PureComponent, Fragment } from "react";
import { Dialog } from "orion-components/CBComponents";
import { facilityService, cameraService } from "client-app-core";
import {
	DialogContentText,
	MenuItem,
	Popover,
	ListItemIcon,
	ListItemText,
	Fab
} from "@material-ui/core";
import {
	AddLocation as Add,
	PinDrop as Assign,
	EditLocation as Edit,
	Delete,
	Camera,
	Undo
} from "@material-ui/icons";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


class CameraGeoMenu extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			anchorEl: null,
			stageDelete: false,
			mode: null
		};
	}
	componentDidMount() {
		const { camera } = this.props;
		if (camera) {
			const { entityData } = camera;
			if (entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility") {
				facilityService.getFloorPlan(entityData.displayTargetId, (err, res) => {
					if (err) {
						this.setState({
							facilityHidden: true
						});
					} else if (res) {
						const floorPlan = res.result;
						facilityService.getFacility(floorPlan.facilityId, (err, res) => {
							if (err) {
								this.setState({
									facilityHidden: true
								});
							} else if (res) {
								this.setState({
									floorPlan,
									facility: res.result
								});
							}
						});
					}
				});
			}
		}
	}
	handleMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};
	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};
	handleSelect = mode => {
		const { handleSelect } = this.props;
		handleSelect(mode);
		this.handleMenuClose();
	};
	handleToggleStageDelete = (mode = null) => {
		const { stageDelete } = this.state;
		this.setState({ stageDelete: !stageDelete, mode });
		this.handleSelect(mode);
		this.handleMenuClose();
	};
	handleConfirmDelete = () => {
		const { handleConfirm } = this.props;
		handleConfirm();
		this.handleToggleStageDelete();
	};
	render() {
		const { camera } = this.props;
		const { anchorEl, stageDelete, mode } = this.state;
		const { entityData, fov, spotlightShape } = camera;
		const { geometry } = entityData;
		const open = !!anchorEl;
		let facilityName = "";
		let floorPlanName = "";
		const facilityCamera = entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility";
		if (this.state.facility && this.state.facility.entityData && this.state.facility.entityData.properties) {
			facilityName = this.state.facility.entityData.properties.name;
		}
		if (this.state.floorPlan) {
			floorPlanName = this.state.floorPlan.name;
		}
		return (
			<Fragment>
				<Fab
					onClick={
						!geometry
							? () => this.handleSelect("camera-add")
							: open
								? this.handleMenuClose
								: this.handleMenuOpen
					}
					color="primary"
				>
					{geometry ? (
						<Assign style={{ color: "#FFF" }} />
					) : (
						<Add style={{ color: "#FFF" }} />
					)}
				</Fab>
				<Popover
					open={open}
					anchorEl={anchorEl}
					onClose={this.handleMenuClose}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
					transformOrigin={{
						vertical: "bottom",
						horizontal: "right"
					}}
				>
					<MenuItem onClick={() => facilityCamera ? this.props.openDialog("facilityWarningDialog") : this.handleSelect("camera-edit")}>
						<ListItemIcon>
							<Edit style={{ color: "#FFF" }} />
						</ListItemIcon>
						<ListItemText primary={getTranslation("camerasMapLayers.listItemText.editLocation")} />
					</MenuItem>
					{!(entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility") &&
						<Fragment>
							<MenuItem
								onClick={() => this.handleSelect(`fov-${fov ? "edit" : "add"}`)}
							>
								<ListItemIcon>
									<Assign style={{ color: "#FFF" }} />
								</ListItemIcon>
								<ListItemText
									primary={fov ? getTranslation("camerasMapLayers.listItemText.editFOV") : getTranslation("camerasMapLayers.listItemText.drawFOV")}
								/>
							</MenuItem>
							{fov && (
								<MenuItem
									onClick={() => this.handleToggleStageDelete("fov-delete")}
								>
									<ListItemIcon>
										<Delete style={{ color: "#FFF" }} />
									</ListItemIcon>
									<ListItemText primary={getTranslation("camerasMapLayers.listItemText.deleteFOV")} />
								</MenuItem>
							)}
							<MenuItem onClick={() => this.handleSelect("spotlight")}>
								<ListItemIcon>
									<Camera style={{ color: "#FFF" }} />
								</ListItemIcon>
								<ListItemText primary={getTranslation("camerasMapLayers.listItemText.editSpotlight")} />
							</MenuItem>
							{!!spotlightShape && (
								<MenuItem
									onClick={() => this.handleToggleStageDelete("spotlight-reset")}
								>
									<ListItemIcon>
										<Undo style={{ color: "#FFF" }} />
									</ListItemIcon>
									<ListItemText primary={getTranslation("camerasMapLayers.listItemText.resetSpotlight")} />
								</MenuItem>
							)}
						</Fragment>

					}
				</Popover>
				{stageDelete && (
					<Dialog
						open={stageDelete}
						title={mode === "fov-delete" ? getTranslation("camerasMapLayers.stageDeleteDialog.title.deleteFOV") : getTranslation("camerasMapLayers.stageDeleteDialog.title.resetSpotlight")}
						textContent={getTranslation("camerasMapLayers.stageDeleteDialog.textContent",
							"",
							mode === "fov-delete" ? getTranslation("camerasMapLayers.stageDeleteDialog.delete") : getTranslation("camerasMapLayers.stageDeleteDialog.reset"),
							mode === "fov-delete" ? getTranslation("camerasMapLayers.stageDeleteDialog.fov") : getTranslation("camerasMapLayers.stageDeleteDialog.spotlight"))}
						confirm={{ label: "Confirm", action: this.handleConfirmDelete }}
						abort={{ label: "Cancel", action: this.handleToggleStageDelete }}
					/>
				)}
				<Dialog
					open={this.props.dialog === "facilityWarningDialog"}
					title={getTranslation("camerasMapLayers.facilityCamDialog.title")}
					confirm={{
						label: getTranslation("camerasMapLayers.facilityCamDialog.continue"),
						action: () => {
							this.props.closeDialog("facilityWarningDialog");
							cameraService.removeCameraFromDisplayTarget(camera.id, entityData.displayTargetId);
							this.handleSelect("camera-edit");
						},
						disabled: !this.state.floorPlan
					}}
					abort={{
						label: getTranslation("camerasMapLayers.facilityCamDialog.cancel"), action: () => {
							this.props.closeDialog("facilityWarningDialog");
						}
					}}
				>
					{this.state.facilityHidden ?
						(
							<DialogContentText>
								<Translate value="camerasMapLayers.facilityCamDialog.hiddenText" count={entityData.properties.name} />
							</DialogContentText>
						) :
						(
							<DialogContentText>
								<Translate value="camerasMapLayers.facilityCamDialog.locatedText" count={entityData.properties.name} />{" "}<a href={`/facilities-app/#/?${entityData.displayTargetId}`}>{`${facilityName}: ${floorPlanName}`}</a><br /><Translate value="camerasMapLayers.facilityCamDialog.continuingText" />
							</DialogContentText>
						)
					}

				</Dialog>
			</Fragment>
		);
	}
}

export default CameraGeoMenu;
