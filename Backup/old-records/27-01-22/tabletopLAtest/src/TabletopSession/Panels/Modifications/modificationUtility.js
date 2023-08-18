import _ from "lodash";
import $ from "jquery";
import TabletopSessionService from "../../../services/tabletopSessionService";
import { getGeometryFloorPlan } from "../../MapBase/mapUtilities";

function toTitleCase(str) {
	return str.replace(
	  /\w\S*/g,
	  function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	  }
	);
}

export const getAvertDataType = (entityType) => {
	let retVal = "String";
	
	switch (entityType.toLowerCase()) {
		case "double":{
			retVal= "Double";
			break;
		}
		default: //agent, barrier, interdictionSite, pathStrategy
			retVal= "String";
			break;
	} 

	return retVal;
};

//create object (i.e. modification.object as per Avert modifications object) from External message or from existing modification object.
//create 
export const getModificationObject = ( externalMessage, agentGroups, existingModification, modConfig ) => {
	//Construct an object from entity that has the same structure as that needed by Avert.
	//"Todo - Transform entity to Avert Structure.";

	//Create object properties as per Avert object structure
	function getEntityProperties(entity){
		const entTemp = _.cloneDeep(entity.properties);
		const entType = entTemp.entityType.toLowerCase(); //entTemp.properties.entityType.toLowerCase();
		entTemp[entType + "Id"] = entTemp.id; 
		entTemp[entType + "Name"] = entTemp.name;
		
		delete entTemp["id"]; 
		delete entTemp["name"];

		entTemp.x = entity.geometry && entity.geometry.coordinates[0];
		entTemp.y = entity.geometry && entity.geometry.coordinates[1];
		entTemp.z = entity.geometry && (entity.geometry.coordinates.length>2) && entity.geometry.coordinates[2] || 0;

		//todo: equipment needs to transform as per Avert object
		return entTemp;
	}

	function getParamMapInfo(paramRequired, paramOptions, value){
		const parameterMap = {};
		
		parameterMap[paramOptions.name] ={
			data: value && value.toString()|| null,
			dataType: (paramOptions.dataType.toUpperCase() === "DOUBLE")? "Double": "String", //note: in config dataType is entityType (agent, objective etc)
			required: paramRequired
		};

		return parameterMap;
	}

	function getBehaviorResult(resultType, paramRequired, paramOptions, value ) {
		const rslt = {};
		rslt.behaviorResultType = resultType.toUpperCase();
		try {
			rslt.parameterMap = paramRequired && paramOptions && getParamMapInfo(paramRequired, paramOptions, value) || null;	
		} catch (e) {
			console.log("getBehaviorResult: paramOptions may not exist, so ignore..");
		}
		return rslt;
	}

	function getBehaviorTrigger(triggerType, paramRequired, paramOptions, value) {
		const trig ={};
		trig.behaviorTriggerType = triggerType.toUpperCase();
		
		try {
			trig.parameterMap = getParamMapInfo(paramRequired, paramOptions, value);	
		} catch (e){
			console.log("getBehaviorResult: paramOptions may not exist, so ignore..");
		}
		return trig;
	}

	function getAgentGroupInfo(groupId){
		return agentGroups && agentGroups.hasOwnProperty(groupId) ? agentGroups[groupId] : null;
	}

	//todo: we need to handle multiple behavior inputs.
	function getBehaviors(behaviorName, conditionDef, resultDef){
		const behaviours = [];
		
		//note: getBehaviorTrigger handle single trigger condition.
		//note: getBehaviorResult handle single result.
		//todo: we may need to remove hardcoded, get usecase where conditionDef.paramDefinitions can contain multiple condition and same for result. 

		const trigger = getBehaviorTrigger( conditionDef.avertName, 
			conditionDef.paramDefinitions[0].required, 
			conditionDef.paramDefinitions[0].paramOptions[0]);

		//here we r creating new modification so passing null, null
		const result = getBehaviorResult(resultDef.hasOwnProperty("avertName") ?  resultDef.avertName : resultDef.desc, 
			(resultDef.hasOwnProperty("paramDefinition") && resultDef.paramDefinitions[0].required) || null, 
			null, null);
		
		behaviours.push({
			behaviorName: behaviorName,
			behaviorTrigger: trigger,
			behaviorResult: result,
			resultDefinitions: resultDef,
			conditionDefinitions: conditionDef
		});

		return behaviours;
	}
	
	let modObject = {};
	
	if (externalMessage){
		const entity = externalMessage.entity; //its a map entity
		const condDefn = externalMessage.conditionDef; 
		const resultDefn = externalMessage.resultDef;

		const enttyTypeTemp= (entity.properties.groupId && entity.properties.groupId !== "null") ? "AGENT_GROUP": entity.properties.entityType;
	
		if (enttyTypeTemp === "AGENT_GROUP"){
			const agntGrpInfo = getAgentGroupInfo(entity.properties.groupId);
			modObject.agentIdList = agntGrpInfo.entityData.properties.agentIds;
			modObject.groupId = entity.properties.groupId;
			modObject.groupName = agntGrpInfo.entityData.properties.name, 
			modObject.displayName = agntGrpInfo.entityData.properties.name;
			modObject.groupBehaviors = getBehaviors("", condDefn, resultDefn);
		}
		else{
			const entityDetails = getEntityProperties(entity);
			modObject = _.merge(modObject, entityDetails);
			modObject.behaviors = getBehaviors("", condDefn, resultDefn);
		}
	}
	else if (existingModification){
		//const modConfig = _.cloneDeep(modificationsConfig);
		modObject = existingModification.object;
		const behavior = (existingModification.objectType === "AGENT_GROUP")? modObject.groupBehaviors[0]: modObject.behaviors[0];
		const condDefn = getConditionDefinitionFromModification(behavior.behaviorTrigger, modConfig);
		const resultDefn = getResultDefinitionFromModification(behavior.behaviorResult, modConfig);
		behavior.resultDefinitions = resultDefn;
		behavior.conditionDefinitions = condDefn;
	}
	return modObject;
};

