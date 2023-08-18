import React, { PureComponent, Fragment } from "react";
import { Dialog } from "orion-components/CBComponents";
import { facilityService, accessPointService } from "client-app-core";
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
	Undo
} from "@material-ui/icons";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { SvgIcon } from "@material-ui/core";
import { mdiAccessPoint } from "@mdi/js";


class AccessPointGeoMenu extends PureComponent {
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
		const { accessPoint } = this.props;
		if (accessPoint) {
			const { entityData } = accessPoint;
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
		const { accessPoint } = this.props;
		const { anchorEl, stageDelete, mode } = this.state;
		const { entityData, fov, spotlightShape } = accessPoint;
		const { geometry } = entityData;
		const open = !!anchorEl;
		let facilityName = "";
		let floorPlanName = "";
		const facilityAccessPoint = entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility";
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
							? () => this.handleSelect("accessPoint-add")
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
					<MenuItem onClick={() => facilityAccessPoint ? this.props.openDialog("facilityWarningDialog") : this.handleSelect("accessPoint-edit")}>
						<ListItemIcon>
							<Edit style={{ color: "#FFF" }} />
						</ListItemIcon>
						<ListItemText primary={getTranslation("accessPointMapLayers.listItemText.editLocation")} />
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
									primary={fov ? getTranslation("accessPointMapLayers.listItemText.editFOV") : getTranslation("accessPointMapLayers.listItemText.drawFOV")}
								/>
							</MenuItem>
							{fov && (
								<MenuItem
									onClick={() => this.handleToggleStageDelete("fov-delete")}
								>
									<ListItemIcon>
										<Delete style={{ color: "#FFF" }} />
									</ListItemIcon>
									<ListItemText primary={getTranslation("accessPointMapLayers.listItemText.deleteFOV")} />
								</MenuItem>
							)}
							<MenuItem onClick={() => this.handleSelect("spotlight")}>
								<ListItemIcon>
									<SvgIcon style={{ width: 34, height: 34, color: "#fff" }}>
										<path d={mdiAccessPoint} />
									</SvgIcon>
								</ListItemIcon>
								<ListItemText primary={getTranslation("accessPointMapLayers.listItemText.editSpotlight")} />
							</MenuItem>
							{!!spotlightShape && (
								<MenuItem
									onClick={() => this.handleToggleStageDelete("spotlight-reset")}
								>
									<ListItemIcon>
										<Undo style={{ color: "#FFF" }} />
									</ListItemIcon>
									<ListItemText primary={getTranslation("accessPointMapLayers.listItemText.resetSpotlight")} />
								</MenuItem>
							)}
						</Fragment>

					}
				</Popover>
				{stageDelete && (
					<Dialog
						open={stageDelete}
						title={mode === "fov-delete" ? getTranslation("accessPointMapLayers.stageDeleteDialog.title.deleteFOV") : getTranslation("accessPointMapLayers.stageDeleteDialog.title.resetSpotlight")}
						textContent={getTranslation("accessPointMapLayers.stageDeleteDialog.textContent",
							"",
							mode === "fov-delete" ? getTranslation("accessPointMapLayers.stageDeleteDialog.delete") : getTranslation("accessPointMapLayers.stageDeleteDialog.reset"),
							mode === "fov-delete" ? getTranslation("accessPointMapLayers.stageDeleteDialog.fov") : getTranslation("accessPointMapLayers.stageDeleteDialog.spotlight"))}
						confirm={{ label: "Confirm", action: this.handleConfirmDelete }}
						abort={{ label: "Cancel", action: this.handleToggleStageDelete }}
					/>
				)}
				<Dialog
					open={this.props.dialog === "facilityWarningDialog"}
					title={getTranslation("accessPointMapLayers.facilityAPDialog.title")}
					confirm={{
						label: getTranslation("accessPointMapLayers.facilityAPDialog.continue"),
						action: () => {
							this.props.closeDialog("facilityWarningDialog");
							accessPointService.removeCameraFromDisplayTarget(accessPoint.id, entityData.displayTargetId);
							this.handleSelect("accessPoint-edit");
						},
						disabled: !this.state.floorPlan
					}}
					abort={{
						label: getTranslation("accessPointMapLayers.facilityAPDialog.cancel"), action: () => {
							this.props.closeDialog("facilityWarningDialog");
						}
					}}
				>
					{this.state.facilityHidden ?
						(
							<DialogContentText>
								<Translate value="accessPointMapLayers.facilityAPDialog.hiddenText" count={entityData.properties.name} />
							</DialogContentText>
						) :
						(
							<DialogContentText>
								<Translate value="accessPointMapLayers.facilityAPDialog.locatedText" count={entityData.properties.name} />{" "}<a href={`/facilities-app/#/?${entityData.displayTargetId}`}>{`${facilityName}: ${floorPlanName}`}</a><br /><Translate value="accessPointMapLayers.facilityAPDialog.continuingText" />
							</DialogContentText>
						)
					}

				</Dialog>
			</Fragment>
		);
	}
}

export default AccessPointGeoMenu;
