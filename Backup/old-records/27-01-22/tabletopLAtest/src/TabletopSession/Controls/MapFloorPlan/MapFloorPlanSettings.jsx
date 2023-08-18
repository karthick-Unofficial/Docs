import _ from "lodash";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Button, Divider, FormControlLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FormatVerticalAlignTop, FormatVerticalAlignBottom, FormatHorizontalAlignLeft, FormatHorizontalAlignRight } from "mdi-material-ui";
import Checkbox from "../../../shared/components/Checkbox";
import T2DialogBox from "../../../shared/components/T2DialogBox";
import Switch from "../../../shared/components/Switch";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	open: PropTypes.bool.isRequired,
	facilities: PropTypes.object,
	floorPlans: PropTypes.object,
	mapFloorPlanSettings: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	closeSettings: PropTypes.func.isRequired,
	persistMapFloorplanControlState: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const styles = {
	dialogActions: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 30,
		paddingBottom: 20,
		paddingRight: 10,
		background: "#414449"
	},
	dialogActionsRTL: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 30,
		paddingBottom: 20,
		paddingLeft: 10,
		background: "#414449"
	}
};

const MapFloorPlanSettings = ({
	open,
	facilities,
	floorPlans,
	mapFloorPlanSettings,
	classes,
	closeSettings,
	persistMapFloorplanControlState,
	dir
}) => {
	const [settings, setSettings] = useState(_.cloneDeep(mapFloorPlanSettings));
	const [selectedFacilities, setSelectedFacilities] = useState(_.keys(settings.facilityFloorplans));

	const facilityObjects = _.orderBy(_.values(facilities), "entityData.properties.name", "asc");
	const facilityCount = facilityObjects.length;

	const setDockLayout = (layout) => {
		setSettings({
			...settings,
			dockLayout: layout
		});
	};

	const updateFacilitySelection = (event, facilityId) => {
		const newSelectedFacilities = [...selectedFacilities];
		if (event.target.checked) {
			newSelectedFacilities.push(facilityId);
		} else {
			newSelectedFacilities.splice(newSelectedFacilities.indexOf(facilityId), 1);
		}
		setSelectedFacilities(newSelectedFacilities);
	};

	const allFacilitiesSelected = () => {
		// We dont compare facilities count because there might be a deleted facility
		if (_.find(facilityObjects, facility => !selectedFacilities.includes(facility.id))) {
			return false;
		}
		return true;
	};

	const updateAllFacilitiesSelection = (event) => {
		const newSelectedFacilities = [];
		if (event.target.checked) {
			facilityObjects.forEach(facility => newSelectedFacilities.push(facility.id));
		}
		setSelectedFacilities(newSelectedFacilities);
	};

	const handleSettingsClose = () => {
		closeSettings();
	};

	const handleSave = () => {
		const newFacilityFloorplans = {};
		selectedFacilities.forEach(facilityId => {
			if (mapFloorPlanSettings.facilityFloorplans.hasOwnProperty(facilityId)) {
				newFacilityFloorplans[facilityId] = mapFloorPlanSettings.facilityFloorplans[facilityId];
			} else {
				newFacilityFloorplans[facilityId] = floorPlans.hasOwnProperty(facilityId)
					? floorPlans[facilityId][0].id : null;
			}
		});
		settings.facilityFloorplans = newFacilityFloorplans;
		if (!_.isEqual(mapFloorPlanSettings, settings)) {
			persistMapFloorplanControlState(settings);
		}
		closeSettings();
	};

	const renderDialogContent = () => {
		return (
			<div className="mapFloorPlanSettingsContainer">
				<div className="dockLayoutContainer">
					<div className="buttonContainer">
						<FormatVerticalAlignTop className={`btn btnTop ${settings.dockLayout === "top" ? "btnSelected" : ""}`} onClick={() => setDockLayout("top")} />
						<FormatHorizontalAlignLeft className={`btn btnLeft ${settings.dockLayout === "left" ? "btnSelected" : ""}`} onClick={() => setDockLayout("left")} />
						<FormatHorizontalAlignRight className={`btn btnRight ${settings.dockLayout === "right" ? "btnSelected" : ""}`} onClick={() => setDockLayout("right")} />
						<FormatVerticalAlignBottom className={`btn btnBottom ${settings.dockLayout === "bottom" ? "btnSelected" : ""}`} onClick={() => setDockLayout("bottom")} />
					</div>
					<div>
						<div className="b1-bright-gray"><Translate value="tableopSession.mapFloor.floor" /></div>
						<div className="b1-white">
							<Translate value="tableopSession.controls.mapFloorPlan.mapFloorPlanSettings.dock"/>{`${settings.dockLayout.charAt(0).toUpperCase()}${settings.dockLayout.substring(1).toLowerCase()}`}
						</div>
					</div>
				</div>
				<Divider className="divider" />
				<div className="b1-bright-gray"><Translate value="tableopSession.mapFloor.controls" /></div>
				<div className="facilitiesContainer">
					{facilityCount > 1 &&
						<div key="all" className="facilityEntry">
							<Switch checked={allFacilitiesSelected()} onChange={(e) => updateAllFacilitiesSelection(e)} name="all" />
							<div className="b1-white facilityName"><Translate value="tableopSession.mapFloor.facilities" /></div>
						</div>
					}
					<div>
						{facilityObjects.map(facility => {
							return (
								<div key={facility.id} className="facilityEntry">
									<Switch checked={selectedFacilities.includes(facility.id)} onChange={(e) => updateFacilitySelection(e, facility.id)} name={facility.id} />
									<div className="b1-white facilityName">{facility.entityData.properties.name}</div>
								</div>
							);
						})}
					</div>
				</div>
				<div>
					<FormControlLabel
						style={{ marginTop: 20 }}
						control={
							<Checkbox
								checked={settings.hideAll}
								onChange={(e) => setSettings({
									...settings,
									hideAll: e.target.checked
								})}
								name="hideAllCheck"
							/>
						}
						label={<Translate value="tableopSession.mapFloor.hide" />}
					/>
				</div>
				<Container className={dir == "rtl" ? classes.dialogActionsRTL : classes.dialogActions}>
					<Button
						className="cancelBtn"
						onClick={handleSettingsClose}
					>
						<Translate value="tableopSession.mapFloor.cancel" />
					</Button>
					<Button
						variant="contained"
						color="primary"
						className="saveBtn"
						onClick={handleSave}
					>
						<Translate value="tableopSession.mapFloor.ok" />
					</Button>
				</Container>
			</div>
		);
	};

	return (
		<T2DialogBox
			open={open}
			onClose={handleSettingsClose}
			headline={<Translate value="tableopSession.mapFloor.headline" />}
			content={renderDialogContent()}
			dir={dir}
		/>
	);
};

MapFloorPlanSettings.propTypes = propTypes;
export default withStyles(styles)(MapFloorPlanSettings);