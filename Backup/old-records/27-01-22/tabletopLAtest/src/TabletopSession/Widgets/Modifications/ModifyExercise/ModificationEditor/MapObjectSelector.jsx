/* eslint-disable react/display-name */
import React, { useState, useEffect, useImperativeHandle, memo } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Button, Radio, Typography } from "@material-ui/core";
import { MapMarkerRadius, MapMarker, MapMarkerPlus } from "mdi-material-ui";
import { getEntitiesForMapFeatures, getGeometryFloorPlan } from "../../../../MapBase/mapUtilities";
import AgentIcon from "../../../../MapBase/LayerSources/MapLayer/AgentIcon";
import { getAvertDataType } from "../../modificationUtility";
import TargetingIconContainer from "../../../../Controls/TargetingIcon/TargetingIconContainer";

const useRadioButtonStyles = makeStyles(() => ({
	root: {
		color: "#828283",
		"&$checked": {
			color: "#4eb5f3"
		}
	},
	checked: {},
	disabled: {
		opacity: 0.5
	}
}));

const propTypes = {
	id: PropTypes.string.isRequired,
	definitionDesc: PropTypes.string, // used as a reference for generating appropriate behaviorResult /  behaviorTrigger.
	map: PropTypes.object,
	controlDataTypes: PropTypes.string, //position|agent|objective|interdictionSite
	value: PropTypes.string,
	required: PropTypes.bool,
	agents: PropTypes.object,
	simulationData: PropTypes.object,
	facilities: PropTypes.object,
	itemSelectionFor: PropTypes.string,
	enableItemSelectionOnMap : PropTypes.func.isRequired,
	itemSelectionHandler : PropTypes.func,
	mapClickedHandler : PropTypes.func,
	floorPlans: PropTypes.object, //Note : floorPlans is a dictionary object containing <facilityId, [floorPlans]>
	headerText: PropTypes.string,
	modificationMode: PropTypes.string
};

