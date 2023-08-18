import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {  Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { SelectField } from "orion-components/CBComponents";
import { 
	getDisplayText, 
	getResultParameterOption, 
	createBehaviorResultForModification, 
	createBehaviorTriggerForModification,
	isValidLocation 
} from "../../modificationUtility";
import Text from "./Text";
import MapObjectSelectorContainer from "./MapObjectSelectorContainer";
import editorConfig from "./editorConfig";
import TargetingIconContainer from "../../../../Controls/TargetingIcon/TargetingIconContainer";
import AgentIcon from "../../../../MapBase/LayerSources/MapLayer/AgentIcon";
import MapObjectConnectorContainer from "../../../../shared/components/MapObjectConnectorContainer";

const propTypes = {
	map: PropTypes.object,
	simTime: PropTypes.number,
	data: PropTypes.object.isRequired,
	modificationMode: PropTypes.string,
	modificationsConfig : PropTypes.object,
	createModification: PropTypes.func,
	updateModification: PropTypes.func,
	onSaveModification: PropTypes.func,
	onCancelModication: PropTypes.func,
	raiseError: PropTypes.func.isRequired,
	floorPlans: PropTypes.object
};

const ModificationEditor = ( { map, simTime, data, modificationMode, modificationsConfig, 
	createModification, updateModification, onSaveModification, onCancelModication, floorPlans, raiseError} ) => {
	
	//Note: for result control only fetch map items on click.
	const [ itemSelectionFor, setItemSelectionFor] = useState("result"); 
	const [ conditionNode, setConditionNode ] = useState(null);
	const [ canChangeCondition, setCanChangeCondition ] = useState(false);
	const [ resultNode, setResultNode ] = useState(null);
	//const [ validationFailed, setValidationFailed ] = useState(false);
	const [ mapEntitySelectedForCondition, setMapEntitySelectedForCondition ] = useState(null); 
	const [ mapEntitySelectedForResult, setMapEntitySelectedForResult ] = useState(null);
	const [ floorPlanToDisplay, setFloorPlanToDisplay ] = useState(null);
	const [ floorPlanToRemove, setFloorPlanToRemove ] = useState(null);

	
	const getInitialRequiredState = () => {
		if (modificationMode === "ADD"){
			return data.externalMessage.resultDef.paramDefinitions[0].required;
		} else{ 
			const behaviors = data.objectType === "AGENT_GROUP" ? data.object.groupBehaviors : data.object.behaviors;
			const beh = behaviors[0];
			if (beh.behaviorResult.parameterMap){
				const resultParamOptionsName = Object.keys(beh.behaviorResult.parameterMap)[0];
				const valueTmp = beh.behaviorResult.parameterMap[resultParamOptionsName].required;
				return valueTmp;
			} else{
				return false;
			}
		}
	};

	// const initialstateofResult = () =>{
	// 	//incase parameterMap is null (in case paramDefinitions is null, see e.g. of Diable/Enable Agent, Weapon filre etc)
	// 	if (modificationMode === "EDITED"){
	// 		const behaviors = data.objectType === "AGENT_GROUP" ? data.object.groupBehaviors : data.object.behaviors;
	// 		const beh = behaviors[0];
	// 		if (!beh.behaviorResult.parameterMap){
	// 			const resultParamOptionsName = Object.keys(beh.behaviorResult.parameterMap)[0];
	// 			const valueTmp = beh.behaviorResult.parameterMap[resultParamOptionsName].required;
	// 			return valueTmp;
	// 		} else{
	// 			return null;
	// 		}
	// 	} else {
	// 		return null;
	// 	}
	// };

	const [ selectedItemForResult, setSelectedItemForResult ] = useState(null); //useState(initialstateofResult());
	const [ selectedItemForCondition, setSelectedItemForCondition ] = useState(null);
	const [ resultItemRequired ] = useState(getInitialRequiredState());

	//const [ disableSave, setDisableSave ] = useState(true);
	
	const getBehaviorKey = () =>{
		const behavior = (data.objectType === "AGENT_GROUP")? data.object.groupBehaviors[0]: data.object.behaviors[0];
		return behavior.behaviorTrigger.behaviorTriggerType;
	};

	const [ behaviorKey, setBehaviorKey ] = useState(getBehaviorKey());
	
	const handleBehaviorChange = (behaviorKey) => {
		setBehaviorKey(behaviorKey);
		setConditionNode(null);
		setCanChangeCondition(true);
		//setMapEntitySelectedForResult(null);
		setMapEntitySelectedForCondition(null);
		setSelectedItemForCondition(null);
		
	};

	const getBehaviorList = ()=> {
		const itemsArray =[];
		
		modificationsConfig["behaviorDefinitions"]["conditionDefinitions"].forEach(condn => {
			itemsArray.push({id: condn.avertName, value: condn.desc});
		});
		
		return itemsArray;
	};

	//#region handler
	
	const handleClose = () => {
		setConditionNode(null);
		setResultNode(null);
		setMapEntitySelectedForCondition(null);
		setMapEntitySelectedForResult(null);
		setItemSelectionFor("result");
		onCancelModication();

	};

	const addEditModifications = async () => {
		
		try {
			
			const dataToSave = _.cloneDeep(data);
	
			const behavior = (dataToSave.objectType === "AGENT_GROUP")? dataToSave.object.groupBehaviors[0]: dataToSave.object.behaviors[0];
			
			const condValue = conditionNode.hasOwnProperty("wrappedInstance")? conditionNode.wrappedInstance.getValue() : conditionNode.getValue();
			behavior.behaviorTrigger = createBehaviorTriggerForModification((condValue.avertName !== "")? condValue.avertName: behaviorKey, 
				modificationsConfig, condValue.value);
	
			//  if (condValue.value === null || condValue.value < 0){
			// 	return;
			//  }
			
			//const resultDefinitions = dataToSave.externalMessage.resultDef;
			if (resultNode){
				const resultValue = resultNode.hasOwnProperty("wrappedInstance")? resultNode.wrappedInstance.getValue() : resultNode.getValue();
				
				// if (!resultValue.required && Boolean(resultValue.value) === false){
				// 	return;
				// }

				//check if selected location is valid in case of location selection, do include z value as well. 
				if (resultValue.dataType === "position"){
					try {
						const arrLanLonZee = resultValue.value.split(",");
						if (arrLanLonZee.length>1){
							const lonTmp = parseFloat(arrLanLonZee[0]);
							const latTmp = parseFloat(arrLanLonZee[1]);
							const zTmp = arrLanLonZee.length>2 ? parseFloat(arrLanLonZee[2]) : 0;
							const validObj = await isValidLocation(dataToSave.tabletopSessionId, lonTmp, latTmp, zTmp);
							if (!validObj.success){
								if (validObj.errMsg){
									raiseError(validObj.errMsg);
								} else{
									raiseError("Selected location is invalid. Please select another location.");
								}
								return;	
							} 
						}
					} catch (error) {
						console.log(error);
					}
				}
				const resultParamOption = getResultParameterOption(resultValue.definitionDesc, resultValue.dataType, modificationsConfig);
				behavior.behaviorResult = createBehaviorResultForModification(resultParamOption.avertName, resultParamOption.name, resultValue.dataType, resultValue.required, resultValue.value);
			}

			delete behavior["resultDefinitions"];
			delete behavior["conditionDefinitions"];

			delete dataToSave["externalMessage"];
			delete dataToSave["agents"];
			
			//Todo: At present no need to save becoz it contain weapon info as equipment, we need to modify to handle weapons.
			dataToSave.object.equipment = null; 

			if (modificationMode == "ADD"){
				delete dataToSave["id"];
				createModification(dataToSave.tabletopSessionId, dataToSave);
			} else{
				updateModification(dataToSave.tabletopSessionId, dataToSave);
			}
			removeCurrentFloorPlan();	
			onSaveModification({success: true, errorMessage: ""});

		} catch (error) {
			console.log(error);			
		}
	};

	//#endregion

	useEffect(() => {
		
		if (!map || !floorPlans || (floorPlans.length<1)) {
			return;
		}

		if (floorPlanToDisplay){
			
			const floorPlansTmp = floorPlans[floorPlanToDisplay.facilityId];
			const floorPlan =  _.find(floorPlansTmp, (flrp) => {
				return (flrp.id ===	floorPlanToDisplay.id); //its floor plan id
			});

			const imgSrc = `/_download?handle=${floorPlan.handle}`;
			const coords = floorPlan.geometry.coordinates[0].filter((coord, index) => index < 4);
			const sourceData = {
				type: "image",
				url: imgSrc,
				coordinates: coords
			};
			const facilityId = `mod-${floorPlanToDisplay.facilityId}`;

			try {
				if (!map.getSource(`${facilityId}-map-floor-plan-source`)) {
					map.addSource(`${facilityId}-map-floor-plan-source`, sourceData);
					map.addLayer({
						id: `${facilityId}-map-floor-plan-overlay`,
						source: `${facilityId}-map-floor-plan-source`,
						type: "raster",
						paint: {
							"raster-opacity": 1.0
						}
					}, "country-label-sm");
				}
			} catch (error) {
				console.log("Error occurred when adding FloorPlanLayer");
			}

			setFloorPlanToRemove( _.cloneDeep(floorPlanToDisplay)); // used to remove last floor plan from map.
			//console.log("floorPlanToRemove is set.");
		}

		return () => {
			try {
				removeCurrentFloorPlan();
			} catch (error) {
				console.log("Error occurred when cleaning up FloorPlanLayer");
			}
			
		};

	}, [floorPlanToDisplay]);

	const enableItemSelectionOnMapForCondition = (id) => {
		setItemSelectionFor(id);
	};

	const enableItemSelectionOnMapForResult = (id) => {
		setItemSelectionFor(id);
	};

	const removeCurrentFloorPlan = () => {
		
		if (floorPlanToRemove) {
			const facilityId = `mod-${floorPlanToRemove.facilityId}`;
			try {
				if (map && map.getSource(`${facilityId}-map-floor-plan-source`)) {
					map.removeLayer(`${facilityId}-map-floor-plan-overlay`);
					map.removeSource(`${facilityId}-map-floor-plan-source`);
				}	
			} catch (error) {
				console.log("Modification Editor: Error removing floorPlan.");		
			}
			//console.log("Modification Editor: FloorPlan is Removed.");	
		}
	};

	const resultItemSelectionHandler = (selectedItemInfo) => {
		
		if (!selectedItemInfo){
			setSelectedItemForResult(null);
			return;
		}

		if (selectedItemInfo.isItemSelectedOnMap){
			drawSelectionForResult(selectedItemInfo, true); //draw selection on map
		}

		setSelectedItemForResult(selectedItemInfo); //to enable/Disable Save button

		if (selectedItemInfo.hasOwnProperty("entityType") && selectedItemInfo.entityType.toLowerCase() === "floorplan"){
			
			if (!floorPlanToRemove){
				setFloorPlanToRemove( _.cloneDeep(selectedItemInfo.entity)); // used to remove last floor plan from map.
			}
			setFloorPlanToDisplay(selectedItemInfo.entity);
		} 
		else{
			setFloorPlanToDisplay(null);
		}
	};

	const conditionItemSelectionHandler = (selectedItemInfo) => {

		if (!selectedItemInfo){
			setSelectedItemForCondition(null);
			//setFloorPlanToDisplay(null);
			return;
		}

		if (selectedItemInfo.isItemSelectedOnMap){
			drawSelectionForCondition(selectedItemInfo, true); //draw selection on map
		}
		setSelectedItemForCondition(selectedItemInfo); //to enable/Disable Save button
	};

	const drawSelectionForCondition = (clickedItemInfo, itemSelected) => {

		if (clickedItemInfo.hasOwnProperty("entity")){
			setMapEntitySelectedForCondition(clickedItemInfo.entity);
		} else if (clickedItemInfo.hasOwnProperty("geometry")){
			 setMapEntitySelectedForCondition(clickedItemInfo.geometry);
		}

		if (!itemSelected){
			setSelectedItemForCondition(null);
		}
	};

	const drawSelectionForResult = (clickedItemInfo, itemSelected) => {
		
		if (floorPlanToDisplay && !itemSelected && clickedItemInfo.hasOwnProperty("entityType") && clickedItemInfo.entityType.toLowerCase() === "floorplan"){
			//setFloorPlanToRemove(floorPlanToDisplay); // used to remove last floor plan from map.
			setFloorPlanToDisplay(null);
		}

		if (clickedItemInfo.entityType === "floorPlan"){
			setMapEntitySelectedForResult(clickedItemInfo.geometry);
		} else if (clickedItemInfo.entityType !== "position" && clickedItemInfo.hasOwnProperty("entity")){
			setMapEntitySelectedForResult(clickedItemInfo.entity);
		}  else if (clickedItemInfo.entityType === "position" || clickedItemInfo.hasOwnProperty("geometry")){
			setMapEntitySelectedForResult(clickedItemInfo.geometry);
		}

		//if (!clickedItemInfo.floorPlanAlreadySelected && !itemSelected){
		if (clickedItemInfo.floorPlanAlreadySelected){
			setSelectedItemForResult(clickedItemInfo);
		} else if (!itemSelected){
			setSelectedItemForResult(null);
		}
	};

	const disableSaveButton = () => {
		//return (!selectedItemForCondition || !selectedItemForResult) ? true: false;
		let disableBtn = false;

		if (!selectedItemForCondition){
			disableBtn = true;
		}

		if (!disableBtn && resultItemRequired && (!selectedItemForResult)) {
			disableBtn = true;
		}
		
		return disableBtn;
	};

	let conditionDef = null;
	let isTextControl =false;
	const displayTextControl = ()  =>{
		
		if (modificationMode === "EDITED" && !canChangeCondition){
			const behavior = (data.objectType === "AGENT_GROUP")? data.object.groupBehaviors[0]: data.object.behaviors[0];
			if (behavior.hasOwnProperty("conditionDefinitions")){
				conditionDef = behavior.conditionDefinitions;
			}
		}

		if (!conditionDef){
			conditionDef = modificationsConfig["behaviorDefinitions"]["conditionDefinitions"].find(condn => {
				return (condn.avertName === behaviorKey);
			});
		}
		
		isTextControl = (conditionDef.paramDefinitions[0].control === "text");
		return isTextControl;
	};

	const getConditionControl = (defaultValue) =>{
		//const SelectorControl = data.externalMessage.conditionDef.paramDefinitions[0].control;
		const triggerType = behaviorKey;
		const selectorControl = conditionDef.paramDefinitions[0].control;
		const controlOptions = conditionDef.paramDefinitions[0].controlOptions;
		const desc = conditionDef.paramDefinitions[0].paramOptions[0].desc;
		const required = conditionDef.paramDefinitions[0].required || true;
		const dataType = conditionDef.paramDefinitions[0].paramOptions[0].dataType;
		const disabled = conditionDef.paramDefinitions[0].type === "system" ? true: false;

		let value =null;
		if (modificationMode === "ADD" || !conditionDef.hasOwnProperty("existingValue")){
			const behaviorCond = (data.objectType === "AGENT_GROUP")? data.object.groupBehaviors[0]: data.object.behaviors[0];
			if (behaviorCond.behaviorTrigger.parameterMap){
				const condParamOptionsName = Object.keys(behaviorCond.behaviorTrigger.parameterMap)[0];//data.externalMessage.conditionDef.paramDefinitions[0].paramOptions[0].name;
				
				value = (getBehaviorKey() === behaviorKey) ? behaviorCond.behaviorTrigger.parameterMap[condParamOptionsName].data : null;
			}
		} else{
			//value = (getBehaviorKey() === behaviorKey) ? conditionDef.existingValue: null; 
			value = conditionDef.existingValue? conditionDef.existingValue: null;
		}
		
		if (selectorControl === "text"){
			const paramType = conditionDef.paramDefinitions[0].type;
			return (
				<div style={{flex:1, marginLeft: 10, marginRight: 10 }}>
					<Text ref={node => {
						if (!conditionNode && node){
							setConditionNode(node);
						}
					}} 
					id={triggerType} desc={desc} dataType={dataType} required={required} disabled={disabled}
					value={(!value)? defaultValue : value} paramType={paramType}
					itemSelectionHandler ={conditionItemSelectionHandler}/>
				</div>
			);

		} else{
			//const coord={x: data.object.x, y: data.object.y, z: data.object.z };
			return (
				<div style={{flex:1, marginLeft: 10, marginRight: 10, marginTop: 10}}>
					<MapObjectSelectorContainer 
						ref={node => {
							if (!conditionNode && node){
								setConditionNode(node);
							}
						}} 
						id="condition" definitionDesc={conditionDef.desc} required={required}
						itemSelectionFor={itemSelectionFor} enableItemSelectionOnMap={enableItemSelectionOnMapForCondition}
						mapClickedHandler= {drawSelectionForCondition} itemSelectionHandler ={conditionItemSelectionHandler}
						modificationMode={modificationMode}
						controlDataTypes={controlOptions} value={value}/>
				</div>
			);
		}
	};

	const getResultControl = () =>{
		
		let desc =""; 
		let avertName = "";

		let resultDef;

		if (modificationMode === "ADD"){ //its New
			desc = data.externalMessage.resultDef.hasOwnProperty("desc") && data.externalMessage.resultDef.desc || null;
			avertName = data.externalMessage.resultDef.hasOwnProperty("avertName") && data.externalMessage.resultDef.avertName || null;
		}
		else{ //already exist modification 
			const behavior = (data.objectType === "AGENT_GROUP")? data.object.groupBehaviors[0]: data.object.behaviors[0];
			avertName = behavior.behaviorResult.behaviorResultType;
			desc = "";

			if (behavior.hasOwnProperty("resultDefinitions")){
				resultDef = behavior.resultDefinitions;
			}
		}

		if(!resultDef){
			resultDef = modificationsConfig["behaviorDefinitions"]["resultDefinitions"].find(res => {
			
				const hasDesc = (res.hasOwnProperty("desc"));
				const hasAvertName = (res.hasOwnProperty("avertName"));
	
				if (desc && avertName && hasDesc && hasAvertName){
					return (res.desc === desc && res.avertName === avertName);
				} else if( desc && hasDesc){
					return (res.desc === desc);
				} else if( avertName && hasAvertName){
					return (res.avertName === avertName);
				} 
				else {
					if (modificationMode === "EDITED"){
						const tmpOp = res.paramDefinitions[0].paramOptions.find( resT =>{
							return (resT.hasOwnProperty("avertName") && resT.avertName === avertName);
						});
	
						return tmpOp ? true: false;
	
					} else {
						return false;
					}
				}
			});
		}
		
		if ((!resultDef)||(resultDef && (!resultDef.hasOwnProperty("paramDefinitions")))){
			return null;
		} 

		const selectorControl = resultDef.paramDefinitions[0].control;
		const controlOptions = resultDef.paramDefinitions[0].controlOptions;
		const required = resultDef.paramDefinitions[0].required || false;

		let value =null;
		if (modificationMode === "ADD" || !resultDef.hasOwnProperty("existingValue")){
			const behaviorRes = (data.objectType === "AGENT_GROUP") ? data.object.groupBehaviors[0]: data.object.behaviors[0];
			//const resultTypeKey = behavior.behaviorResult.behaviorResultType;
			// const parOption = resultDef.paramDefinitions[0].paramOptions.find(par => {
			// 	return (par.avertName === resultTypeKey);
			// });
			//const value = (!parOption)? null : (behavior.behaviorResult.parameterMap && behavior.behaviorResult.parameterMap[parOption.name].data|| null);
			
			if (behaviorRes.behaviorResult.parameterMap){
				const condParamOptionsName = Object.keys(behaviorRes.behaviorResult.parameterMap)[0];
				value = behaviorRes.behaviorResult.parameterMap[condParamOptionsName].data;
			}

		} else {
			value = resultDef.existingValue;
		}

		//const coord={x: data.object.x, y: data.object.y, z: data.object.z };

		const SelectorControl = editorConfig[selectorControl].control;

		return (
			<div style={{flex:1, marginLeft: 10, marginRight: 10}}>
				<SelectorControl id="result" definitionDesc={resultDef.desc} required={required}
					ref={node => {
						if (!resultNode && node){
							setResultNode(node);
						}
					}} 
					itemSelectionFor={itemSelectionFor} enableItemSelectionOnMap={enableItemSelectionOnMapForResult}
					itemSelectionHandler ={resultItemSelectionHandler} 
					mapClickedHandler= {drawSelectionForResult} modificationMode={modificationMode}
					controlDataTypes={controlOptions} value={value}/>
			</div>
		);

		// if (selectorControl === "mapObjectSelector"){
		// } else if (selectorControl === "barrierSelector"){
		// 	return (
		// 		<div style={{flex:1, marginLeft: 10, marginRight: 10}}>
		// 			{/* //todo: Display Barrier selector */}
		// 		</div>
		// 	);
		// } else{
		// 	return null;
		// }
	};

	// const displayMapConnector = () => {
	// 	return (mapEntitySelectedForResult || mapEntitySelectedForCondition) ? true : false; 
	// };

	return (
		<div>
			<div className="modificationflex">
				{
					(modificationMode ==="ADD") && <Typography variant="body1" className="b1-white" style={{margin:"10px 0px", alignSelf:"center", flex:1, fontSize:18}}>{"Add Modification"}</Typography>
				}
				{
					(modificationMode !=="ADD") && <Typography variant="body1" className="b1-white" style={{margin:"10px 0px", alignSelf:"center", flex:1, fontSize:18}}>{"Edit Modification"}</Typography>
				}

				<div className="modificationActionsRight">
					<Button style={{ width: 74, marginLeft:10, marginRight:0}} onClick={handleClose}>Cancel</Button>
					<Button variant="contained" color="primary" style={{ width: 74, marginLeft:10, marginRight:10 }} 
						disabled={disableSaveButton()} onClick={async () =>{
							await addEditModifications();
						}}>Save</Button>
				</div>
			</div>

			<div className={displayTextControl()? "modificationflex": "modificationflexColumn"}>
				<div style={{width: 260}}>
					<SelectField id="behaviorSelect" label="Behavior" handleChange={(e)=>handleBehaviorChange(e.target.value)}
						formControlProps={{
							style: { margin: "18px 10px 10px 0px" }
						}}
						value={behaviorKey}
						items={getBehaviorList()}
						disabled={false}
					/>
				</div>
				{
					getConditionControl(isTextControl? simTime: null)
				}
			</div>
			
			<div className="modificationflex" style={{paddingLeft:5, paddingRight:5, marginTop:20}}>
				<div className="modificationItemContainer" style={{marginTop:5, marginBottom:5, minHeight:70, width: "100%"}}>
					{/* target icon */}
					<div style={{width:45, visibility:"visible", alignSelf: "center"}}>
						{data.agents[0].entityData.geometry && <TargetingIconContainer marginTop={5} entities={data.agents} />}
					</div>

					{/* Agent icon */}
					<div style={{minWidth:45, visibility:"visible", margin:5, alignSelf: "center"}}>
						<AgentIcon agent={data.agents[0]} group={false} />
					</div>

					{/* Modification desc */}
					<div className="modificationflexColumn" style={{margin:5, marginLeft:10, width:"100%"}}>
						<Typography variant="body1" className="b2-gray" 
							style={{textAlign:"left"}}>{getDisplayText(data, modificationsConfig, "EDITED")}</Typography>
					</div>
				</div>
			</div>
			<div className="modificationflex" style={{marginTop:20}}>
				{ 
					getResultControl()
				}
			</div>
			{
				map &&
				<MapObjectConnectorContainer map={map} firstObject={data.agents[0]} secondObject={mapEntitySelectedForResult} thirdObject={mapEntitySelectedForCondition}/>
			}
		</div>
	);
};

ModificationEditor.propTypes = propTypes;
export default ModificationEditor;