import _ from "lodash";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";
import { CloseCircle } from "mdi-material-ui";
import SettingsButton from "../../../shared/components/SettingsButton";
import MapFloorPlanEntry from "./MapFloorPlanEntry";
import MapFloorPlanSettings from "./MapFloorPlanSettings";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	map: PropTypes.object,
	bottomOffset: PropTypes.number,
	leftOffset: PropTypes.number,
	rightOffset: PropTypes.number,
	facilities: PropTypes.object,
	floorPlans: PropTypes.object,
	mapLayerSettings: PropTypes.object,
	mapFloorPlanSettings: PropTypes.object.isRequired,
	updatePersistedState: PropTypes.func.isRequired,
	persistMapFloorplanControlState: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const MapFloorPlan = ({ 
	map, 
	bottomOffset, 
	leftOffset,
	rightOffset,
	facilities, 
	floorPlans, 
	mapLayerSettings, 
	mapFloorPlanSettings,
	updatePersistedState, 
	persistMapFloorplanControlState,
	dir
}) => {
	const [ openSettings, setOpenSettings ] = useState(false);

	let settings = mapFloorPlanSettings;

	useEffect(() => {
		if (facilities && !_.isEmpty(facilities)) {
			// Check if any facility in persisted settings does not exist anymore
			const deletedFacilities = _.without(_.keys(mapFloorPlanSettings.facilityFloorplans), ...(_.keys(facilities)));
			if (deletedFacilities.length > 0) {
				const newFacilityFloorplans = {...mapFloorPlanSettings.facilityFloorplans};
				deletedFacilities.forEach(deletedFacilityId => 
					delete newFacilityFloorplans[deletedFacilityId]);
				const newSettings = {
					...settings,
					facilityFloorplans: newFacilityFloorplans
				};
				persistMapFloorplanControlState(newSettings);
			}
		}
	}, [ facilities ]);

	const openFloorPlanEntry = (facilityId, floorPlanId) => {
		persistMapFloorplanControlState( 
			{
				...settings, 
				facilityFloorplans: {
					...settings.facilityFloorplans,
					[facilityId]: floorPlanId
				}
			}
		);
	};

	const closeFloorPlanEntry = (facilityId) => {
		const newFacilityFloorplans = { ...settings.facilityFloorplans };
		if (newFacilityFloorplans.hasOwnProperty(facilityId)) {
			delete newFacilityFloorplans[facilityId];
		}
		persistMapFloorplanControlState( 
			{
				...settings, 
				facilityFloorplans: newFacilityFloorplans
			}
		);
	};

	const closeSettings = () => {
		setOpenSettings(false);
	};

	if (!map || !mapLayerSettings.displayFloorPlan || !facilities) {
		return null;
	}

	const containerStyle = {
		position: "absolute",
		width: "100%", 
		display: "flex",
		pointerEvents: "none",
		justifyContent: "flex-end",
		zIndex: 200
	};

	const containerStyleRTL = {
		position: "absolute",
		width: "100%", 
		display: "flex",
		pointerEvents: "none",
		justifyContent: "flex-start",
		zIndex: 200
	};

	let floorPlanEntryRightOffset = 10;
	let floorPlanEntryLeftOffset = 0;

	switch (settings.dockLayout) {
		case "top":
			containerStyle.top = "77px";
			containerStyle.left = `${leftOffset + 6}px`;
			containerStyle.flexDirection = "row-reverse";
			floorPlanEntryLeftOffset = 10;
			break;

		case "left":
			containerStyle.bottom = `${bottomOffset + 18}px`;
			containerStyle.left = `${leftOffset + 6}px`;
			containerStyle.flexDirection = "column";
			containerStyle.alignItems = "flex-start";
			break;

		case "right":
			containerStyle.bottom = `${bottomOffset + 18}px`;
			containerStyle.right = `${rightOffset + 6}px`;
			containerStyle.flexDirection = "column";
			containerStyle.alignItems = "flex-end";
			floorPlanEntryRightOffset = 0;
			break;

		case "bottom":
			containerStyle.bottom = `${bottomOffset + 18}px`;
			containerStyle.right = `${rightOffset + 6}px`;
			containerStyle.flexDirection = "row";
			break;
	}

	switch (settings.dockLayout) {
		case "top":
			containerStyleRTL.top = "77px";
			containerStyleRTL.right = `${leftOffset + 6}px`;
			containerStyleRTL.flexDirection = "row";
			floorPlanEntryLeftOffset = 10;
			break;

		case "left":
			containerStyleRTL.bottom = `${bottomOffset + 18}px`;
			containerStyleRTL.right = `${leftOffset + 6}px`;
			containerStyleRTL.flexDirection = "column";
			containerStyleRTL.alignItems = "flex-end";
			break;

		case "right":
			containerStyleRTL.bottom = `${bottomOffset + 18}px`;
			containerStyleRTL.left = `${rightOffset + 6}px`;
			containerStyleRTL.flexDirection = "column";
			containerStyleRTL.alignItems = "flex-end";
			floorPlanEntryRightOffset = 0;
			break;

		case "bottom":
			containerStyleRTL.bottom = `${bottomOffset + 18}px`;
			containerStyleRTL.left = `${rightOffset + 6}px`;
			containerStyleRTL.flexDirection = "row-reverse";
			break;
	}

	return (
		<div style={dir == "rtl" ? containerStyleRTL : containerStyle}>
			{!settings.hideAll && _.keys(settings.facilityFloorplans).map(facilityId => {
				if (!facilities.hasOwnProperty(facilityId)) {
					return null;
				}
				const floorPlansForFacility = floorPlans && floorPlans.hasOwnProperty(facilityId) ? floorPlans[facilityId] : null;
				return (
					<MapFloorPlanEntry 
						key={facilityId}
						map={map} 
						facility={facilities[facilityId]} 
						floorPlanId={settings.facilityFloorplans[facilityId]}
						floorPlans={floorPlansForFacility}
						rightOffset = {floorPlanEntryRightOffset}
						leftOffset = {floorPlanEntryLeftOffset}
						closeEntry={() => closeFloorPlanEntry(facilityId)}
						openFloorPlanEntry={openFloorPlanEntry}
						dir={dir}
					/>
				);
			})}		
			<div className="mapFloorPlanControl">
				<Tooltip title={<Translate value="tableopSession.controls.mapFloorPlan.settings"/>}>
					<span>
						<SettingsButton width={18} height={18} clickHandler={() => setOpenSettings(true)} />
					</span>
				</Tooltip>
				<Tooltip title={<Translate value="tableopSession.controls.mapFloorPlan.close"/>}>
					<CloseCircle 
						className="closeBtn"
						onClick={() => updatePersistedState("tabletop-app", "mapLayerSettings", 
							{...mapLayerSettings, displayFloorPlan: false})} 
					/>
				</Tooltip>
			</div>
			{openSettings && 
				<MapFloorPlanSettings
					open={openSettings}
					facilities={facilities}
					floorPlans={floorPlans}
					closeSettings={closeSettings}
					mapFloorPlanSettings={settings}
					persistMapFloorplanControlState={persistMapFloorplanControlState}
					dir={dir}
				/>
			}
		</div>
	);
};

MapFloorPlan.propTypes = propTypes;
export default MapFloorPlan;