import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Typography, Button } from "@material-ui/core";
import * as utilities from "../../../../shared/utility/utilities";
import ConfirmationDialog from "../../../../shared/components/ConfirmationDialog";
import ModificationEditorContainer from "./ModificationEditor/ModificationEditorContainer";
import ModificationEntry from "./ModificationEntry";
import { getModificationObject, getDisplayText, getConditionDefinitionFromModification, 
	getResultDefinitionFromModification, createBehaviorTriggerForModification } from "../modificationUtility";
import PlayerNotification from "./PlayerNotification";
import { TextField } from "orion-components/CBComponents";
import ObjectiveEditorContainer from "./ModificationEditor/ObjectiveEditorContainer";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	isController: PropTypes.bool.isRequired,
	userInfo: PropTypes.object,
	users: PropTypes.object,
	sessionId: PropTypes.string,
	simulations: PropTypes.object,
	simTime: PropTypes.number,
	simId: PropTypes.number,
	baseSimName: PropTypes.string,
	simTimePrecision: PropTypes.number,
	agents: PropTypes.object,
	agentGroups: PropTypes.object,
	simulationData: PropTypes.object,
	modifications: PropTypes.object,
	pencilsDownData: PropTypes.object,
	modificationsConfig : PropTypes.object,
	externalMessage: PropTypes.object,
	createModification: PropTypes.func,
	cancelModifications: PropTypes.func.isRequired,
	clearComponentMessage: PropTypes.func.isRequired,
	closeModificationPanel: PropTypes.func.isRequired,
	deleteModification: PropTypes.func,
	revertModificationDecision: PropTypes.func,
	rejectModification: PropTypes.func,
	approveModification: PropTypes.func,
	setModificationComment: PropTypes.func,
	submitModificationsToController: PropTypes.func,
	submitModificationsToAvert: PropTypes.func,
	mapBaseRef: PropTypes.object,
	setModificationExclusiveModeOn: PropTypes.func.isRequired,
	setModificationExclusiveModeOff: PropTypes.func.isRequired,
	raiseError: PropTypes.func.isRequired,
	floorPlans: PropTypes.object,
	dir: PropTypes.string
};