const MapObjectSelector = React.forwardRef(({id, definitionDesc, itemSelectionFor, enableItemSelectionOnMap, map, 
	controlDataTypes, value, agents, simulationData, facilities, floorPlans, itemSelectionHandler, mapClickedHandler, headerText, required, modificationMode},
	 ref) => {
	const radioButtonclasses = useRadioButtonStyles();
	
	const getSelectorLabel =() =>{

		let labelTmp = "Choose item at target location";
		
		switch (controlDataTypes.toUpperCase()) {
			case "AGENT":
				labelTmp = "Choose Player";
				break;
			case "POSITION":
				{
					if (!headerText || headerText === ""){
						labelTmp = "Choose Location";
					} else {
						labelTmp = headerText;
					}	
				}
				break;
			case "INTERDICTIONSITE":
				labelTmp = "Choose Interdiction Site";
				break;
			case "OBJECTIVE":
				labelTmp = "Choose Objective";
				break;
			default:
				labelTmp = "Choose item at target location";
				break;
		}

		return labelTmp;
	};

	//Get floorPlans at given clicked Pt.  
	const getFloorPlans = (clickedPt) => {
		const arrFloorPlans = []; //filteredEntities["floorPlans"] = [];

		//Note : floorPlans is a dictionary object containing <facilityId, [floorPlans]>
		const geometry = {coordinates:[clickedPt.lng, clickedPt.lat], type:"Point"};
		const floorResult = getGeometryFloorPlan(geometry, floorPlans);
		if (floorResult.inFacility){
			const facilityFloorPlans = floorPlans[floorResult.facilityId];
			//floorResult.floorPlanId
			facilityFloorPlans.forEach(flr => {
				const facilityName = facilities[floorResult.facilityId].entityData.properties.name;
				const geometryTmp = _.cloneDeep(geometry); 
				geometryTmp.coordinates[2] = flr.altitude;

				const flrEnt = {
					id: flr.id,
					name: flr.name,
					altitude: flr.altitude,
					facilityId: floorResult.facilityId,
					facilityName: facilityName,
					entityType: "floorPlan",
					displayName: `${facilityName}: ${flr.name}`,
					geometry: geometryTmp
				};
				//filteredEntities["floorPlans"].push(flrEnt);
				arrFloorPlans.push(flrEnt);
			});
		}

		return arrFloorPlans;
	};

	const createValue = (id, name, entityType, coordinate) =>{
		//id: "0", entityType: "position", name: "position1", displayName: "Position - 1", coordinate: [e.lngLat.lng, e.lngLat.lat, 0]

		const retVal = {id: id, name: name, entityType: entityType, displayName: name, avertDataType: getAvertDataType(entityType)
		};

		if (typeof(coordinate) === "object"){
			retVal.coordinates = coordinate.join(",");
			//retVal.geometry = {coordinates: coordinate, type:"Point"};
			retVal.entityData = {
				properties: {
					entityType: entityType
				},
				geometry: {coordinates: coordinate, type:"Point"}
			};
		} else {
			retVal.coordinates = coordinate? coordinate: null;
			if (retVal.coordinates){
				const arr = retVal.coordinates.split(",");
				retVal.geometry = {coordinates:[parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2])], type:"Point"};
			}	
		}

		return retVal;
	};

	//create Lat, Lon object, either deduced from sourceEntity OR other parameters to create object.
	const createMapLatLon = (sourceEntity, latitude, longitude, altitude) =>{
		let lng, lat, z=0;

		if (sourceEntity){
			if (sourceEntity.entityData){
				lng = sourceEntity.entityData.geometry.coordinates[0];
				lat = sourceEntity.entityData.geometry.coordinates[1];
				z = sourceEntity.entityData.geometry.coordinates[2]? sourceEntity.entityData.geometry.coordinates[2]: 0;
			} else if (sourceEntity.entity){
				lng = sourceEntity.entity.geometry.coordinates[0];
				lat = sourceEntity.entity.geometry.coordinates[1];
				z = sourceEntity.entity.geometry.coordinates[2]? sourceEntity.entity.geometry.coordinates[2]: 0;
			} else{
				lng = sourceEntity.geometry.coordinates[0];
				lat = sourceEntity.geometry.coordinates[1];
				z = sourceEntity.geometry.coordinates[2]? sourceEntity.geometry.coordinates[2]: 0;
			}
		} else{
			lng = longitude;
			lat = latitude;
			z = altitude;
		}

		return {lng: lng, lat: lat, z:z};
	};

	const getExistingValue = () => {
		const entType = controlDataTypes.split("|")[0];
		
		if (!value){
			return null;
		}
		
		if (entType === "position"){
			//value contain coordinate string  e.g. "lon, lat, z" z floor altitude property.
			const arrCoord = value.split(",");
			const altitudeTmp = (arrCoord.length>2)? parseFloat(arrCoord[2]): 0;
			if (altitudeTmp === 0){
				return createValue("0", "Existing Position", entType, value); 
			} else{
				const lngLatTmp = createMapLatLon(null, parseFloat(arrCoord[1]), parseFloat(arrCoord[0]), altitudeTmp);
				const arrFlrPlans = getFloorPlans(lngLatTmp);

				const tmpExistFlrPlan = _.find(arrFlrPlans, (flrEach)=>{
					return flrEach.geometry.coordinates[2] === lngLatTmp.z;
				});

				if (tmpExistFlrPlan){
					return tmpExistFlrPlan;
				} else{
					return createValue(tmpExistFlrPlan.id, tmpExistFlrPlan.name, "floorPlan", value);
				}
			}
		} else{
			let retVal= null;
			let keyName = null;

			switch (entType) {
				case "agent":
					keyName = "agents";
					break;
				case "objective":
					keyName = "objectives";
					break;
				case "interdictionSite":
					keyName = "interdictionSites";
					break;
				default:
					break;
			}

			if (keyName){
				if (entType === "agent"){
					const agnt = _.find(agents, (agent) => {
						return agent.entityData.properties.name === value;
					});
	
					if (agnt){
						retVal = createValue(agnt.id, value, entType, agnt.entityData.geometry.coordinates);
						retVal.entityData.properties["team"] = agnt.entityData.properties.team;
					}
				} else {
					if (simulationData.hasOwnProperty(keyName)){
						const objt = _.find(simulationData[keyName], (obj) => {
							return obj.entityData.properties.name === value;
						});

						if (objt){
							retVal = createValue(objt.id, value, entType, objt.entityData.geometry.coordinates);
						}
					}
				}
			} 
			return retVal;
		}
	};

	const existingValue = getExistingValue();

	const getPositionNameforAvert = (entityType, name) => {

		let coord = null;
		const currName = name;

		if (entityType.toLowerCase() === "position"){
			const existVal = existingValue;
			if (existVal && currName === existVal.name){
				coord = existVal.coordinates;
			} else{
				coord = mapEntities.hasOwnProperty("position") ?  mapEntities["position"][0].coordinates: null;
			}
			return (coord? coord: currName);

		} else if (entityType.toLowerCase() === "floorplan"){
			const existVal = existingValue;
			if (mapEntities.hasOwnProperty("floorPlans")){
				const flrPlan = _.find(mapEntities.floorPlans, (flrP)=>{
					return (flrP.name === name);
				});

				if (flrPlan){
					const coordTmp = flrPlan.geometry.coordinates;
					coord= `${coordTmp[0]},${coordTmp[1]},${coordTmp[2]}`;
				} else {
					coord= null;
				}
				return (coord? coord: currName);
			} 
			else if (existVal && currName === existVal.name){
				coord = existVal.coordinates;
			}
		
		} else{
			return currName;
		}
	};

	const [ selectedValue, setSelectedValue ] = useState(existingValue);
	
	const [ mapEntities, setMapEntities ] = useState( () => {
		const tmpVal = existingValue;
		return tmpVal ? [tmpVal]: null;
	});

	const [ dataForAction, setDataForAction ] = useState(() =>{
		if (!existingValue){
			return null;
		}

		const entTmp = existingValue;
		
		const itemSelectedInfo = {
			entity: entTmp,
			geometry: entTmp.hasOwnProperty("geometry")? entTmp.geometry: (entTmp.entityData? entTmp.entityData.geometry: entTmp.entity.geometry),
			entityType: entTmp.entityType, //"floorPlan", "position"
			selectedName: entTmp.hasOwnProperty("name")? entTmp.name: (entTmp.entityData? entTmp.entityData.properties.name: entTmp.entity.properties.name),
			isItemSelectedOnMap: entTmp.hasOwnProperty("geometry")? true: (entTmp.entityData && entTmp.entityData.geometry? true: false)
		};

		return {
			itemSelectedInfo: itemSelectedInfo,
			mapClickedInfo: null,
			entityType: controlDataTypes
		};
		
	});
	//const [ facility, setFacility ] = useState(null);
	
	useImperativeHandle(ref, () => ({
		getValue: () =>{

			const getDataType = () => {
				if (selectedValue){
					return ((selectedValue.entityType === "floorPlan")? "position": selectedValue.entityType);
				} else {
					const dataTypeTmp = controlDataTypes.split("|");
					if (dataTypeTmp.length === 1){
						return dataTypeTmp[0];
					} else{
						return null;
					}
				}
			};

			return {
				definitionDesc: definitionDesc,
				avertName:"", 
				required: required,
				value: selectedValue? getPositionNameforAvert(selectedValue.entityType, selectedValue.name) : null,
				dataType: getDataType(),
				avertDataType: selectedValue? selectedValue.avertDataType: null
			};
		}
	}));

	const getMapEntitiesAlongWithFloorPlan = (e) =>{
		const features = map.queryRenderedFeatures(e.point)
			.filter(feature => feature.source !== "composite");

		const entities = getEntitiesForMapFeatures(features);

		const filteredEntities ={};
		if (entities.count>0){
			_.forEach(entities, (ent, key) => {
				if (Array.isArray(ent) && (ent.length> 0) && (controlDataTypes.toLowerCase().includes(ent[0].properties.entityType.toLowerCase()))){

					filteredEntities[key] = ent.map( en =>{
						return {
							id: en.properties.id,
							entityType: en.properties.entityType,
							name: en.properties.name,
							displayName: (en.properties.displayName || en.properties.name),
							entity: en
						};
					});
				}
			});
		} 
		
		if (controlDataTypes.includes("position")){
			filteredEntities["floorPlans"] = getFloorPlans(e.lngLat); //PopulateFloorPlans(e.lngLat);

			//Note: If floorplan do not exist on clicked location then display point explicity for selection.
			if (filteredEntities["floorPlans"].length < 1){
				filteredEntities["position"] = [];
				filteredEntities["position"].push({
					id: 1, 
					entityType: "position",
					name: "position1",
					displayName: "Position - 1",
					coordinates: `${e.lngLat.lng},${e.lngLat.lat},0`,
					geometry: {coordinates:[e.lngLat.lng, e.lngLat.lat, 0], type:"Point"}
				});
			}
		}

		return filteredEntities;
	};

	const handleFeatureClick = function(e){
		if ((id !== itemSelectionFor))
		{
			return ;
		}

		const filteredEntitiesTemp = getMapEntitiesAlongWithFloorPlan(e);
		const tmpEntities = getMapEntities(filteredEntitiesTemp);
		
		//Note: Select single entry in list as default selection if required =true
		if (tmpEntities.length === 1 && required){ 
			
			const entTmp = tmpEntities[0];

			const itemSelectedInfo = {
				entity: entTmp,
				geometry: entTmp.hasOwnProperty("geometry")? entTmp.geometry: entTmp.entity.geometry,
				entityType: entTmp.entityType, //"floorPlan", "position"
				selectedName: entTmp.hasOwnProperty("name")? entTmp.name: entTmp.entity.properties.name,
				isItemSelectedOnMap: true
			};

			setSelectedValue(entTmp);
			setMapEntities(filteredEntitiesTemp);
			
			setDataForAction({
				itemSelectedInfo: itemSelectedInfo,
				mapClickedInfo: null,
				entityType: entTmp.entityType
			});
		} 
		else{
			
			//setSelectedValue(null);
			setMapEntities(filteredEntitiesTemp);
			
			let altitudeOfFlrPlan = 0;
			let floorPlanAlreadySelected =false;
			
			if (selectedValue && selectedValue.geometry && selectedValue.geometry.coordinates[2] !== 0){
				floorPlanAlreadySelected =true;
				const selectedValueTmp = _.cloneDeep(selectedValue);
				selectedValueTmp.geometry.coordinates[0] = e.lngLat.lng; // clicked position lon
				selectedValueTmp.geometry.coordinates[1] = e.lngLat.lat; // clicked position lat
				altitudeOfFlrPlan = selectedValueTmp.geometry.coordinates[2];
				setSelectedValue(selectedValueTmp);
			}

			//selected value is present, if its floorplan then  pls update mapClickedInfo geometry z with selected value 'Z' and 
			//update selected value x, y with e.lngLat.lng, e.lngLat.lat and set to reflect.
			// on editor side check for floorPlanAlreadySelected =true and enable "Save" button.
			
			const mapClickedInfo = {
				geometry: {coordinates:[e.lngLat.lng, e.lngLat.lat, altitudeOfFlrPlan], type:"Point"},
				isItemSelectedOnMap: true,
				floorPlanAlreadySelected: floorPlanAlreadySelected
			};

			setDataForAction({
				itemSelectedInfo: null,
				mapClickedInfo: mapClickedInfo,
				entityType: null //NA
			});
		}
	}; 

	useEffect(() => {
		if (map && (id === itemSelectionFor)){
			map.on("click", handleFeatureClick);
		}

		return () => {
			map && map.off("click", handleFeatureClick);
		};
	}, [map, itemSelectionFor]);

	useEffect(() => {
		console.log(modificationMode); //delete
		
		if (dataForAction){
			if (dataForAction && dataForAction.itemSelectedInfo && itemSelectionHandler){
				itemSelectionHandler(dataForAction.itemSelectedInfo); 
			} 
			else if (dataForAction && dataForAction.mapClickedInfo && mapClickedHandler){
				mapClickedHandler(dataForAction.mapClickedInfo, false);
			}
		}
	}, [dataForAction]);

	const iconConfig = {
		agent: "static/map-icons/map-transparent.svg",
		objective: "static/map-icons/map-objective.svg",
		interdictionSite: "static/map-icons/map-interdiction-point.svg",
		facility: "static/map-icons/map-facility.svg",
		BLUE_barrierBreach: "static/map-icons/map-blue-barrier-breach.svg",
		RED_barrierBreach: "static/map-icons/map-red-barrier-breach.svg",
		RED_targetDestroyed: "static/map-icons/map-target-destroyed.svg"
	};

		//icon can be fetch from 
	const getIcon = (entity) =>{
		return (
			<div>
				{
					(entity.entityType.toLowerCase() === "position" || entity.entityType.toLowerCase() === "floorplan" || entity.entityType.toLowerCase() === "facility") 
					&& <MapMarker style={{textAlign: "left", width:20, height:26, marginLeft:10, marginTop:8}} />
				}
				{
					(entity.entityType.toLowerCase() === "agent") && <AgentIcon size={45} agent={agents[entity.id]} group={false} />
				}
				{
					(entity.entityType.toLowerCase() === "objective") && <img style={{height: 45, width: 45}} src={iconConfig["objective"]} />
				}
				{
					(entity.entityType.toLowerCase() === "interdictionsite") && <img style={{height: 45, width: 45}} src={iconConfig["interdictionSite"]} />
				}
			</div>
		);
	};

	const enableItemSelection = (event, id) => {
		enableItemSelectionOnMap(id);
	};

	const handleRadioButtonChange = (event, entityType) => {
		setSelectedValue(createValue(event.target.value, event.target.name, entityType));
		
		const entTmp = entitiesAtClickedLocns.find( m=> {
			return (m.name === event.target.name);
		});
		
		let geom = null;
		
		if (entTmp.hasOwnProperty("geometry")){
			geom = entTmp.geometry;
		} else if (entTmp.hasOwnProperty("entity")){
			geom = entTmp.entity.geometry;
		}

		const itemSelectedInfo = {
			entity: entTmp,
			geometry: geom,
			entityType: entityType, //"floorPlan", "position"
			selectedName: event.target.name,
			isItemSelectedOnMap: true
		};

		setDataForAction({
			itemSelectedInfo: itemSelectedInfo,
			mapClickedInfo: null,
			entityType: entityType
		});
		 
	};

	let entitiesAtClickedLocns = [];
	const getMapEntities = (entities) => {
		
		entitiesAtClickedLocns = [];
		entities && _.map(entities, (ent) =>{
			entitiesAtClickedLocns = entitiesAtClickedLocns.concat(ent);
		}) || [];

		if (entitiesAtClickedLocns.length>0){
			entitiesAtClickedLocns = _.sortBy(entitiesAtClickedLocns, ["entityType", "name"]);
		}
		
		return entitiesAtClickedLocns;
	};

	const getTargetIcon = (entityForTarget) =>{

		const ent = _.cloneDeep(entityForTarget);
		if (ent.entityType !== "position"){
			if (!ent.hasOwnProperty("entityData")){
				ent.entityData= {};
				ent.entityData.geometry = ent.geometry? ent.geometry : ent.entity.geometry;
			} 
		}
		
		if (ent.entityData && ent.entityData.geometry || (ent.geometry? ent.geometry : ent.entity.geometry)){
			return  <TargetingIconContainer marginTop={5} entities={ent.entityData? [ent] : null} geometries={ent.geometry? [ent.geometry] : null}/>;
		}
		else {
			return  null;
		}			
	};

	//let alreadySelected = false;
	const isChecked = (ent) =>{
		if (selectedValue && selectedValue.name === ent.name)
		{
			return true;
		} else {
			return false;
		}
	};

	return (
		<div id={id} className="modificationflexColumn" style={{backgroundColor:"#3C4656", borderRadius: 5}}>
			<div className="modificationflex" style={{width:"100%", justifyContent:"flex-start", alignItems: "center"}}>
				<MapMarkerRadius style={{textAlign: "left", width:20, height:26, marginLeft:10}} />
				<Typography variant="body1" className="b1-white" 
					style={{margin:10, textAlign:"left", flex:1, fontSize:16}}>{getSelectorLabel()}</Typography>
				
				<Button color="primary" onClick={(e) => enableItemSelection(e, id)} 
					style={{visibility:(id === itemSelectionFor)? "hidden": "visible", marginLeft:10, marginRight:20}}
					size="small"
				>
					<MapMarkerPlus 
						style={{cursor: "pointer", width:20, height:26, marginRight: 5}}/>
					Select On Map
				</Button>
			</div>
			{
				mapEntities &&
					<div style={{overflowY: "scroll", maxHeight: (id === itemSelectionFor)? 400: 200}}>
						{
							getMapEntities(mapEntities).map((ent) => {
								return (
									<div key={`div-${ent.id}`} className="modificationItemContainer" style={{marginTop:5, marginBottom:5}}>
										{/* target icon */}
										<div style={{width:45, visibility:"visible", alignSelf: "start"}}>
											{
												getTargetIcon(ent)
											}
										</div>
										<div>
											<Radio 
												checked={isChecked(ent)}
												onChange={(e) => handleRadioButtonChange(e, ent.entityType)}
												value= {ent.id}
												name={ent.name}
												classes={{
													root: radioButtonclasses.root,
													checked: radioButtonclasses.checked,
													disabled: radioButtonclasses.disabled
												}}
											/>
										</div>
										{
											getIcon(ent)
										}
										<div style={{width:"100%"}}>
											<Typography variant="body1" className="b1-white" 
												style={{margin:10, textAlign:"left", flex:1, fontSize:16}}>{ent.displayName}</Typography>
										</div>
									</div>
								);
							})
						}
					</div>
			}
		</div>
	);
});

MapObjectSelector.propTypes = propTypes;
export default memo(MapObjectSelector);