//format text to display 
export const getDisplayText = ( modification, modificationsConfig, modificationMode, facilityFloorplans ) => {
	// If modification.type is Add, return 'Add {modification.objectType} {modification.object.name}'
	// Else if modification.type is Change, calculate text as 'Modify {modification.object.name}:'
	// followed by display text for each behavior (condition display text followed by result display text)

	const stringFormat = (source, params) =>{
		$.each(params, function (i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	};

	let retVal= `${modification.type} not found OR Condition mismatch.` ;
	if (modification.type.toUpperCase() === "ADD"){ 
		retVal = `Add ${(modification.objectType.toUpperCase() === "AGENT")? "Player": toTitleCase(modification.objectType)} '${modification.object.hasOwnProperty("displayName")? modification.object.displayName: modification.object.name}'`;
	} 
	else if (modification.type.toUpperCase() === "MODIFY" || modification.type.toUpperCase() === "CHANGE"){
		//retVal = `Modify ${modification.object.displayName? modification.object.displayName: modification.object.name}: ` + "";
		retVal = `Modify ${modification.object.displayName}: ` + "";
		let textToDisplay = "";
		const behaviors = modification.objectType === "AGENT_GROUP" ? modification.object.groupBehaviors : modification.object.behaviors;
		behaviors.forEach(beh => {
			
			const condns = modificationsConfig.behaviorDefinitions.conditionDefinitions.find( cond => cond.avertName === beh.behaviorTrigger.behaviorTriggerType);
			
			const getMatchingParam = (paramOptions, valueToCompare) => {
				try {
					return paramOptions.find(param => param.avertName === valueToCompare);	
				} catch (error) {
					console.log(error);					
				}
			};

			const getDisplayTextInEditMode = (descWithPlaceholder, placeHolderValue) => {
				let retVal= "";

				switch (placeHolderValue) {
					case "agent":
						retVal= stringFormat(descWithPlaceholder, ["Player"]);
						break;
					case "objective":
						retVal= stringFormat(descWithPlaceholder, ["Objective"]);
						break;
					case "position":
						retVal= stringFormat(descWithPlaceholder, ["Location"]);
						break;
					default:
						break;
				}

				return retVal;
			};

			const rslt =  modificationsConfig.behaviorDefinitions.resultDefinitions.find(rst =>{
				let retFlag = true;
				if (!beh.hasOwnProperty("behaviorResult") || (!beh.behaviorResult)){
					retFlag = false;
				} else if (rst.hasOwnProperty("avertName")){
					retFlag = (rst.avertName === beh.behaviorResult.behaviorResultType);
				} else{
					const paramOptArray  = getMatchingParam(rst.paramDefinitions[0].paramOptions, beh.behaviorResult.behaviorResultType);
					retFlag = paramOptArray? true: false; //(paramOptArray && paramOptArray.length>0)? true: false;
				}
				return retFlag;
			});

			if (modificationMode == "EDITED" && rslt && (rslt.hasOwnProperty("desc") || rslt.hasOwnProperty("editDesc"))){
				
				if (rslt.hasOwnProperty("editDesc") && beh.behaviorResult.parameterMap && beh.resultDefinitions.paramDefinitions){
					textToDisplay  = getDisplayTextInEditMode(rslt.editDesc, beh.resultDefinitions.paramDefinitions[0].controlOptions);
				} else{
					textToDisplay = rslt.desc;
				}

			} else if (condns){

				let displayText = (condns.displayText && condns.displayText === "")? condns.desc: condns.displayText;
				if (displayText.includes("{0}")){
					if (beh.behaviorTrigger.parameterMap){
						const condParamOptionsName = Object.keys(beh.behaviorTrigger.parameterMap)[0];
						const valueTmp = beh.behaviorTrigger.parameterMap[condParamOptionsName].data;
						displayText = stringFormat(displayText, [valueTmp]);
					}
				}
				
				if (rslt){
					let displayName="";

					if (rslt.hasOwnProperty("paramDefinitions")) {
												
						if (rslt.hasOwnProperty("avertName")){
							displayName = rslt.displayText;
						}

						let floorDisplayName = null;

						if (!displayName){
							const matchParam = getMatchingParam(rslt.paramDefinitions[0].paramOptions, beh.behaviorResult.behaviorResultType);
							displayName = matchParam.parentDisplayText;
							floorDisplayName = matchParam.floorDisplayText? matchParam.floorDisplayText: null;
						}

						if (displayName.includes("{0}") || floorDisplayName){
							
							if (beh.behaviorResult.parameterMap && !_.isEmpty(beh.behaviorResult.parameterMap)){
								const rsltParamOptionsName = Object.keys(beh.behaviorResult.parameterMap)[0];
								const valueTmp = beh.behaviorResult.parameterMap[rsltParamOptionsName].data;

								//include floor name in description if exist
								if (floorDisplayName && (rsltParamOptionsName === "location" || rsltParamOptionsName === "position") && facilityFloorplans){
									const arrTmp = valueTmp.split(",");
									if ((arrTmp.length > 2) && (arrTmp[2] > 0)){
										//const altitudeVal = arrTmp[2]? arrTmp[2] : 0;
										const geomObj = {type: "Point", coordinates: [parseFloat(arrTmp[0]), parseFloat(arrTmp[1]), parseFloat(arrTmp[2])]};
										const floorResult = getGeometryFloorPlan(geomObj, facilityFloorplans);
										if (floorResult.inFacility){
											const flr = _.find(facilityFloorplans[floorResult.facilityId], (flr) => {
												if (flr.id === floorResult.floorPlanId){
													return true;
												}
											});
											
											displayName = stringFormat(floorDisplayName, [flr.name|| ""]);

										} else{
											displayName = stringFormat(displayName, [valueTmp]);		
										}
									} else {
										displayName = stringFormat(displayName, [valueTmp]);
									} 
								} else {
									displayName = stringFormat(displayName, [valueTmp]);
								}
							} else{
								displayName = rslt.desc? rslt.desc : displayName;
							}
						}
					} else
					{
						displayName = rslt.displayText;
					}
					
					const andTemp = (displayText.length>0) && (displayName.length>0) ? " -> " : ""; 
					const displayTextTemp = `${displayText}${andTemp}${displayName}`;

					textToDisplay = (textToDisplay === "")? displayTextTemp: textToDisplay + "\n" + displayTextTemp;

				} else{
					const andTemp = (displayText.length>0) && (beh.behaviorResult.behaviorResultType.length>0) ? " => " : ""; 
					const displayTextTemp = `${displayText}${andTemp}${beh.behaviorResult.behaviorResultType}`;
					textToDisplay = (textToDisplay === "")? displayTextTemp: textToDisplay + "\n" + displayTextTemp;
				}
			}
			
		});
		retVal = retVal + textToDisplay;
	} 
	else if (modification.type.toUpperCase() === "REMOVE" || modification.type.toUpperCase() === "DELETE"){
		retVal = `Remove ${modification.objectType} ${modification.object.displayName}`;
	}
	
	return retVal;
};

export const getConditionDefinition = (desc, entityType, modificationsConfig) =>{
	const condDef = modificationsConfig.behaviorDefinitions.conditionDefinitions.find(c =>{
		if (c.desc.toUpperCase() === desc.toUpperCase() || c.avertName === entityType){
			return true;
		}
	});

	return condDef;
};

export const getResultParameterOption = (desc, entityType, modificationsConfig) => {

	const resultDef = modificationsConfig.behaviorDefinitions.resultDefinitions.find(r =>{
		if (r.desc.toUpperCase() === desc.toUpperCase()){
			return true;
		}
	});

	const paramOptions = resultDef.paramDefinitions[0].paramOptions.find(pa=> {
		return (pa.hasOwnProperty("dataType") && pa.dataType === entityType);
	});

	if (!paramOptions.hasOwnProperty("avertName")){
		if (resultDef.hasOwnProperty("avertName")){
			paramOptions["avertName"] = resultDef.avertName;
		}
	}

	return paramOptions;
};

//get ConditionDefinitions in case of edit modification, also already selected value is set as default value in paramDefinitions.
export const getConditionDefinitionFromModification = (modificationBehaviorTrigger, modificationsConfig) => {
	const condition = _.cloneDeep(modificationBehaviorTrigger);

	const conditionTypeToLook = condition.behaviorTriggerType;
	const parameterMap = condition.parameterMap;

	if (parameterMap){
		const filteredCondDefs = modificationsConfig.behaviorDefinitions.conditionDefinitions.find(c =>{

			if(c.hasOwnProperty("avertName") && c.avertName === conditionTypeToLook){
				//note: This value becomes handy to set already selected value
				c.existingValue = parameterMap[c.paramDefinitions[0].paramOptions[0].name].data;
				return true;
			} else{
				return false;
			}
		});

		return filteredCondDefs;
	} else{
		return null;
	}
};

//get ResultDefinitions in case of edit modification, also already selected value is set as default value in paramDefinitions.
export const getResultDefinitionFromModification = (modificationBehaviorResult, modificationsConfig) => {

	const result = _.cloneDeep(modificationBehaviorResult);
	
	const resultTypeToLook = result.behaviorResultType;
	const parameterMap = result.parameterMap;

	if (parameterMap){
		
		const filteredResDefs = modificationsConfig.behaviorDefinitions.resultDefinitions.find(f =>{
			
			//todo : need to handle enable /disable barrier
			if(f.hasOwnProperty("paramDefinitions") === true){
				let paramOption = f.paramDefinitions[0].paramOptions.find(pa=> {
					return (pa.hasOwnProperty("avertName") && pa.avertName === resultTypeToLook);
				});

				if (!paramOption){
					if(f.hasOwnProperty("avertName") && f.avertName === resultTypeToLook){
						paramOption = f.paramDefinitions[0].paramOptions[0];
					}
				}

				if (paramOption) {
					//note: This information becomes handy to set already selected value

					f.paramDefinitions[0].controlOptions = paramOption.dataType;
					if (parameterMap.hasOwnProperty(paramOption.name)) {
						f.existingValue = parameterMap[paramOption.name].data;
						f.existingDataType = parameterMap[paramOption.name].dataType;
					}

					const paramOptionsTemp = [];
					paramOptionsTemp.push(paramOption);
					f.paramDefinitions[0].paramOptions = paramOptionsTemp; //just replace it.

					return true;

				} else {
					return false;
				}
			} else{
				return false;
			}
		});

		return filteredResDefs;
	}
	else{
		return null;
	}
};

//create Trigger output as per Avert behaviorTrigger format
export const createBehaviorTriggerForModification = (triggerType, modificationsConfig, value ) => {
	const condition = {behaviorTriggerType: triggerType, parameterMap: null};
	
	const condDef = modificationsConfig.behaviorDefinitions.conditionDefinitions.find(c =>{
		return (c.hasOwnProperty("avertName") && c.avertName === triggerType);
	});
	
	const paramOptions = condDef.paramDefinitions[0].paramOptions;

	condition.parameterMap= {};
	condition.parameterMap[paramOptions[0].name] = {
		data: value,
		required: condDef.paramDefinitions[0].required,
		dataType: getAvertDataType(paramOptions[0].dataType)
	};
	
	return condition;
};

//create Result output as per Avert behaviorResult format
export const createBehaviorResultForModification = (resultType, paramOptionsName, entityType, paramRequired, value ) => {
	const result = {behaviorResultType: resultType, parameterMap: null};

	result.parameterMap= {};
	
	//note: user has not selected any radio button incase of result required=false, we need to save result with parameterMap =null. 
	if (value){
		result.parameterMap[paramOptionsName] = {
			data: value,
			dataType: getAvertDataType(entityType),
			required: paramRequired
		};
	} else{
		result.parameterMap= null;
	}

	return result;
};

export const isValidLocation = async (sessionId, x, y, z) => {
	try {
		const resultVal = await TabletopSessionService.checkObjectiveLocation(sessionId, x, y, z);
		if (resultVal && resultVal.result){
			return {success: true};
		} else{
			return {success: false};
		}	
	} catch (error) {
		console.log("Failed to validate location: " + "\n" + error);
		return {success: false, errMsg: "Failed to validate location."};
	}
};
