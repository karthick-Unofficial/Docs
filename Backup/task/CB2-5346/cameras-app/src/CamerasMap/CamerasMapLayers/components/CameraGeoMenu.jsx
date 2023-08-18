import React, { memo, Fragment, useEffect, useState } from "react";
import { Dialog } from "orion-components/CBComponents";
import { facilityService, cameraService, accessPointService } from "client-app-core";
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

const CameraGeoMenu = ({ handleSelect, handleConfirm, entity, closeDialog, openDialog, dialog }) => {

	const [anchorEl, setAnchorEl] = useState(null);
	const [stageDelete, setStageDelete] = useState(false);
	const [mode, setMode] = useState(null);
	const [facility, setFacility] = useState({});
	const [facilityHidden, setFacilityHidden] = useState(false);
	const [floorPlan, setFloorPlan] = useState({});

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};
	const handleSelection = mode => {
		handleSelect(mode);
		handleMenuClose();
	};
	const handleToggleStageDelete = (mode = null) => {
		setStageDelete(!stageDelete, mode);
		handleSelection(mode);
		handleMenuClose();
	};
	const handleConfirmDelete = () => {
		handleConfirm();
		handleToggleStageDelete();
	};
	useEffect(() => {
		if (entity) {
			const { entityData } = entity;
			if (entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility") {
				facilityService.getFloorPlan(entityData.displayTargetId, (err, res) => {
					if (err) {
						setFacilityHidden(true);
					} else if (res) {
						const floorPlan = res.result;
						facilityService.getFacility(floorPlan.facilityId, (err, res) => {
							if (err) {
								setFacilityHidden(true);
							} else if (res) {
								setFloorPlan(floorPlan);
								setFacility(res.result);
							}
						});
					}
				});
			}
		}
	}, []);




	const { entityData, fov, spotlightShape, entityType } = entity;
	const { geometry } = entityData;
	const open = !!anchorEl;
	let facilityName = "";
	let floorPlanName = "";
	const facilityEntity = entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility";
	if (facility && facility.entityData && facility.entityData.properties) {
		facilityName = facility.entityData.properties.name;
	}
	if (floorPlan) {
		floorPlanName = floorPlan.name;
	}

	return (
		<Fragment>
			<Fab
				onClick={
					!geometry
						? () => handleSelection("camera-add")
						: open
							? handleMenuClose
							: handleMenuOpen
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
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
			>
				{entityType == "accessPoint" && <MenuItem onClick={() => facilityEntity ? openDialog("facilityWarningDialog") : handleSelection("accessPoint-edit")}>
					<ListItemIcon>
						<Edit style={{ color: "#FFF" }} />
					</ListItemIcon>
					<ListItemText primary={getTranslation("accessPointMapLayers.listItemText.editLocation")} />
				</MenuItem>}
				{entityType == "camera" && <MenuItem onClick={() => facilityEntity ? openDialog("facilityWarningDialog") : handleSelection("camera-edit")}>
					<ListItemIcon>
						<Edit style={{ color: "#FFF" }} />
					</ListItemIcon>
					<ListItemText primary={getTranslation("camerasMapLayers.listItemText.editLocation")} />
				</MenuItem>}
				{entityType == "camera" && !(entityData.displayTargetId && entityData.displayType && entityData.displayType.toLowerCase() === "facility") &&
					<Fragment>
						<MenuItem
							onClick={() => handleSelection(`fov-${fov ? "edit" : "add"}`)}
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
								onClick={() => handleToggleStageDelete("fov-delete")}
							>
								<ListItemIcon>
									<Delete style={{ color: "#FFF" }} />
								</ListItemIcon>
								<ListItemText primary={getTranslation("camerasMapLayers.listItemText.deleteFOV")} />
							</MenuItem>
						)}
						<MenuItem onClick={() => handleSelection("spotlight")}>
							<ListItemIcon>
								<Camera style={{ color: "#FFF" }} />
							</ListItemIcon>
							<ListItemText primary={getTranslation("camerasMapLayers.listItemText.editSpotlight")} />
						</MenuItem>
						{!!spotlightShape && (
							<MenuItem
								onClick={() => handleToggleStageDelete("spotlight-reset")}
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
					confirm={{ label: "Confirm", action: handleConfirmDelete }}
					abort={{ label: "Cancel", action: handleToggleStageDelete }}
				/>
			)}
			{entityType == "accessPoint" ?
				(<Dialog
					open={dialog === "facilityWarningDialog"}
					title={getTranslation("accessPointMapLayers.facilityAPDialog.title")}
					confirm={{
						label: getTranslation("accessPointMapLayers.facilityAPDialog.continue"),
						action: () => {
							closeDialog("facilityWarningDialog");
							accessPointService.removeAccessPointFromDisplayTarget(entity.id, entityData.displayTargetId);
							handleSelection("accessPoint-edit");
						},
						disabled: !floorPlan
					}}
					abort={{
						label: getTranslation("accessPointMapLayers.facilityAPDialog.cancel"), action: () => {
							closeDialog("facilityWarningDialog");
						}
					}}
				>
					{facilityHidden ?
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

				</Dialog>) :
				(<Dialog
					open={dialog === "facilityWarningDialog"}
					title={getTranslation("camerasMapLayers.facilityCamDialog.title")}
					confirm={{
						label: getTranslation("camerasMapLayers.facilityCamDialog.continue"),
						action: () => {
							closeDialog("facilityWarningDialog");
							cameraService.removeCameraFromDisplayTarget(entity.id, entityData.displayTargetId);
							handleSelection("camera-edit");
						},
						disabled: !floorPlan
					}}
					abort={{
						label: getTranslation("camerasMapLayers.facilityCamDialog.cancel"), action: () => {
							closeDialog("facilityWarningDialog");
						}
					}}
				>
					{facilityHidden ?
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

				</Dialog>)}
		</Fragment>
	);

};

export default memo(CameraGeoMenu);