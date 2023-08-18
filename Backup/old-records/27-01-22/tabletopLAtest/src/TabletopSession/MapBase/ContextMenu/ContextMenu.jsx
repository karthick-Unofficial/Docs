import _ from "lodash";
import React, { Fragment, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Popover, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ChevronLeft, ChevronRight, AccountDetails, CubeSend, Eye, EyeOff, FileAccount, FileUpload, FloorPlan, MapLegend, OfficeBuildingMarker } from "mdi-material-ui";
import { ContextMenuItem } from "orion-components/Map/ContextMenu";
import Switch from "../../../shared/components/Switch";
import { getEntitiesForMapFeatures, getGeometryFloorPlan } from "../mapUtilities";
import UploadGuardOrders from "./UploadGuardOrders";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	map: PropTypes.object.isRequired,
	userInfo: PropTypes.object,
	sessionId: PropTypes.string,
	facilitator: PropTypes.string,
	controller: PropTypes.string,
	orgId: PropTypes.string,
	userMappings: PropTypes.array,
	simId: PropTypes.number,
	floorPlans: PropTypes.object,
	mapLayerSettings: PropTypes.object,
	mapFloorPlanSettings: PropTypes.object,
	modificationsActive: PropTypes.bool.isRequired,
	modificationsConfig: PropTypes.object,
	simulationMode: PropTypes.string,
	locationHistory: PropTypes.object,
	fovAgents: PropTypes.array,
	updatePersistedState: PropTypes.func.isRequired,
	loadAgentProfile: PropTypes.func.isRequired,
	loadFacilityProfile: PropTypes.func.isRequired,
	openMapLayersWidget: PropTypes.func.isRequired,
	fetchLocationHistory: PropTypes.func.isRequired,
	clearLocationHistory: PropTypes.func.isRequired,
	triggerCreateModification: PropTypes.func.isRequired,
	displayGuardOrders: PropTypes.func.isRequired,
	displayFov: PropTypes.func.isRequired,
	hideFov: PropTypes.func.isRequired,
	persistMapFloorplanControlState: PropTypes.func.isRequired,
	handleApiError: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const useStyle = makeStyles({
	paper: {
		boxShadow: "rgb(0,0,0,0.7) -5px 5px 10px 0px"
	}
});

