import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Popover } from "@material-ui/core";
import { Eye, EyeOff, CloseCircle } from "mdi-material-ui";
import TargetingIconContainer from "../TargetingIcon/TargetingIconContainer";

const propTypes = {
	map: PropTypes.object,
	facility: PropTypes.object,
	floorPlanId: PropTypes.string,
	floorPlans: PropTypes.array,
	rightOffset: PropTypes.number.isRequired,
	leftOffset: PropTypes.number.isRequired,
	closeEntry: PropTypes.func.isRequired,
	openFloorPlanEntry: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const MapFloorPlanEntry = ({ 
	map, 
	facility, 
	floorPlanId,
	floorPlans, 
	rightOffset, 
	leftOffset, 
	closeEntry,
	openFloorPlanEntry,
	dir
}) => {
	const [ currentFloorPlanIndex, setCurrentFloorPlanIndex ] = useState(null);
	const [ settingsAnchorEl, setSettingsAnchorEl ] = React.useState(null);

	// Cleanup
	useEffect(() => {
		return () => {
			removeCurrentFloorPlan();
		};
	}, []);

	// Set first floor plan if no floor plan is set already
	useEffect(() => {
		if (!floorPlans || !floorPlans.length) {
			return;
		}

		let index = -1;
		if (floorPlanId) {
			index = floorPlans.findIndex(floorPlan => floorPlan.id === floorPlanId);
		}
		setCurrentFloorPlanIndex(index);
	}, [ floorPlans, floorPlanId ]);

	// Render floor plan on the map
	useEffect(() => {
		if (!map || currentFloorPlanIndex == null) {
			return;
		}

		if (currentFloorPlanIndex > -1) {
			const floorPlan = floorPlans[currentFloorPlanIndex];
			const imgSrc = `/_download?handle=${floorPlan.handle}`;
			const coords = floorPlan.geometry.coordinates[0].filter((coord, index) => index < 4);
			const sourceData = {
				type: "image",
				url: imgSrc,
				coordinates: coords
			};
			if (!map.getSource(`${facility.id}-map-floor-plan-source`)) {
				map.addSource(`${facility.id}-map-floor-plan-source`, sourceData);
				map.addLayer({
					id: `${facility.id}-map-floor-plan-overlay`,
					source: `${facility.id}-map-floor-plan-source`,
					type: "raster",
					paint: {
						"raster-opacity": 1.0
					}
				}, "country-label-sm"); //TODO: Find a better way to set this layer-below
			}
		}

		return () => {
			removeCurrentFloorPlan();
		};
	}, [ map, currentFloorPlanIndex ]);

	const displayFloorPlan = (index) => {
		let fpId = null;
		if (index > -1) {
			fpId = floorPlans[index].id;
		}
		openFloorPlanEntry(facility.id, fpId);
	};

	const removeCurrentFloorPlan = () => {
		if (currentFloorPlanIndex !== -1) {
			try {
				if (map && map.getSource(`${facility.id}-map-floor-plan-source`)) {
					map.removeLayer(`${facility.id}-map-floor-plan-overlay`);
					map.removeSource(`${facility.id}-map-floor-plan-source`);
				}	
			} catch (error) {
				console.log("MapFloorPlan - Error occurred when removing FloorPlanLayer");
			}
		}
	};

	const onMouseOver = (e) => {
		setSettingsAnchorEl(e.currentTarget);
	};

	const closeFloorPlanEntry = () => {
		setSettingsAnchorEl(null);
		removeCurrentFloorPlan();
		closeEntry();
	};

	const renderFloorPlanSettingEntry = (index, id, name) => {
		return (
			<div key={id} className="floorPlanEntry">
				{(index === currentFloorPlanIndex) &&
					<div className="container selected b2-white">
						<Eye className="icon selected" />
						<span>{name}</span>
					</div>
				}
				{(index !== currentFloorPlanIndex) &&
					<div className="container b2-bright-gray" onClick={() => displayFloorPlan(index)}>
						<EyeOff className="icon" />
						<span>{name}</span>
					</div>
				}
			</div>
		);
	};

	const currentFloorPlan = (currentFloorPlanIndex != null && currentFloorPlanIndex > -1) ? floorPlans[currentFloorPlanIndex] : null;
	const openSettings = Boolean(settingsAnchorEl);

	return (
		<div 
			className="mapFloorPlanEntry"
			style={{ marginRight: `${rightOffset}px`, marginLeft: `${leftOffset}px`}}
			onMouseEnter={onMouseOver}
		>
			<div className="b2-white facilityName">{facility.entityData.properties.name}</div>
			{currentFloorPlan &&
				<div className="b2-bright-gray floorPlan">
					<Eye className={dir == "rtl" ? "eyeIconRTL" : "eyeIcon"} />
					<div>{currentFloorPlan.name}</div>
				</div>
			}
			{openSettings && 
				<Popover
					open={openSettings}
					onClose={() => setSettingsAnchorEl(null)}
					anchorEl={settingsAnchorEl}
					anchorOrigin={{ vertical: "bottom", horizontal: "center"}}
					transformOrigin={{ vertical: "bottom", horizontal: "center"}}
				>
					<div className="mapFloorPlanEntrySettings" onMouseLeave={() => setSettingsAnchorEl(null)}>
						<div className="header">
							<TargetingIconContainer entities={[facility]} />
							<div className="b2-white facilityName">{facility.entityData.properties.name}</div>
							<CloseCircle className="closeBtn" onClick={closeFloorPlanEntry} />
						</div>
						<div className="content">	
							<Fragment>
								{renderFloorPlanSettingEntry(-1, -1, "Display none")}
								{floorPlans && floorPlans.map((floorPlan, index) => {
									return renderFloorPlanSettingEntry(index, floorPlan.id, floorPlan.name);
								})}
							</Fragment>
						</div>
					</div>
				</Popover>
			}
		</div>
	);
};

MapFloorPlanEntry.propTypes = propTypes;
export default MapFloorPlanEntry;