const ModifyExercise = ( { isController, userInfo, users, sessionId, simulations, simId, simTime, simTimePrecision, baseSimName, agents, agentGroups, simulationData,
	modifications, pencilsDownData, modificationsConfig, externalMessage, createModification, cancelModifications, clearComponentMessage, closeModificationPanel,
	deleteModification, revertModificationDecision, rejectModification, approveModification, 
	setModificationComment, submitModificationsToController, submitModificationsToAvert, raiseError,
	setModificationExclusiveModeOn, setModificationExclusiveModeOff, floorPlans, dir } ) => {
	const [ showEditor, setShowEditor ] = useState(false); //incase of new and edit modification set showeditor;
	const [ editorData, setEditorData ] = useState(null); //incase of new and edit modification set editorData;
	const [submittedModification, setSubmittedModification] = useState(false);
	const [notificationClose, setNotificationClose] = useState(false);
	const [ modificationMode, setModificationMode ] = useState(null);
	const [ confirmCancel, setConfirmCancel ] = useState(false);
	
	const initPencilsDown = () => {
		return {
			endModifications: pencilsDownData ? pencilsDownData.pencilsDown : false,
			restartModification: false
		};
	};

	const [ pencilsDown, setPencilsDown ] = useState(initPencilsDown);

	const isSimNameUnique = (name) => {
		return _.values(simulations).find(s => s.name.toLowerCase() === name.toLowerCase()) == null;
	};
	
	const getSimName = () =>{
		
		const simNameTmp = _.find(simulations, (simu)=>{
			return (simu.simId === simId) ? true : false;
		});

		if (simNameTmp){
			return  simNameTmp.name;
		} else {
			return baseSimName;
		}
	};

	const getNewExerciseName = () => {
		const simName = getSimName() + "-";

		let counter = 1;
		let uniqueNameFound = false;
		let newSimName = null;
		while (!uniqueNameFound) {
			newSimName = simName + counter;
			if (isSimNameUnique(newSimName)) {
				uniqueNameFound = true;
			} else {
				counter++;
			}
		}

		return newSimName;
	};

	const [ newExerciseName, setNewExerciseName ] = useState(getNewExerciseName());

	const createModificationObject = (create, externalMessage, existingModification) =>{
		let avertType  = ""; 
		let objectType = "";
		let avertObject = "";
		
		if (create){
			const cmd = externalMessage.modificationCommand;
			
			if (cmd.includes("add") || cmd.includes("create")){
				avertType = "ADD";
			} else if (cmd.includes("modify")){
				avertType = "MODIFY";
			} else {
				avertType = "REMOVE";
			}

			if (cmd === "createObjective"){
				objectType = "OBJECTIVE";
				avertObject = { name: "", isWaypoint: false, objectiveValue: 0, coordinates: `${externalMessage.location[0]},${externalMessage.location[1]}`};

			} else{
				const entPropty = externalMessage.entity.properties;
				objectType = (entPropty.groupId && entPropty.groupId !== "null") ? "AGENT_GROUP": entPropty.entityType;
				avertObject = getModificationObject(externalMessage, agentGroups, null, null);
			}

		}
		else{ //edit Modiication
			const modObj = _.cloneDeep(existingModification);
			objectType = modObj.objectType;
			
			if (modObj.objectType === "OBJECTIVE"){
				avertType = "ADD";
				modObj.object["coordinates"] = `${modObj.object.x},${modObj.object.y},${modObj.object.z}`;
				avertObject = modObj.object; 
			} else{
				avertType = "MODIFY";
				avertObject = getModificationObject(null, null, modObj, _.cloneDeep(modificationsConfig));
			}
		}

		const modbj = {
			id: create? "": existingModification.id,
			userId: create? userInfo.userId: existingModification.userId,
			tabletopSessionId: create? sessionId: existingModification.tabletopSessionId,
			status: create? "created": existingModification.status, // created or submitted or approved or rejected or edited or resubmitted
			type: avertType,
			object: avertObject,
			objectType: objectType.toUpperCase(), // agent or agentGroup or objective or interdictionSite,
			comment: create? null: existingModification.comment,
			externalMessage: create? externalMessage: null //todo:  we will remove it once we test it.
		};

		if (modbj.objectType !== "OBJECTIVE"){
			modbj.agents = create?[getAgent(externalMessage.entity.properties.id)] :  getEntities(existingModification);//todo: remove it once we test it.
		}

		return modbj;
	};

	useEffect(() => {

		if (!isController){
			if (pencilsDownData && pencilsDownData.pencilsDown){
				//if CONTROLLER ends all Player Modifications 
				if (!pencilsDown.endModifications){
					setPencilsDown({ 
						endModifications: true,
						restartModification: false
					});
	
					setNotificationClose(false);
				}
			} else {
				//if CONTROLLER restarted Player Modifications 
				if (pencilsDown.endModifications){
					setPencilsDown({
						endModifications: false,
						restartModification: true
					});
					setNotificationClose(false);
				}
			}
		}
		
	}, [pencilsDownData]);

	useEffect(() => {
		
		if (externalMessage) {
			clearComponentMessage();
			if (externalMessage.command === "triggerCreateModification") {
				setShowEditor(true);
				setModificationMode("ADD");

				const modObject = createModificationObject(true, externalMessage, null);
				if ((externalMessage.modificationCommand === "createObjective") || (modObject.externalMessage.resultDef.hasOwnProperty("paramDefinitions"))){
					setEditorData(modObject);
					setModificationExclusiveModeOn();
				} else{
					saveNonControlModification(modObject);
				}
				
				//setAgentId(externalMessage.entity.properties.id);
			}
			else if (showEditor){
				setShowEditor(false);
				setModificationExclusiveModeOff();
				setEditorData(null);
				setModificationMode(null);
			}
		}
	}, [ externalMessage ]);

	const saveNonControlModification = (data) => {
		
		try {
			
			const dataToSave = _.cloneDeep(data);
			
			const behavior = (dataToSave.objectType === "AGENT_GROUP")? dataToSave.object.groupBehaviors[0]: dataToSave.object.behaviors[0];
			behavior.behaviorTrigger = createBehaviorTriggerForModification(behavior.behaviorTrigger.behaviorTriggerType, modificationsConfig, simTime);
			
			delete behavior["resultDefinitions"];
			delete behavior["conditionDefinitions"];
			delete dataToSave["externalMessage"];
			delete dataToSave["agents"];
			
			dataToSave.object.equipment = null; 

			delete dataToSave["id"];
			createModification(dataToSave.tabletopSessionId, dataToSave);

			onSave({success: true, errorMessage: ""});

		} catch (error) {
			console.log(error);			
		}
	};
	
	//#region handler's
	const getAgent = (agentId) =>{
		return agents.hasOwnProperty(agentId) ?agents[agentId] : null;
	};

	const getGeometriesForTarget = (modification) => {
		const targetGeoms = [];

		//In case of create Objective
		if (modification.objectType.toUpperCase() === "OBJECTIVE"){
			// const tmpG = getEntities(modification) || [];
			// if (tmpG && tmpG.length>0){
			// 	targetGeoms.push(tmpG.entityData.geometry);
			// }
			return targetGeoms;
		}

		const modConfig = _.cloneDeep(modificationsConfig);
		const behavior = (modification.objectType === "AGENT_GROUP")? modification.object.groupBehaviors[0]: modification.object.behaviors[0];
		const resultDef = getResultDefinitionFromModification(behavior.behaviorResult, modConfig);

		if (resultDef && (resultDef.hasOwnProperty("paramDefinitions") === true)){
			const dataType = resultDef.paramDefinitions[0].controlOptions;
			const existingVal = resultDef.existingValue;
			
			if (dataType === "position") {
				const arr = existingVal.split(",");

				targetGeoms.push({coordinates:[parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2])], type:"Point"});
			}
			else if (dataType === "objective") {

				const tmpNewObjMod = _.find(modifications, (m) => {
					if (m.type === "ADD" && m.objectType === "OBJECTIVE" && m.object.name === existingVal){
						return true;
					} else {
						return false;
					}
				});

				if (tmpNewObjMod){
					targetGeoms.push({coordinates:[tmpNewObjMod.object.x, tmpNewObjMod.object.y, tmpNewObjMod.object.z || 0], type:"Point"});
				}
			}
		} 

		return targetGeoms;
	};

	const getEntitiesForTarget = (modification) => {
		const targetEntities = getEntities(modification);
		
		if (modification.objectType === "OBJECTIVE"){
			return targetEntities;
		}

		const modConfig = _.cloneDeep(modificationsConfig);
		const behavior = (modification.objectType === "AGENT_GROUP")? modification.object.groupBehaviors[0]: modification.object.behaviors[0];
		const condDef = getConditionDefinitionFromModification(behavior.behaviorTrigger, modConfig);
		const resultDef = getResultDefinitionFromModification(behavior.behaviorResult, modConfig);
		
		if (condDef && (condDef.hasOwnProperty("paramDefinitions") === true)){
			const dataType1 = condDef.paramDefinitions[0].controlOptions;
			const existingVal1 = condDef.existingValue;
			if (dataType1 === "agent"){
				const agntTmp = _.find(agents, (agent) => {
					return agent.entityData.properties.name === existingVal1;
				});

				if (agntTmp){
					targetEntities.push(agntTmp);
				}
			}
		}
		
		if (resultDef && (resultDef.hasOwnProperty("paramDefinitions") === true)){
			const dataType = resultDef.paramDefinitions[0].controlOptions;
			const existingVal = resultDef.existingValue;
			switch (dataType) {
				case "agent":
					{
						const agnt = _.find(agents, (agent) => {
							return agent.entityData.properties.name === existingVal;
						});

						if (agnt){
							targetEntities.push(agnt);
						}
					}
					break;
				case "objective":
					{
						if (simulationData.hasOwnProperty("objectives")){
							const objt = _.find(simulationData.objectives, (objectiv) => {
								return objectiv.entityData.properties.name === existingVal;
							});
	
							if (objt){
								targetEntities.push(objt);
							}
						}
					}
					break;
				case "interdictionSite":
					{
						if (simulationData.hasOwnProperty("interdictionSites")){
							const intr = _.find(simulationData.interdictionSites, (inter) => {
								return inter.entityData.properties.name === existingVal;
							});
	
							if (intr){
								targetEntities.push(intr);
							}
						}
					}
					break;
				default:
					break;
			}
		} 

		return targetEntities;
	};

	const getEntities = (modification) =>{
		const tempEntities = [];

		if (modification.objectType === "AGENT"){
			tempEntities.push(getAgent(modification.object.agentId));

		} else if (modification.objectType === "AGENT_GROUP") {
			modification.object.agentIdList.forEach(agntId => {
				const agentTmp = getAgent(agntId);
				if (agentTmp) {
					tempEntities.push(agentTmp);
				}
			});
		} else if (modification.objectType === "OBJECTIVE"){
			const objTemp = {
				entityData: {
					geometry: {
						coordinates: [modification.object.x, modification.object.y, modification.object.z],
						type: "Point"
					},
					properties:{
						name: modification.object.name,
						displayName: modification.object.name,
						heading:0,
						entityType: "objective",
						enabled: true
					} 
				}
			};
			
			tempEntities.push(objTemp);
		} 

		return tempEntities;
	};

	const onSave = (status) => {
		if (status.success){
			setShowEditor(false);
			setModificationExclusiveModeOff();
			setEditorData(null);
			setModificationMode(null);
			setSubmittedModification(false);
		}
	};

	const onEdit = (modification, mode) => {
		try {
			setShowEditor(true);
			setModificationExclusiveModeOn();
			setModificationMode(mode);
			setSubmittedModification(false);
			
			let modObj = _.cloneDeep(modification);
			modObj = createModificationObject(false, null, modObj);
			setEditorData(modObj);

		} catch (error) {
			console.log(error);
		}
	};

	const onDelete = (modification) => {
		try {
			deleteModification(modification.tabletopSessionId, modification.id);
			clearStates();
		} catch (error) {
			console.log(error);
		}
	};

	const onAccept = (modification, comment) => { //
		try {
			approveModification(modification.tabletopSessionId, modification.id);
			setModificationComment(modification.tabletopSessionId, modification.id, comment);
			clearStates();
		} catch (error) {
			console.log(error);
		}
	};

	const onReject = (modification, comment) => {
		try {
			rejectModification(modification.tabletopSessionId, modification.id);
			setModificationComment(modification.tabletopSessionId, modification.id, comment);
			clearStates();
		} catch (error) {
			console.log(error);
		}
	};

	const onUndo = (modification) => {
		try {
			revertModificationDecision(modification.tabletopSessionId, modification.id);
			clearStates();
		} catch (error) {
			console.log(error);
		}
	};

	const clearStates = () =>{
		setShowEditor(false);
		setModificationExclusiveModeOff();
		setEditorData(null);
		setModificationMode(null);
		setSubmittedModification(false);
	};

	const onCancelModication = () => {
		clearStates();
	};

	const modifyCloseConfirmed = () => {
		if (isController) {
			cancelModifications(sessionId);
			setConfirmCancel(false);
		}
		clearStates();
		closeModificationPanel();
	};

	const handleModifyClose = () => {
		if (isController && _.values(modifications).find(modification => modification.status.toUpperCase() !== "REJECTED")) {
			setConfirmCancel(true);
		} else {
			modifyCloseConfirmed();
		}
	};

	const handleNotifyClose = () => {
		setNotificationClose(true);
	};

	const submitModification =() =>{
		try {
			if (!isController){
				submitModificationsToController(sessionId);
				setSubmittedModification(true);
				setNotificationClose(false);
				setShowEditor(false);
				setModificationExclusiveModeOff();
				setEditorData(null);
				setModificationMode(null);	
			}	
		} catch (error) {
			console.log(error);
		}
		
	};
	
	const submitExercise = () =>{
		try {
			if (isController){
				if (!isSimNameUnique(newExerciseName)) {
					raiseError("A simulation with this name already exists. Please provide a unique simulation name");
				}
				submitModificationsToAvert(sessionId, newExerciseName, simTime);
				setSubmittedModification(true);
				setNotificationClose(false);
				setShowEditor(false);
				setModificationExclusiveModeOff();
				setEditorData(null);
				setModificationMode(null);
				
			}	
		} catch (error) {
			console.log("Error submitting exercise:" + error);
		}
	};
	
	const disabledSubmit = () =>{

		if (isController){
			if (isAllModificationsReviewed() && newExerciseName.length>0){
				return false;
			} else{
				return true;
			}
		} else{
			if (pencilsDown.endModifications){
				return true;
			} 
			
			return (getMyModification().length < 1) ? true: false;
		}
	};

	let msgToDisplay ="";
	const displayNotification = () =>{
		
		// if (isAllModificationsReviewed()){
		// 	msgToDisplay = "All Players have submitted their final modifications.";
		// 	return true;
		// }

		if (!isController){
			
			if (pencilsDown.endModifications){
				msgToDisplay = <Translate value="tableopSession.panels.modifications.modifyExercise.contEnded"/>;
				return true;
			} 

			if (!pencilsDown.endModifications && pencilsDown.restartModification){
				msgToDisplay = <Translate value="tableopSession.panels.modifications.modifyExercise.contRestarted"/>;
				return true;
			} 
			
			if (submittedModification){
				//msgToDisplay = "Your modifications have been submitted to the Controller and are pending review.";
				return false; //true
			}
			if (getMyModification().length< 1 && getMyPendingModification().length <1 && getAccepted_RejectedModification().length <1){
				msgToDisplay = <Translate value="tableopSession.panels.modifications.modifyExercise.contPaused"/>;
				return true;
			}
		}
		msgToDisplay ="";
		return false;
	};

	let infoMsg = "";
	const displayModifications = () =>{
		
		if (!isController){
			if (getMyModification().length< 1 && getMyPendingModification().length <1 && getAccepted_RejectedModification().length <1){
				infoMsg = <Translate value="tableopSession.panels.modifications.modifyExercise.noModTxt"/>;
				return false;
			} else{
				infoMsg ="";
				return true;
			}
		} else {
			if (getNonControllerModifications().length<1){
				infoMsg = <Translate value="tableopSession.panels.modifications.modifyExercise.noPlayerTxt"/> ;
				return false;
			} else {
				infoMsg ="";
				return true;
			}
		}
	};


	//#endregion

	//#region Modification Section Data
	const filterModifications = (modifns, filterValues) => {
		return _.filter(modifns, (modification)=> {
			return (filterValues.includes(modification.status.toUpperCase()));
		});
	};

	const isAllModificationsReviewed = () =>{

		if (isController && modifications){
			const nonControllerMods = _.filter(modifications, (modification) => {
				return (modification.userId !== userInfo.userId);
			});

			// ["CREATED", "EDITED", "REJECTED", "SUBMITTED", "RESUBMITTED"])
			if (nonControllerMods.find(modification => 
				["SUBMITTED", "RESUBMITTED"].includes(modification.status.toUpperCase())
			)) {
				return false;
			} else {
				return true;
			}
		} else{
			return false;
		}
	};

	const nonControllerModifications = [];
	const getNonControllerModifications = () => {

		// user, {modifications (non created and edited)}
		if (nonControllerModifications.length<1){
			if (isController){
				const filterVals = ["CREATED", "EDITED"];
				const nonControllerMods = _.filter(modifications, (modification) => {
					if ((modification.userId !== userInfo.userId) && 
						!filterVals.includes(modification.status.toUpperCase())){
						return true;
					} else {
						return false;
					}
				});
	
				if (nonControllerMods.length>0){
					const modsTemp = {};
					_.forEach(nonControllerMods, (modification) => {
						const nameTmp = users[modification.userId].name;
						if (!modsTemp.hasOwnProperty(nameTmp)){
							modsTemp[nameTmp] = [];
						}
						modsTemp[nameTmp].push(modification);
						//todo 07-Apr-21- here sort modifications of each user.

					});
					_.forEach(modsTemp, (arr, userName) => {
						modsTemp[userName] = sortModifications(arr);
					});

					nonControllerModifications.push(modsTemp);
				}
			}
			
		}

		return nonControllerModifications;
	};

	
	const sortModifications = (modArray) => {
		
		return modArray.sort((a, b) =>{
			const dateA = new Date(a.createdDate);
			const dateB = new Date(b.createdDate);
			return dateA - dateB; //Asc order
		});
	};

	let myModification = [];
	const getMyModification = ()=> {
		
		if (myModification.length<1){
			myModification = filterModifications(modifications, ["CREATED", "EDITED"]) || [];
			
			myModification = _.filter(myModification, (modification) => {
				return (modification.userId === userInfo.userId);
			});
			
			//this check before sorting will be removed once we update service
			if (myModification.length>0 && myModification[0].hasOwnProperty("createdDate")){
				myModification = sortModifications(myModification);
			}
		} 

		return myModification;
	};

	let myPendingModification = [];
	const getMyPendingModification = ()=> {
		
		if (myPendingModification.length<1){
			myPendingModification = filterModifications(modifications, ["SUBMITTED", "RESUBMITTED"]) || [];	
			
			if(!isController){
				myPendingModification = _.filter(myPendingModification, (modification) => {
					return (modification.userId === userInfo.userId);
				});
				
				//this check before sorting will be removed once we update service 
				if (myPendingModification.length>0 && myPendingModification[0].hasOwnProperty("createdDate")){
					myPendingModification = sortModifications(myPendingModification);
				}
			}
		}
		return myPendingModification;
	};

	let myAcceptRejectModification =[];
	const getAccepted_RejectedModification = ()=> {
		//myAcceptRejectModification = filterModifications(modifications, ["SUBMITTED", "RESUBMITTED"]) || [];

		if (myAcceptRejectModification.length<1){
			if (!isController){
				myAcceptRejectModification = filterModifications(modifications, ["APPROVED", "REJECTED"]) || [];
				myAcceptRejectModification = _.filter(myAcceptRejectModification, (modification) => {
					return (modification.userId === userInfo.userId);
				});

				//this check before sorting will be removed once we update service 
				if (myAcceptRejectModification.length>0 && myAcceptRejectModification[0].hasOwnProperty("createdDate")){
					myAcceptRejectModification = sortModifications(myAcceptRejectModification);
				}
			}
		}
		return myAcceptRejectModification;
	};
	//#endregion

	return (
		<div>
			{
				//Notification to display
				!notificationClose && displayNotification() &&  
				<PlayerNotification description={msgToDisplay} onClose={handleNotifyClose} />
			}
			{
				!showEditor &&  
				<div className="modificationActionsRight">
					<Button style={dir == "rtl" ? { marginLeft:0} : { marginRight:0}} onClick={handleModifyClose}>Cancel</Button>
					<Button variant="contained" color="primary" disabled={disabledSubmit()} 
						style={{ minWidth: 222, marginLeft:10, marginRight:10 }} 
						onClick={isController? submitExercise : submitModification}>{isController? <Translate value="tableopSession.panels.modifications.modifyExercise.generateNewExercise"/>: <Translate value="tableopSession.panels.modifications.modifyExercise.submitMod"/>}</Button>
				</div>
			}
			{
				//In Non Controller mode 
				!isController && displayModifications() && 
				<div>
					{
						!showEditor && 
						<div className="modificationflexColumn" style={{marginTop:20}}>
							<div style={{width: "100%"}}>
								<Typography variant="body1" className="b2-gray" style={dir == "rtl" ? {textAlign:"right"} : {textAlign:"left"}}>{<Translate value="tableopSession.panels.modifications.modifyExercise.myMod"/>}</Typography>
							</div>
							<div style={dir == "rtl" ? {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingLeft:10} : {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingRight:10}}>
								{
									agents && getMyModification().map((modObj, index) => {
										return (
											<ModificationEntry key={`MyMod${index}`} entities={getEntitiesForTarget(modObj)} 
												geometries={getGeometriesForTarget(modObj)}
												isController={isController} entryMode={modObj.status} 
												description={getDisplayText(modObj, modificationsConfig, "", floorPlans)} 
												onEdit={() => onEdit(modObj, "EDITED")} onDelete={() => onDelete(modObj)} 
												onAccept={null} onReject={null} onUndo={null} dir={dir}/>
										);
									})
								}
							</div>
						</div>
					}
					{
						!showEditor &&
						<div className="modificationflexColumn" style={{marginTop:20}}>
							<div style={{width: "100%"}}>
								<Typography variant="body1" className="b2-gray" style={dir == "rtl" ? {textAlign:"right"} : {textAlign:"left"}}>{<Translate value="tableopSession.panels.modifications.modifyExercise.pendingMod"/>}</Typography>
							</div>
							<div style={dir == "rtl" ? {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingLeft:10} : {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingRight:10}}>
								{
									agents && getMyPendingModification().map((modObj, index) => {
										return (
											<ModificationEntry key={`MyMod${index}`} entities={getEntitiesForTarget(modObj)} 
												geometries={getGeometriesForTarget(modObj)}
												isController={isController} entryMode={modObj.status} 
												description={getDisplayText(modObj, modificationsConfig, "", floorPlans)} 
												onEdit={null} onDelete={null} onAccept={null} onReject={null} onUndo={null} dir={dir}/>
										);
									})
								}
							</div>
						</div>
					}
					{
						!showEditor && 
						<div className="modificationflexColumn" style={{marginTop:20}}>
							<div style={{width: "100%"}}>
								<Typography variant="body1" className="b2-gray" style={dir == "rtl" ? {textAlign:"right"} : {textAlign:"left"}}>{<Translate value="tableopSession.panels.modifications.modifyExercise.acceptedRejectedMod"/>}</Typography>
							</div>
							<div style={dir == "rtl" ? {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingLeft:10} : {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingRight:10}}>
								{
									agents && getAccepted_RejectedModification().map((modObj, index) => {
										return (
											<ModificationEntry key={`MyMod${index}`} entities={getEntitiesForTarget(modObj)} 
												geometries={getGeometriesForTarget(modObj)}	
												isController={isController} entryMode={modObj.status} 
												description={getDisplayText(modObj, modificationsConfig, "", floorPlans)} 
												existingcomment = {modObj.comment? modObj.comment : ""}
												onEdit={() => onEdit(modObj, "REJECTED")} onDelete={() => onDelete(modObj)} 
												onAccept={(comment) => onAccept(modObj, comment)} 
												onReject={null} onUndo={null} dir={dir}/>
										);
									})
								}
							</div>
						</div>
					}
				</div>
			}
			{
				isController && !showEditor && 
				<div>
					<div className="modificationflex">
						<div style={dir == "rtl" ? {flex:1, marginLeft: 10} : {flex:1, marginRight: 10}}>
							<TextField
								id="txtNewExerciseName"
								formControlStyles={{ margin: "0px 0px 0px 0px" }}
								label={<Translate value="tableopSession.panels.modifications.modifyExercise.newExerciseName"/>}
								value={newExerciseName}
								handleChange={(e)=>setNewExerciseName(e.target.value)}
								disabled={false}
								dir={dir}
							/>	
						</div>
						<div style={{width: 120, marginLeft: 10, marginRight: 10}}>
							<TextField
								id="txtstartTime"
								formControlStyles={{ margin: "0px 0px 0px 0px" }}
								label={<Translate value="tableopSession.panels.modifications.modifyExercise.startTime"/>}
								value={utilities.truncate(simTime, simTimePrecision)}
								handleChange={(e) => console.log("no need to handle becoz its disabled - " + e.target.value)}
								disabled={true}
								dir={dir}
							/>
						</div>
					</div>
				</div>
			}
			{
				//In Controller Mode and display self Modifications
				isController && !showEditor && 
				<div>
					<div className="modificationflexColumn" style={{marginTop:20}}>
						<div style={{width: "100%"}}>
							<Typography variant="body1" className="b2-gray" style={dir == "rtl" ? {textAlign:"right"} : {textAlign:"left"}}><Translate value="tableopSession.panels.modifications.modifyExercise.controller" count={users[userInfo.userId].name}/></Typography>
						</div>
						<div style={dir == "rtl" ? {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingLeft:10} : {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingRight:10}}>
							{
								agents && getMyModification().map((modObj, index) => {
									return (
										<ModificationEntry key={`MyMod${index}`} entities={getEntitiesForTarget(modObj)} 
											geometries={getGeometriesForTarget(modObj)}
											isController={isController} entryMode={modObj.status} 
											description={getDisplayText(modObj, modificationsConfig, "", floorPlans)} 
											onEdit={() => onEdit(modObj, "EDITED")} onDelete={() => onDelete(modObj)} 
											onAccept={null} onReject={null} onUndo={null} dir={dir}/>
									);
								})
							}
						</div>
					</div>
				</div>
			}
			{
				//In Controller Mode and display others modifications
				isController && displayModifications() && 
				<div>
					{
						!showEditor && (getNonControllerModifications().length >0) 
							&& _.map(getNonControllerModifications()[0], (ncmModObj, key) => {
								return (
									<div key={`ncm-${key}`} className="modificationflexColumn" style={{marginTop:20}}>
										<div style={{width: "100%"}}>
											<Typography variant="body1" className="b2-gray" style={dir == "rtl" ? {textAlign:"right"} : {textAlign:"left"}}>{key}</Typography>
										</div>
										<div style={dir == "rtl" ? {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingLeft:10} : {width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingRight:10}}>
											{
												agents && _.map( ncmModObj, (modObj, index) => {
													return (
														<ModificationEntry key={`cm-MyMod${index}`} entities={getEntitiesForTarget(modObj)} 
															geometries={getGeometriesForTarget(modObj)}
															isController={isController} entryMode={modObj.status} 
															description={getDisplayText(modObj, modificationsConfig, "", floorPlans)} 
															existingcomment = {modObj.comment? modObj.comment : ""}
															onEdit={null} onDelete={null} 
															onAccept={(comment) => onAccept(modObj, comment)} 
															onReject={(comment) => onReject(modObj, comment)} onUndo={() => onUndo(modObj)} dir={dir}/>
													);
												})
											}
										</div>
									</div>
								);
							})
					}
				</div>
			}
			{
				//information if no modification to submit at this time
				!displayModifications() && !showEditor && 
				<div className="grayBorderedContainer" style={{minHeight:50, marginTop:300, verticalAlign: "center"}}>
					<Typography variant="body1" className="b2-gray" 
						style={{margin:10, width: "100%", textAlign:"center", opacity: 0.5}}>{infoMsg}</Typography>
				</div>
			}

			<div>
				{ showEditor &&  (editorData.objectType.toUpperCase() !== "OBJECTIVE") && <LLgRi7cWeUUu5zpB7dekZFapB2XdRCvM4N 
					isController={isController} simTime={simTime} 
					data={editorData} modificationMode={modificationMode} modificationsConfig={modificationsConfig} 
					onSaveModification={onSave} onCancelModication={onCancelModication} />
				}
				{ showEditor &&  (editorData.objectType.toUpperCase() === "OBJECTIVE") && 
					<ObjectiveEditorContainer data={editorData} modificationMode={modificationMode} 
						onSaveObjective={onSave} onCancelObjective={onCancelModication}/>
				}
			</div>
			{confirmCancel && 
				<ConfirmationDialog
					open={true}
					title=""
					content={<Translate value="tableopSession.panels.modifications.modifyExercise.dialogContent"/>}
					onClose={() => setConfirmCancel(false)}
					loading={false}
					onConfirm={modifyCloseConfirmed}
					dir={dir}
				/>
			}
		</div>
	);
};

ModifyExercise.propTypes = propTypes;
export default ModifyExercise;