const ContextMenu = ({ 
	map,
	userInfo,
	sessionId,
	facilitator,
	controller,
	simId,
	userMappings,
	orgId,
	floorPlans,
	mapLayerSettings,
	mapFloorPlanSettings,
	modificationsActive,
	modificationsConfig,
	simulationMode,
	locationHistory,
	fovAgents,
	updatePersistedState,
	loadAgentProfile,
	loadFacilityProfile,
	openMapLayersWidget,
	fetchLocationHistory,
	clearLocationHistory,
	triggerCreateModification,
	displayGuardOrders,
	displayFov,
	hideFov,
	persistMapFloorplanControlState,
	handleApiError,
	dir
}) => {
	const [clickPoint, setClickPoint] = useState(null);
	const [anchorPosition, setAnchorPosition] = useState(null);
	const [multipleEntitiesAvailable, setMultipleEntitiesAvailable] = useState(false);
	const [entitiesAvailable, setEntitiesAvailable] = useState(null);
	const [selectedEntity, setSelectedEntity] = useState(null);
	const [subMenuCommand, setSubMenuCommand] = useState(null);
	const [uploadGuardOrderData, setUploadGuardOrderData] = useState(null);
	const [controllerRole, setControllerRole] = useState(null);

	const classes = useStyle();

	const handleContextMenu = (e) => {
		const features = map.queryRenderedFeatures(e.point).filter(feature => feature.source !== "composite");
		const entities = getEntitiesForMapFeatures(features);
		e.preventDefault();
		setEntitiesAvailable(entities);
		if (entities.count > 1) {
			setMultipleEntitiesAvailable(true);
			setSelectedEntity(null);
		} else if (entities.count == 1) {
			if (entities.agents.length === 1) {
				setSelectedEntity(entities.agents[0]);
			} else if (entities.objectives.length === 1) {
				setSelectedEntity(entities.objectives[0]);
			} else if (entities.interdictionSites.length === 1) {
				setSelectedEntity(entities.interdictionSites[0]);
			} else if (entities.facilities.length === 1) {
				setSelectedEntity(entities.facilities[0]);
			}
			setMultipleEntitiesAvailable(false);
		}
		const { x, y } = e.point;
		const mapBounds = e.originalEvent.target.getBoundingClientRect();
		setAnchorPosition({ top: y + mapBounds.top, left: x + mapBounds.left });
		setClickPoint([e.lngLat.lng, e.lngLat.lat]);
	};

	const handleClose = useCallback(() => {
		setAnchorPosition(null);
		setMultipleEntitiesAvailable(false);
		setEntitiesAvailable(null);
		setSelectedEntity(null);
		setSubMenuCommand(null);
	}, []);

	useEffect(() => {
		map.on("contextmenu", handleContextMenu);
		return () => {
			map.off("contextmenu", handleContextMenu);
			handleClose();
		};
	}, []);

	useEffect(() => {
		if (facilitator && controller && userMappings) {
			if (facilitator === controller) {
				setControllerRole(null);
			} else {
				const controllerMapping = userMappings.find(mapping => mapping.userId === controller);
				if (controllerMapping) {
					setControllerRole(controllerMapping.userRole);
				}
			}
		}
	}, [ facilitator, controller, userMappings ]);

	const renderHeader = (caption, backCommand) => {
		return (
			<MenuItem className="headerMenuItem">
				<div className="container">
					{backCommand &&
						dir == "rtl" ? <ChevronRight className="backBtn" onClick={backCommand}/> :  <ChevronLeft className="backBtn" onClick={backCommand} />
					}
					<div className="caption">{caption}</div>
				</div>
			</MenuItem>
		);
	};

	const renderContextMenuItem = (name, description, Icon, iconAltFunc, clickHandler, iconProps = {}, closeOnClick = true) => {
		return (
			<ContextMenuItem 
				key={name} 
				onClick={() => {
					clickHandler(); 
					if (closeOnClick) {
						handleClose();
					}
				}}
			>
				{iconAltFunc && 
					<ListItemIcon className="icon">
						{iconAltFunc()}
					</ListItemIcon>
				}
				{Icon &&
					<ListItemIcon className="icon">
						<Icon {...iconProps} />
					</ListItemIcon>
				}
				<ListItemText primary={description} />
			</ContextMenuItem>
		);
	};

	// Map features dont include altitude in the geometry. So if the entityt properties contain an altitude,
	// setup a geometry accordingly and return.
	const getGeometryWithAltitude = ( entity ) => {
		let geometry = entity.geometry;
		if (entity.properties.hasOwnProperty("altitude") && entity.geometry.coordinates.length === 2) {
			geometry = {
				...entity.geometry,
				coordinates: [...entity.geometry.coordinates, entity.properties.altitude]
			};
		}
		return geometry;
	};

	const renderItemsForSelectedEntity = () => {
		if (selectedEntity.properties.entityType === "agent") {
			const geometry = getGeometryWithAltitude(selectedEntity);
			const facilityDetails = getGeometryFloorPlan(geometry, floorPlans);
			return (
				<Fragment>
					{renderContextMenuItem("viewAgent", <Translate value="tableopSession.mapBase.contextMenu.viewDetails"/>, AccountDetails, null,
						() => loadAgentProfile(selectedEntity.properties.id))}
					{selectedEntity.properties.team === "BLUE" && userInfo.isFacilitator &&
						renderContextMenuItem("uploadOrders", <Translate value="tableopSession.mapBase.contextMenu.uploadOrders"/>, FileUpload, null, 
							() => setUploadGuardOrderData({ orgId, name: selectedEntity.properties.name })
						)
					}
					{selectedEntity.properties.team === "BLUE" &&
						(userInfo.isFacilitator || userInfo.userRole === selectedEntity.properties.team) &&
						renderContextMenuItem("viewOrders", <Translate value="tableopSession.mapBase.contextMenu.viewOrders"/>, FileAccount, null, 
							() => displayGuardOrders(orgId, selectedEntity.properties.name)
						)
					}
					{facilityDetails.inFacility &&
						renderContextMenuItem("showAgentFloorPlan", <Translate value="tableopSession.mapBase.contextMenu.openFloorPlan"/>, FloorPlan, null,
							() => loadFacilityProfile(facilityDetails.facilityId, facilityDetails.floorPlanId))
					}
					{renderContextMenuItem("fov", <Translate value="tableopSession.mapBase.contextMenu.showHideFOV"/>,
						fovAgents && fovAgents.includes(selectedEntity.properties.id) ? Eye : EyeOff, null, 
						() => {
							if (fovAgents && fovAgents.includes(selectedEntity.properties.id)) {
								hideFov(selectedEntity.properties.id);
							} else {
								displayFov(selectedEntity.properties.id);
							}
						},
						{ style: {opacity: fovAgents && fovAgents.includes(selectedEntity.properties.id) ? 1 : 0.5}}
					)}
					{((userInfo && userInfo.isFacilitator) || simulationMode === "playback") && selectedEntity.properties.enabled &&
						renderContextMenuItem("trackHistory", <Translate value="tableopSession.mapBase.contextMenu.showHideTrackHist"/>,
							locationHistory && locationHistory.hasOwnProperty(selectedEntity.properties.id) ? Eye : EyeOff, null, 
							() => {
								if (locationHistory && locationHistory.hasOwnProperty(selectedEntity.properties.id)) {
									clearLocationHistory(selectedEntity.properties.id);
								} else {
									fetchLocationHistory(sessionId, simId, selectedEntity.properties.id);
								}
							},
							{ style: {opacity: locationHistory && locationHistory.hasOwnProperty(selectedEntity.properties.id) ? 1 : 0.5}}
						)
					} 
					{modificationsActive && (userInfo.isFacilitator 
						|| (userInfo.selfAgentIds && userInfo.selfAgentIds.includes(selectedEntity.properties.id))
						|| (userInfo.controlledAgentIds && userInfo.controlledAgentIds.includes(selectedEntity.properties.id))) && 
						!selectedEntity.properties.neutralized
						&& (!controllerRole || controllerRole === selectedEntity.properties.team) &&
						<Fragment>
							<div className="divider" />
							{renderContextMenuItem("modifyActions", <Translate value="tableopSession.mapBase.contextMenu.modifyActions"/>, CubeSend, null,
								() => setSubMenuCommand("Modify Actions"), null, false)}
						</Fragment>
					}
				</Fragment>
			);
		} else if (selectedEntity.properties.type === "Facility") {
			return (
				<Fragment>
					{renderContextMenuItem("viewFacility", <Translate value="tableopSession.mapBase.contextMenu.facProfile"/>, OfficeBuildingMarker, null,
						() => loadFacilityProfile(selectedEntity.properties.id))}
					{renderContextMenuItem("showFloorPlans", <Translate value="tableopSession.mapBase.contextMenu.floorPlans"/>, FloorPlan, null,
						() => setSubMenuCommand("Floor Plans"), null, false)}
					{modificationsActive && (userInfo.isFacilitator || !controllerRole || controllerRole === userInfo.userRole) &&
						<Fragment>
							<div className="divider" />
							{renderContextMenuItem("createObjective", <Translate value="tableopSession.mapBase.contextMenu.createObj"/>, CubeSend, null,
								() => createObjectiveModification())}
						</Fragment>
					}
				</Fragment>
			);
		} else if (selectedEntity.properties.entityType === "objective" || selectedEntity.properties.entityType === "interdictionSite") {
			const geometry = getGeometryWithAltitude(selectedEntity);
			const facilityDetails = getGeometryFloorPlan(geometry, floorPlans);
			if (facilityDetails.inFacility) {
				return (
					<Fragment>
						{renderContextMenuItem("showEntityFloorPlan", <Translate value="tableopSession.mapBase.contextMenu.openFloorPlan"/>, FloorPlan, null,
							() => loadFacilityProfile(facilityDetails.facilityId, facilityDetails.floorPlanId))}
					</Fragment>
				);
			} else {
				return (
					<Fragment>
						{renderContextMenuItem("entityNoActions", <Translate value="tableopSession.mapBase.contextMenu.noActions"/>, null, null, () => {})}
					</Fragment>
				);
			}
		} else {
			return (
				<Fragment>
					{renderContextMenuItem("noActions", <Translate value="tableopSession.mapBase.contextMenu.noActions"/>, null, null, () => {})}
				</Fragment>
			);
		}
	};

	const disabledAgentsDisplayed = () => {
		let displayed = true;
		_.values(mapLayerSettings.mapLayers.teams).forEach(team => {
			if (!team.disabled) {
				displayed = false;
			}
		});
		return displayed;
	};

	const displayDisabledAgents = (display) => {
		const newMapLayerSettings = _.cloneDeep(mapLayerSettings);
		_.values(newMapLayerSettings.mapLayers.teams).forEach(team => {
			team.disabled = display;
		});
		updatePersistedState("tabletop-app", "mapLayerSettings", newMapLayerSettings);
	};

	const renderItemsForMap = () => {
		return (
			<Fragment>
				{renderContextMenuItem("displayTimeline", <Translate value="tableopSession.mapBase.contextMenu.timelineControl"/>, null,
					() => { return (
						<div style={dir == "rtl" ? {marginRight: -16} : {marginLeft: -16}}>
							<Switch 
								checked={mapLayerSettings.displayTimeline}
								name="displayTimeline"
								onChange={() => {
									updatePersistedState("tabletop-app", "mapLayerSettings", 
										{...mapLayerSettings, displayTimeline: !mapLayerSettings.displayTimeline});
									handleClose();
								}}
							/>
						</div>
					);},
					() => {
						updatePersistedState("tabletop-app", "mapLayerSettings", 
							{...mapLayerSettings, displayTimeline: !mapLayerSettings.displayTimeline});
					})
				}
				{renderContextMenuItem("displayFloorPlan", <Translate value="tableopSession.mapBase.contextMenu.floorPlanControl"/>, null,
					() => { return (
						<div style={dir == "rtl" ? {marginRight: -16} : {marginLeft: -16}}>
							<Switch 
								checked={mapLayerSettings.displayFloorPlan}
								name="displayFloorPlan"
								onChange={() => {
									updatePersistedState("tabletop-app", "mapLayerSettings", 
										{...mapLayerSettings, displayFloorPlan: !mapLayerSettings.displayFloorPlan});
									handleClose();
								}}
							/>
						</div>
					);},
					() => {
						updatePersistedState("tabletop-app", "mapLayerSettings", 
							{...mapLayerSettings, displayFloorPlan: !mapLayerSettings.displayFloorPlan});
					})
				}
				<div className="divider" />
				{renderContextMenuItem("showHideFloorPlans", <Translate value="tableopSession.mapBase.contextMenu.showHideActivated"/>, 
					mapFloorPlanSettings.hideAll ? EyeOff : Eye, null,
					() => {
						persistMapFloorplanControlState( 
							{
								...mapFloorPlanSettings, 
								hideAll: !mapFloorPlanSettings.hideAll
							}
						);
					}, { style: {opacity: mapFloorPlanSettings.hideAll ? 0.5 : 1}})
				}
				{renderContextMenuItem("showHideDisabledAgents", <Translate value="tableopSession.mapBase.contextMenu.showHideDisabled"/>, 
					disabledAgentsDisplayed() ? Eye : EyeOff, null,
					() => { displayDisabledAgents(!disabledAgentsDisplayed()); }, 
					{ style: {opacity: disabledAgentsDisplayed() ? 1 : 0.5}})
				}
				{renderContextMenuItem("showMapLayers", <Translate value="tableopSession.mapBase.contextMenu.mapLayers"/>, MapLegend, null,
					() => { openMapLayersWidget(); })
				}
				{modificationsActive && (userInfo.isFacilitator || !controllerRole || controllerRole === userInfo.userRole) &&
					<Fragment>
						<div className="divider" />
						{renderContextMenuItem("createObjective", <Translate value="tableopSession.mapBase.contextMenu.createObj"/>, CubeSend, null,
							() => createObjectiveModification())}
					</Fragment>
				}
			</Fragment>
		);
	};

	const renderSubMenuForFloorPlans = () => {
		return floorPlans[selectedEntity.properties.id].map(floorPlan => {
			return renderContextMenuItem(floorPlan.id, floorPlan.name, FloorPlan, null,
				() => {
					if (!mapLayerSettings.displayFloorPlan) {
						updatePersistedState("tabletop-app", "mapLayerSettings", 
							{...mapLayerSettings, displayFloorPlan: true});
					}
					persistMapFloorplanControlState( 
						{
							...mapFloorPlanSettings, 
							facilityFloorplans: {
								...mapFloorPlanSettings.facilityFloorplans,
								[selectedEntity.properties.id]: floorPlan.id
							}
						}
					);
				}
			);
		});
	};

	const createObjectiveModification = () => {
		triggerCreateModification("createObjective", null, clickPoint, null, null);
	};

	const createAgentModification = (resultDef) => {
		triggerCreateModification("modifyAgent", selectedEntity, null, 
			modificationsConfig.behaviorDefinitions.conditionDefinitions[0], resultDef);
	};

	const renderSubMenuForAgentMods = () => {
		return modificationsConfig.behaviorDefinitions.resultDefinitions.map((resultDef, index) => {
			return renderContextMenuItem(index, resultDef.desc, null, null,
				() => createAgentModification(resultDef));
		});
	};

	return (
		<Fragment>
			<Popover
				open={!!anchorPosition}
				anchorReference="anchorPosition"
				anchorPosition={anchorPosition}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				onClose={handleClose}
				classes={{ paper: classes.paper }}
			>
				<div className="mapContextMenu">
					{multipleEntitiesAvailable && !selectedEntity && 
						<Fragment>
							{renderHeader("Select", null)}
							<div className="entityListContainer">
								{entitiesAvailable.agents.length > 0 && 
									<Fragment>
										<div className="divider" />
										{_.orderBy(entitiesAvailable.agents, "properties.displayName", "asc").map(agent => {
											return renderContextMenuItem(agent.properties.id, agent.properties.displayName, null, null,
												() => setSelectedEntity(agent), null, false);
										})}
									</Fragment>
								}
								{entitiesAvailable.objectives.length > 0 && 
									<Fragment>
										<div className="divider" />
										{_.orderBy(entitiesAvailable.objectives, "properties.name", "asc").map(objective => {
											return renderContextMenuItem(objective.properties.id, objective.properties.name, null, null,
												() => setSelectedEntity(objective), null, false);
										})}
									</Fragment>
								}
								{entitiesAvailable.interdictionSites.length > 0 && 
									<Fragment>
										<div className="divider" />
										{_.orderBy(entitiesAvailable.interdictionSites, "properties.name", "asc").map(interdictionSite => {
											return renderContextMenuItem(interdictionSite.properties.id, interdictionSite.properties.name, null, null,
												() => setSelectedEntity(interdictionSite), null, false);
										})}
									</Fragment>
								}
								{entitiesAvailable.facilities.length > 0 && 
									<Fragment>
										<div className="divider" />
										{_.orderBy(entitiesAvailable.facilities, "properties.name", "asc").map(facility => {
											return renderContextMenuItem(facility.properties.id, facility.properties.name, null, null, 
												() => setSelectedEntity(facility), null, false);
										})}
									</Fragment>
								}
							</div>
						</Fragment>
					}
					{selectedEntity && !subMenuCommand &&
						<Fragment>
							{renderHeader(selectedEntity.properties.name, 
								multipleEntitiesAvailable ? () => setSelectedEntity(null) : null)}
							<div className="divider" />
							{renderItemsForSelectedEntity()}
						</Fragment>
					}
					{selectedEntity && subMenuCommand &&
						<Fragment>
							{renderHeader(subMenuCommand, () => setSubMenuCommand(null))}
							<div className="divider" />
							{subMenuCommand === "Floor Plans" && floorPlans && floorPlans[selectedEntity.properties.id] &&
								renderSubMenuForFloorPlans()
							}
							{subMenuCommand === "Modify Actions" &&
								renderSubMenuForAgentMods()
							}
						</Fragment>
					}
					{entitiesAvailable && entitiesAvailable.count === 0 && 
						<Fragment>
							{renderHeader("Map", null)}
							<div className="divider" />
							{renderItemsForMap()}
						</Fragment>
					}
				</div>
			</Popover>
			{uploadGuardOrderData &&
				<UploadGuardOrders 
					guardOrderData={uploadGuardOrderData} 
					close={() => setUploadGuardOrderData(null)} 
					handleApiError={handleApiError}
					displayGuardOrders={displayGuardOrders}
					dir={dir}
				/>
			}
		</Fragment>
	);
};

ContextMenu.propTypes = propTypes;

export default ContextMenu;
