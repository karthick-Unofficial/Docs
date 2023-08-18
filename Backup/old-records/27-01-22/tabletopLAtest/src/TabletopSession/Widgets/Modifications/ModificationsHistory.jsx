import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import * as utilities from "../../../shared/utility/utilities";
import ModificationEntry from "./ModifyExercise/ModificationEntry";
import { getModificationObject, getDisplayText, getConditionDefinitionFromModification, getResultDefinitionFromModification } from "./modificationUtility";
import { CubeOutline } from "mdi-material-ui";
import { Button} from "@material-ui/core";
import html2pdf from "html2pdf.js";


const propTypes = {
	isFacilitator: PropTypes.bool.isRequired,
	isController: PropTypes.bool.isRequired,
	userInfo: PropTypes.object,
	//users: PropTypes.object,
	userMappings: PropTypes.array,
	sessionId: PropTypes.string,
	simulations: PropTypes.object,
	simId: PropTypes.number,
	simTimePrecision: PropTypes.number,
	agents: PropTypes.object,
	//allAgents: PropTypes.object,
	agentGroups: PropTypes.object,
	simulationData: PropTypes.object,
	modificationsConfig : PropTypes.object,
	floorPlans: PropTypes.object
};

const ModificationsHistory = ( { isFacilitator, isController, userInfo, userMappings, sessionId, simulations, simId, simTimePrecision,
	agents, agentGroups, simulationData, modificationsConfig,  floorPlans } ) => {

	const openPdf = function() {
		const elementToExportToPdf = document.getElementById("modificationHistory");
		elementToExportToPdf.classList.add("divToExport");
		document.getElementById("report-title").style.display = "block";

		generatePdf(elementToExportToPdf);
		
		//Callback to remove the classname added for styling 
		setTimeout(function(){
			elementToExportToPdf.classList.remove("divToExport");
			document.getElementById("report-title").style.display = "none";
		}, 0);
	};

	const  generatePdf = (element) => {
		
		const opt = {
			filename: "modificationHistory.pdf",
			margin: [20, 30, 20, 30],
			image: {type: "jpeg", quality: 1, scale: 4},
			html2canvas: {
				dpi: 192,
				scale:4,
				letterRendering: true,
				useCORS: true
			  },
			jsPDF: {format: "a4", orientation: "portrait"},
			pagebreak: {mode: "avoid-all", before:"#pageX"}
		};

		html2pdf().from(element).set(opt).toPdf().get("pdf").then(function (pdf) {
			const totalPages = pdf.internal.getNumberOfPages();
			for (let i = 1; i <= totalPages; i++) {
				pdf.setPage(i);
				pdf.setFontSize(10);
				const horizontalPos = pdf.internal.pageSize.getWidth() / 2; 
				const verticalPos = pdf.internal.pageSize.getHeight() - 10;
				pdf.text(String(i),  horizontalPos, verticalPos, "right");
			} 
		}).save();

	};

	const getBaseSimName = () => {
		if(simulations) {
			const baseSim = _.values(simulations).find(sim => sim.parentSimId == null || sim.parentSimId === -1 );
			if (baseSim) {
				return baseSim.name;
			}
		}
	};

	//#region handler's
	const recursiveSimulations = (sessionId, simId) => {
		const arrSimulations = [];
		if (!simulations){
			return arrSimulations;
		}

		const recurSims = (parentSimId) => {
			if (parentSimId){
				const parentSim = simulations.hasOwnProperty(parentSimId) && simulations[parentSimId];
				if (parentSim && parentSim.parentSimId){
					arrSimulations.push(parentSim);
					recurSims(parentSim.parentSimId);
				} 				
			}
		};

		const currSim = simulations.hasOwnProperty(simId) && simulations[simId];

		if (currSim){
			arrSimulations.push(currSim);
		} else {
			return arrSimulations;
		}
		
		if (currSim.parentSimId){
			recurSims(currSim.parentSimId);
		}

		return arrSimulations;
	};

	//array of simulation
	const [ hierarchicalSimulations, setHierarchicalSimulations ] = useState(recursiveSimulations);
	const [ hasModificationhistory, setHasModificationhistory ] = useState(null);

	useEffect(() => { 
		if (simulations){
			setHierarchicalSimulations(recursiveSimulations(sessionId, simId));
		}
	}, [simulations, simId]);

	const getAgent = (agentId) =>{
		return agents.hasOwnProperty(agentId) ?agents[agentId] : null;
	};

	
	useEffect(() => { 
		if (hierarchicalSimulations && hierarchicalSimulations.length > 0){
			const findModificationhistory =	hierarchicalSimulations.find(sim => sim.modifications !== null);
			if(findModificationhistory){
				setHasModificationhistory(findModificationhistory);
			}
			else {
				setHasModificationhistory(null);
			}
		}
	}, [hierarchicalSimulations]);

	const getGeometriesForTarget = (modification, modifications) => {
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
			const agentTmp = getAgent(modification.object.agentId);
			if (agentTmp) {
				tempEntities.push(agentTmp);
			}
			

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
	
	const createModificationObject = (existingModification) =>{
		let avertType  = ""; 
		let objectType = "";
		let avertObject = "";
		
		function getAgentGroupInfo(groupId){
			return agentGroups && agentGroups.hasOwnProperty(groupId) ? agentGroups[groupId] : null;
		}

		const modObj = _.cloneDeep(existingModification);
		objectType = modObj.objectType;
		
		if (modObj.objectType === "OBJECTIVE"){
			avertType = "ADD";
			modObj.object["coordinates"] = `${modObj.object.x},${modObj.object.y},${modObj.object.z}`;
			avertObject = modObj.object; 
		} else{
			avertType = "MODIFY";
			avertObject = getModificationObject(null, null, modObj, _.cloneDeep(modificationsConfig));

			if (avertObject.groupId && avertObject.groupId){
				const agntGrpInfo = getAgentGroupInfo(avertObject.groupId);
				avertObject.agentIdList = agntGrpInfo.entityData.properties.agentIds;
				avertObject.groupName = agntGrpInfo.entityData.properties.name, 
				avertObject.displayName = agntGrpInfo.entityData.properties.name;
			} else {
				avertObject.displayName =  avertObject.agentName;
			}
		}

		const modbj = {
			id: existingModification.id || "",
			userId: existingModification.userId || "",
			tabletopSessionId: sessionId,
			status: existingModification.status || "", // created or submitted or approved or rejected or edited or resubmitted
			type: avertType,
			object: avertObject,
			objectType: objectType.toUpperCase(), // agent or agentGroup or objective or interdictionSite,
			comment: existingModification.comment|| "",
			externalMessage: null 
		};

		if (modbj.objectType !== "OBJECTIVE"){
			modbj.agents = getEntities(existingModification);//todo: remove it once we test it.
		}

		return modbj;
	};

	let nonFacilitatorUserMappings = [];
	const getNonFacilitatorUserMappings = () => {
		
		if (!nonFacilitatorUserMappings || nonFacilitatorUserMappings.length<1){
			if (isController){ 
				//Note: get mapping info (selfAgents and controlled agents) of his team (e.g. RED or BLUE) ONLY.
				nonFacilitatorUserMappings = _.find(userMappings, (um) => {
					return um.userId === userInfo.userId;
				});
				//const teamId = nonFacilitatorUserMappings.userRole; //controller team
				// userMappings.forEach(um => {
				// 	if (um.userId !== userInfo.userId && um.userRole === teamId){
				// 		nonFacilitatorUserMappings.selfAgentIds = _.union(nonFacilitatorUserMappings.selfAgentIds, um.selfAgentIds);
				// 		nonFacilitatorUserMappings.controlledAgentIds = _.union(nonFacilitatorUserMappings.controlledAgentIds, um.controlledAgentIds);
				// 	}
				// });

			} else {
				//Note: get mapping info (selfAgents and controlled agents) of his mapping. 
				nonFacilitatorUserMappings = _.find(userMappings, (um) => {
					return um.userId === userInfo.userId;
				});

				if (!nonFacilitatorUserMappings){
					const selfAgentId =""; // ? 
					nonFacilitatorUserMappings= {};
					nonFacilitatorUserMappings.selfAgentIds = [selfAgentId];
					nonFacilitatorUserMappings.controlledAgentIds = []; 
				}
				//#endregion
			}
		}

		return nonFacilitatorUserMappings;
	};

	const getModificationsVisibleToMe = (mods) => {
		
		if (isFacilitator || userInfo.isFacilitator){
			return mods;
		}
		
		//This contain agentIds to lookup.
		const usrMappings = getNonFacilitatorUserMappings(); 
		const modsOfControllerOrAgent = _.filter(mods, (mod) => {
			let retVal= false;
			let agentIdTmp = null;

			if (mod.object.messageType === "AddObjective"){
				return true;
			} else if (mod.object.groupId){
				const agntGrp = agentGroups[mod.object.groupId];
				agentIdTmp = agntGrp.entityData.properties.agentIds[0];
			} else {
				agentIdTmp = mod.object.agentId;
			}

			if (isController && mod.object.team && mod.object.team.toUpperCase() === usrMappings.userRole.toUpperCase()){
				return true; 
			} 
			else if (!isController) {
				//Its an Agent
				if (usrMappings.selfAgentIds && usrMappings.selfAgentIds.includes(agentIdTmp)){
					retVal = true;
				} else if (usrMappings.controlledAgentIds && usrMappings.controlledAgentIds.includes(agentIdTmp)){
					retVal = true;
				} 	
			}

			return retVal;
		});

		return modsOfControllerOrAgent;
	};

	const getModifications = (modifications) => {
		//Note: Facilitator see all modifications, controller see his team modifications and agent see their own modification( and controlled agents).
		
		let myModifications = [];
		const modificationsVisible = getModificationsVisibleToMe(_.cloneDeep(modifications));
		
		myModifications = modificationsVisible && modificationsVisible.map( m => {
			return createModificationObject(m);
		}) || [];
		
		// if (myModification.length>0 && myModification[0].hasOwnProperty("createdDate")){
		// 	myModification = sortModifications(myModification);
		// }
		return myModifications;
	};

	// const sortModifications = (modArray) => {
	// 	return modArray.sort((a, b) =>{
	// 		const dateA = new Date(a.createdDate);
	// 		const dateB = new Date(b.createdDate);
	// 		return dateA - dateB; //Asc order
	// 	});
	// };
	//#endregion
	const currentdate = new Date();
	return (
		<div>
			<div style={{display:"flex", flexDirection:"row-reverse", paddingRight:"10px"}}>
				<Button disabled={!hasModificationhistory} style={{minHeight:"41px", width:"258px"}} variant="contained" color="primary" onClick={openPdf}>Export to PDF</Button>
			</div>
			<div id="modificationHistory">
				<div id="report-title">
					<p className="pdfHeading">Modification History Report</p>
					<p>{getBaseSimName()}</p>
					<p><span>Report Date: </span><span>{currentdate.toLocaleString()}</span></p>
				</div>
				{
					(hierarchicalSimulations && hierarchicalSimulations.length >0)
						&& _.map(hierarchicalSimulations, (simu, simkey) => {
							return (
								
								<div key={`ncm-${simkey}`} className="modificationflexColumn" style={{marginTop:20}} >
									<div className="modificationHistoryflex" style={{width: "100%"}}>
										<CubeOutline style={{ color: "#fff", marginTop:-2, width: (simkey<1? 26 : 18), height: (simkey<1? 28 : 20) }} data-html2canvas-ignore="true"/>
										{ (simkey === 0) && 
											<div className="nameContainer">
												<div className="b2-bright-gray" data-html2canvas-ignore="true">Current Exercise</div>
												<div className="b1-white">{simu.name}</div>
											</div>
										}
										{ (simkey > 0) && 
											<div className="nameContainer">
												<div className="b1-white">{simu.name}</div>
											</div>
										}
										
										<div className="b1-white" style={{width:"20%", alignSelf: "center", textAlign: "right", marginRight:5 }}>
											{`Time: ${simu.parentDivergeTime ? utilities.truncate(simu.parentDivergeTime, simTimePrecision) : 0}`}</div>
										
									</div>
									{
										<div style={{width: "100%", backgroundColor: "transparent", marginTop:10, marginBottom:10, paddingRight:10}}>
											{
												agents && _.map( getModifications(simu.modifications), (modObj, index) => {
													return (
														<ModificationEntry key={`cm-MyMod${index}`} entities={getEntitiesForTarget(modObj)} index={index}
															geometries={getGeometriesForTarget(modObj)} history={true}
															isController={isController} entryMode={modObj.status? modObj.status: ""} 
															description={getDisplayText(modObj, modificationsConfig, "", floorPlans)} 
															existingcomment = {modObj.comment? modObj.comment : ""}
															onEdit={null} onDelete={null} onAccept={null} onReject={null} onUndo={null} />
													);
												})
											}
										</div>
									}
								</div>
							);
						})
				}
			</div>
		</div>
	);
};

ModificationsHistory.propTypes = propTypes;
export default ModificationsHistory;