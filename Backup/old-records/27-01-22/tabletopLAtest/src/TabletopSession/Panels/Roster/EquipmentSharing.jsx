import React, {useState, useEffect, Fragment} from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography, Container } from "@material-ui/core";
import {TableContainer, Table, TableRow, TableBody, TableCell, TableHead, Tooltip} from "@material-ui/core";
import T2CheckBox from "../../../shared/components/Checkbox";
import * as utilities from "../../../shared/utility/utilities";
import { getEquipmentDetail } from "../../../shared/utility/equipmentUtility";
import AgentIcon from "../../MapBase/LayerSources/MapLayer/AgentIcon";
import EquipmentInfoEvent from "../../../entities/events/EquipmentInfoEvent";
import {List, ListItem, ListItemText, Popper, ClickAwayListener}  from "@material-ui/core";
import {Menu, MenuItem } from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer:{
		display: "flex",
		flexDirection: "column",
		flexWrap:"wrap",
		paddingLeft: 0,
		paddingRight: 0
	},
	flexContainerHorizontalStart:{
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start"
		
	},

	flexContainerHorizontalWrap:{
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		flexWrap: "wrap",
		alignItems: "stretch"
	},

	dialogActions: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 50,
		paddingBottom: 20,
		paddingRight: 10,
		background: "#414449"
	},

	tableContainer:{
		height: 350,
		marginTop:20,
		overflowY: "scroll"
	},
	dialogActionsRTL: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 50,
		paddingBottom: 20,
		paddingLeft: 10,
		background: "#414449"
	}
};

const propTypes = {
	classes:PropTypes.object.isRequired, 
	userInfo:PropTypes.object,
	selfAgent:PropTypes.object, 
	agentInfo:PropTypes.object, 
	sessionId:PropTypes.string,
	simTime: PropTypes.number,
	simId: PropTypes.number,
	simTimePrecision: PropTypes.number,
	agents: PropTypes.object, 
	simulationData: PropTypes.object,
	communications: PropTypes.array,
	equipmentConfig: PropTypes.array,
	onClose: PropTypes.func,
	shareEvents: PropTypes.func,
	dir: PropTypes.string
};
const EquipmentSharing = ({classes, userInfo, selfAgent, agentInfo, agents, simulationData, sessionId, simId, simTimePrecision, simTime, shareEvents, communications, equipmentConfig, onClose, dir}) => {
	const [selectedEquipments, setSelectedEquipments] = useState([]);
	const [selectedDevices, setSelectedDevices] = useState([]);
	const [selectedAgents, setSelectedAgents] = useState([]);
	const [agentsList, setAgentsList] = useState([]);
	const [buttonEl, setButtonEl] = React.useState(null);
	const [btnEl, setBtnEl] = React.useState(null);
	const [buttonElAgentId, setButtonElAgentId] = React.useState(null);
	const [btnCommId, setBtnCommId] = React.useState(null);
	const [recipientsAnchorEl, setRecipientsAnchorEl] = useState(null);
	const [currentRecipients, setCurrentRecipients] = useState(null);

	const isFacilitator = () =>{
		//console.log(agentInfo);
		return userInfo.isFacilitator; 
	};
	
	useEffect(() => {
		const agents = getSortedAgents();
		const agentsList =[];
		agents.map(agnt => {
			if(!agnt.entityData.properties.neutralized){
				agentsList.push(agnt);
			}
		});
		setAgentsList(agentsList);
	}, [agents]);

	const handleToggleFacilitator = (event, agentId) => {
		//console.log(event);
		setButtonEl(buttonEl ? null : event.currentTarget);
		setButtonElAgentId(agentId);
	};

	const handleCloseFacilitator =() => {
		setButtonEl(null);
		setButtonElAgentId(null);
	};

	const handleToggleNonFacilitator = (event, commId) => {
		//console.log(event);
		setBtnEl(btnEl ? null : event.currentTarget);
		setBtnCommId(commId);
	};

	const handleCloseNonFacilitator =() => {
		setBtnEl(null);
		setBtnCommId(null);
	};

	const getOwnerCommDevices = () => {
		const commDevicesTemp = [];
		if (!isFacilitator()){
			
			_.map(simulationData && simulationData.commDevices, (comm) => {
				if (comm.entityData.properties.ownerId === selfAgent.id){
					commDevicesTemp.push(comm);
				}
			});
		}
		return commDevicesTemp;
	};

	const [ownerCommDevices] = useState(getOwnerCommDevices());

	const getAgentEquipments = () => {
		const equipmentsTemp = [];
		_.map(agentInfo && agentInfo.entityData.properties.equipment, (equip) => {
			equipmentsTemp.push(equip);
		});
		
		return equipmentsTemp;
	};
	const [agentEquipments] = useState(getAgentEquipments());

	const viewRecipients = (event, recipients) => {
		setCurrentRecipients(recipients);
		setRecipientsAnchorEl(event.currentTarget);
	};

	const handleRecipientsClose = () => {
		setCurrentRecipients(null);
		setRecipientsAnchorEl(null);
	};

	const getSortedAgents = () => {
		
		let agentsTemp = _.cloneDeep(agents);
		const eventTeam = agentInfo.entityData.properties.team; //red or blue
		const eventInfo = new EquipmentInfoEvent();
		let agentsArray = [];

		if (eventInfo.canCommunicateToSameTeam && eventInfo.canCommunicateToOpponentTeam){
			_.map(agentsTemp, (agent)=> {
				if (agent.entityData.properties.enabled) {
					agentsArray.push(agent);
				}
			});

		} else if (eventInfo.canCommunicateToSameTeam){
			agentsTemp = _.map(agentsTemp, (agent)=> {
				if (agent.entityData.properties.team === eventTeam && agent.entityData.properties.enabled){
					agentsArray.push(agent);
				}
			});
		} else if (eventInfo.canCommunicateToOpponentTeam){
			agentsTemp = _.map(agentsTemp, (agent)=> {
				if (agent.entityData.properties.team !== eventTeam && agent.entityData.properties.enabled){
					agentsArray.push(agent);
				}
			});
		}

		const exclusiveList = eventInfo.getCommsExclusionList();
		agentsArray  = agentsArray.filter( agnt => {
			return exclusiveList.includes(agnt.id)? false: true;
		});

		return _.orderBy(agentsArray, ["entityData.properties.team", "entityData.properties.name"], ["asc", "asc"]);
	};

	const getSortedEqipments = ()=>{
		const equips = [];
		agentEquipments.forEach(equip=>{
			const equipmentDetail = getEquipmentDetail(equip, equipmentConfig);
			if (equipmentDetail && equipmentDetail.display) {
				equips.push({libraryId: equip.libraryId, category:equipmentDetail.category, icon:equipmentDetail.icon, name: equip.name});
			}
		});

		return _.orderBy(equips, ["category"], ["asc"]);
	};

	const getEqipmentMappedToAgents = (id) => {
		let time= 0;
		let equipDetail ={};
		let detailsToShowInTable =[];
		const equipmentsSharedToAgent = [];
		let previouSharedTo = null;
		let itemsArray = [];
		//const sharedFrom = null;
		//let  joinedIds = "";
		const communi = _.filter(communications, comm => {
			return (comm.to.includes(id) && comm.data.includes(agentInfo.id));
		});
		communi.forEach(comm => {
			if (comm.tabletopSessionId === sessionId && comm.simId === simId){
				if (comm.type === "EQUIPMENT_INFO" && isFacilitator()){
					if ((comm.data.length > 0) && comm.commDevices.length === 0){
						agentEquipments && agentEquipments.map( eqp => {
							equipDetail = getEquipmentDetail(eqp, equipmentConfig);
							if (equipDetail && equipDetail.display) {
								if(comm.data.includes(eqp.libraryId)) {
									equipmentsSharedToAgent.push({id:eqp.libraryId, name: equipDetail.category});
								}
							}
						});
						const dataId = [];
						if(dataId.length > 0){
							dataId.length = 0;
						}
						equipmentsSharedToAgent.map(equip => {
							dataId.push(equip.id);
							
						});
						
						const joinedIds = `${agentInfo.id}#${dataId.join(",")}`;
						
						if (comm.data.length === joinedIds.length && previouSharedTo != comm.to){
							equipmentsSharedToAgent.map(equip => {
								//get last time for agent
								time = utilities.truncate(comm.time, simTimePrecision);
								const matchedIndex = itemsArray.findIndex(item => item.equipId === equip.id && item.agentid === id);
								if(matchedIndex !== -1){
									if(parseInt(itemsArray[matchedIndex].time) > parseInt(time)){
										itemsArray[matchedIndex].time = time;
									}
								}
								else {
									itemsArray.push({agentid: id, equipId:equip.id, name:equip.name, time:time});
								}
								
								
							});
							//return detailsToShowInTable;	
						}
						
						itemsArray =  _.orderBy(itemsArray, ["name"], ["asc"]);
						detailsToShowInTable = itemsArray.map(item => {
							return (
								<TableRow key={item.equipId}>
									<TableCell align="left" width="150">{item.name}</TableCell>
									<TableCell align="right" width="50">{item.time}</TableCell>
								</TableRow>
							);
						});

						if(previouSharedTo != comm.to) {
							previouSharedTo = comm.to;
							//joinedIds = "";
							if(equipmentsSharedToAgent.length > 0){
								equipmentsSharedToAgent.length = 0;
							}
							
						}
					}
				}
			}
		});
		return detailsToShowInTable;
	};

	const getLastCommunicatedTime = (id) =>{
		let time= null;
		let equipDetail ={};
		const equipmentsSharedToAgent = [];
		const communi = _.filter(communications, comm => {
			return (comm.to.includes(id) && comm.data.includes(agentInfo.id));
		});
		communi.forEach(comm => {
			if (comm.tabletopSessionId === sessionId && comm.simId === simId){
				if (comm.type === "EQUIPMENT_INFO" && isFacilitator()){
					if ((comm.data.length > 0) && comm.commDevices.length === 0){
						if(equipmentsSharedToAgent.length > 0){
							equipmentsSharedToAgent.length = 0;
						}
						agentEquipments && agentEquipments.map( eqp => {
							equipDetail = getEquipmentDetail(eqp, equipmentConfig);
							if (equipDetail && equipDetail.display) {
								if(comm.data.includes(eqp.libraryId)) {
									equipmentsSharedToAgent.push({id:eqp.libraryId, name: equipDetail.category});
								}
							}
						});
						const dataId = [];
						if(dataId.length > 0){
							dataId.length = 0;
						}
						equipmentsSharedToAgent.map(equip => {
							dataId.push(equip.id);
						});
						
						const joinedIds = `${agentInfo.id}#${dataId.join(",")}`;
						
						if (comm.data.length === joinedIds.length){
							//get last time for agent
							time = utilities.truncate(comm.time, simTimePrecision);
						}
						else {
							time = null;
						}
					}
				}
			}
		});
		return time;
	};

	const equipmentChangeHandler =(event, equipId ) =>{
		
		const equipments = _.cloneDeep(selectedEquipments);
		const indexC = equipments.findIndex((ele) => ele === equipId);
		if (indexC > -1){
			equipments.splice(indexC, 1);
		}
		else {
			equipments.push(equipId);
		}
		
		setSelectedEquipments(equipments);
	};
	
	const commDeviceChangeHandler =(event, commId) =>{
		const devices = _.cloneDeep(selectedDevices)|| [];
		if (event.target.checked){
			devices.push(commId);
		} else if (!event.target.checked){
			const indexC = devices.findIndex((ele) => ele === commId);
			if (indexC > -1){
				devices.splice(indexC, 1);
			}
		}

		setSelectedDevices(devices);
	};

	const isAgentsSelected =( agentsList ) => {
		const teamList = agentsList.filter(agent => {
			return (isAgentDisabled(agent.id) === false && (!agent.entityData.properties.neutralized));
		});
		if(teamList.length === selectedAgents.length && selectedAgents.length > 0){
			return true;
		}
		else {
			return false;
		}
	};

	const selectAll =(event, agentsList)=>{
		const agentIds = [];
		if (event.target.checked){
			agentsList.forEach(agent => {
				if(!agent.entityData.properties.neutralized && isAgentDisabled(agent.id) === false){
					agentIds.push(agent.id);
				}
			});
		}
		else {
			agentIds.length = 0;
		}
		setSelectedAgents(agentIds);
	};

	const playerChangeHandler =(event, agentId) =>{
		const agentIds = _.cloneDeep(selectedAgents);
		if (event.target.checked){
			agentIds.push(agentId);
		} else if (!event.target.checked){
			const indexC = agentIds.findIndex((ele) => ele === agentId);
			if (indexC > -1){
				agentIds.splice(indexC, 1);
			}
		}

		setSelectedAgents(agentIds);
	};

	const isEquipmentsSelected = (equipId) =>{
		return selectedEquipments && (selectedEquipments.length>0) && selectedEquipments.includes(equipId) || false;
	};

	const isCommDeviceSelected = (commId) =>{
		return selectedDevices && (selectedDevices.length>0) && selectedDevices.includes(commId) || false;
	};

	const isAgentSelected = (agentId) =>{
		return selectedAgents && (selectedAgents.length>0) && selectedAgents.includes(agentId) || false;
	};

	const isAgentDisabled = (agentId) => {
		let equipCount =[];
		let allShared = false;
		const communi = _.filter(communications, comm => {
			return (comm.to.includes(agentId) && comm.data.includes(agentInfo.id) && comm.commDevices.length <1);
		});
		communi.forEach(comm => {
			let  eqipMappedCount =  agentEquipments.length;
			if (comm.type === "EQUIPMENT_INFO" && isFacilitator()){
				agentEquipments && agentEquipments.map( eqp => {
					const equipDetail = getEquipmentDetail(eqp, equipmentConfig);
					eqipMappedCount = equipDetail.display ? eqipMappedCount : eqipMappedCount -1;
					if (equipDetail && equipDetail.display) {
						if(comm.data.includes(eqp.libraryId) && (!equipCount.includes(eqp.libraryId))) {
							equipCount.push(eqp.libraryId);
					   }
					}
				});
			}
			if(eqipMappedCount === equipCount.length){
				allShared = true;
			}
		});
		return allShared;
	};

	const isCommDeviceDisabled =(commId)=> {
		let equipCount =0;
		let allShared = false;
		const communi = _.filter(communications, comm => {
			return (comm.commDevices.includes(commId) && comm.data.includes(agentInfo.id));
		});
		communi.forEach(comm => {
			let  eqipMappedCount = 0;
			if (comm.type === "EQUIPMENT_INFO" && !isFacilitator()){
				agentEquipments && agentEquipments.map( eqp => {
					const equipDetail = getEquipmentDetail(eqp, equipmentConfig);
					if (equipDetail && equipDetail.display) {
						eqipMappedCount = eqipMappedCount +1;
						if(comm.data.includes(eqp.libraryId)) {
							equipCount = equipCount +1;
					   }
					}
				});
			}
			if(eqipMappedCount === equipCount){
				allShared = true;
			}
		});
		return allShared;
	};

	const handleNotify =() =>{
		/*
		{
			"id": "aa34daa5-a438-4bd8-9180-5a8a1185f727", // Rethink generated id
			"tabletopSessionId": "66e4daa5-a438-4bd8-9180-5a8a1185f725",
			"simId": 54, // simulation run id
			"time": 23.1234535,
			"type": "AVERT_EVENT", // AVERT_EVENT or EQUIPMENT_INFO
			"from": "2c9c0362-345b-4f33-9976-219a4566b9c3",
			"commDevices": [ 345465, 6966400 ],
			"to": [ 35516, 35524 ], // Agents to whom the message was communicated
			"data": "315", // Message data - Avert event ID or equipment message like "35430#12321,34211" (agentId#libraryIds)
			"isDeleted": false
		}
		*/
		const commObj = {
			time: simTime,
			type: "EQUIPMENT_INFO",
			from: userInfo.userId,
			data: "",
			commDevices: [],
			to: [],
			isDeleted: false
		};
		
		const toIds = [];
		if (isFacilitator()){

			selectedAgents.forEach(agnt => {
				if (!toIds.includes(agnt))	{
					toIds.push(agnt);
				}
			});
		}
		else {
			
			commObj.commDevices = selectedDevices;

			ownerCommDevices.map(comm => {
				if (selectedDevices.includes(comm.id)){
					comm.entityData.properties.recipientIds.forEach(rec => {
						if (!toIds.includes(rec))	{
							toIds.push(rec);
						}
					});
				}	
			});	
		}
		commObj.data = selectedEquipments && (agentInfo.id + "#" + selectedEquipments.join(","));
		commObj.to = toIds;
		shareEvents(commObj);
	};
	
	const disabledNotify =() =>{
		let retDisabled = false;
		
		if (selectedEquipments.length < 1)
		{
			retDisabled = true;
		}
		else {
			if (isFacilitator()){
				retDisabled = selectedAgents.length>0? false: true;
			}
			else {
				retDisabled = selectedDevices.length>0? false: true;
			}
		}

		return retDisabled;
	};
	
	const getRecipients = (recipients) =>{
		const filteredRecipients = recipients.map(rec => {
			let nameTemp = "No name";
			if (agents.hasOwnProperty(rec)){
				nameTemp = agents[rec].entityData.properties.displayName || agents[rec].entityData.properties.name;
			} 
			return nameTemp;
		});

		return filteredRecipients.sort();
	};

	const getLastCommunicationTimeNonFacilitators =(id) =>{
		let time =null;
		let equipDetail ={};
		const agntEquips = [];
		//let detailsToShowInTable ={};
		const communi = _.filter(communications, comm => {
			return (comm.commDevices.includes(id) && comm.data.includes(agentInfo.id));
		});
		communi.forEach(comm => {
			if (comm.type === "EQUIPMENT_INFO" && !isFacilitator()){
				if ((comm.commDevices.length > 0)) {
					if(agntEquips.length > 0){
						agntEquips.length = 0;
					}
					agentEquipments && agentEquipments.map( eqp => {
						equipDetail = getEquipmentDetail(eqp, equipmentConfig);
						if (equipDetail && equipDetail.display) {
							if(comm.data.includes(eqp.libraryId)) {
								agntEquips.push({id:eqp.libraryId, name: equipDetail.category});
						   }
						}
					});
					const dataId = [];
					if(dataId.length > 0){
						dataId.length = 0;
					}
					agntEquips.map(equip => {
						dataId.push(equip.id);
					});
					
					const joinedIds = `${agentInfo.id}#${dataId.join(",")}`;
					if (comm.data.length === joinedIds.length){
						time = utilities.truncate(comm.time, simTimePrecision);
					}
					
				}
			}
		});
		return time;
	};

	const getCommDevicesTimes =(id) => {
		let time =0;
		let equipDetail ={};
		const agntEquips = [];
		let detailsToShowInTable ={};
		let previouSharedTo = null;
		let itemsArray = [];
		const communi = _.filter(communications, comm => {
			return (comm.commDevices.includes(id) && comm.data.includes(agentInfo.id));
		});
		communi.forEach(comm => {
			if (comm.type === "EQUIPMENT_INFO" && !isFacilitator()){
				if ((comm.commDevices.length > 0)) {
					if(agntEquips.length > 0){
						agntEquips.length = 0;
					}
					agentEquipments && agentEquipments.map( eqp => {
						equipDetail = getEquipmentDetail(eqp, equipmentConfig);
						if (equipDetail && equipDetail.display) {
							if(comm.data.includes(eqp.libraryId)) {
								agntEquips.push({id:eqp.libraryId, name: equipDetail.category});
							}
						}
					});
					const dataId = [];
					if(dataId.length > 0){
						dataId.length = 0;
					}
					agntEquips.map(equip => {
						dataId.push(equip.id);
					});
					
					const joinedIds = `${agentInfo.id}#${dataId.join(",")}`;
					if (comm.data.length === joinedIds.length && previouSharedTo != comm.to){
						agntEquips.map(equip => {
							//get last time for agent
							time = utilities.truncate(comm.time, simTimePrecision);
							const matchedIndex = itemsArray.findIndex(item => item.equipId === equip.id && item.agentid === id);
							if(matchedIndex !== -1){
								if(itemsArray[matchedIndex].time > time){
									itemsArray[matchedIndex].time = time;
								}
							}
							else {
								itemsArray.push({agentid: id, equipId:equip.id, name:equip.name, time:time});
							}
							
							
						});
					}
					itemsArray =  _.orderBy(itemsArray, ["name"], ["asc"]);
					detailsToShowInTable = itemsArray.map(item => {
						return (
							<TableRow key={item.equipId}>
								<TableCell align="left" width="150">{item.name}</TableCell>
								<TableCell align="right" width="50">{item.time}</TableCell>
							</TableRow>
						);
					});

					if(previouSharedTo != comm.to) {
						previouSharedTo = comm.to;
						if(agntEquips.length > 0){
							agntEquips.length = 0;
						}
						
					}
				}
			}
		});
		return detailsToShowInTable;
	};

	const getPopper =(ref, id) =>{
		if(ref && id){
			return (
				<Popper 
					disablePortal open={Boolean(ref)} 
					anchorEl={ref}  
					style={{zIndex: 99}} 
					modifiers={{
						flip: {
							enabled: false
						},
						offset: {
							enabled: true,
							offset: "0"
						}
					}}>
					<ClickAwayListener onClickAway={isFacilitator() ? handleCloseFacilitator : handleCloseNonFacilitator}>
						<Table size="small" className={isFacilitator() ? "popperForDisplayingTime" : "popperForDisplayingTimeNonFacilitators"}>
							<TableBody>
								{!isFacilitator() &&
									getCommDevicesTimes(id)
								}
								{isFacilitator() &&
									getEqipmentMappedToAgents(id)
								}
							</TableBody>
						</Table>	
					</ClickAwayListener>
				</Popper>
			);
		}
		
	};

	return (
		<Container className={ classes.flexContainer} style={{width:isFacilitator()? 632: 722, marginLeft:-20}}>
			<div className={ classes.flexContainerHorizontalStart}>
				<div style={dir == "rtl" ? {marginRight:15} : {marginLeft:15}}><AgentIcon agent={agentInfo} group={false} size={30}/></div>
				<div style={dir == "rtl" ? {marginRight:0} : {marginLeft:0}}>
					<Typography variant="body1" className="b1-bright-gray" style={dir == "rtl" ? {marginRight:10, marginTop: 5, color:"#b5b9be", height:16} : {marginLeft:10, marginTop: 5, color:"#b5b9be", height:16}}>
						{<Translate value="tableopSession.panels.roster.equipmentSharing.chooseWeapons" count={agentInfo.entityData.properties.displayName|| agentInfo.entityData.properties.name}/>}</Typography>
				</div>
			</div>
			
			{/*Choose Equipments to notify*/}
			<div className={ classes.flexContainerHorizontalWrap} style={dir == "rtl" ? {width:"100%", paddingTop:0, paddingRight:10, marginTop:10} : {width:"100%", paddingTop:0, paddingLeft:10, marginTop:10}}>
				{ getSortedEqipments().map(equip => {
					return (
						<Tooltip key={equip.libraryId} title={equip.name}>
							<div   
								className={isEquipmentsSelected(equip.libraryId) ? "shareEquipmentSelected": "shareEquipment"} 
								style={{width:128}}
								onClick={(e) => equipmentChangeHandler(e, equip.libraryId)}>
								<div>
									<CheckCircleOutline />
								</div>
								<div className={ classes.flexContainer} style={dir == "rtl" ? {marginTop:5, marginBottom:5, marginRight:5, backgroundColor:"transparent"} : {marginTop:5, marginBottom:5, marginLeft:5, backgroundColor:"transparent"}}>
									<div style={{width: 22, height: 16, alignSelf: "center"}}>
										<img style={{width: 22}} src={equip.icon} className="b1-white"></img>
									</div>
									<Typography variant="body1" className="b1-white" style={dir == "rtl" ? {marginLeft:5, width: 75, textAlign:"center"} : {marginRight:5, width: 75, textAlign:"center"}}>{equip.category}</Typography>
								</div>
							</div>
						</Tooltip>
					);
				}
				)}
			</div>
			
			<div className={ classes.flexContainer} style={dir == "rtl" ? {width:"100%", paddingTop:20, paddingRight:10, marginTop:0} : {width:"100%", paddingTop:20, paddingLeft:10, marginTop:0}}>
				{
					!isFacilitator() && 
					<Typography variant="body1" className="b1-bright-gray" style={dir == "rtl" ? {marginRight:10, color:"#b5b9be"} : {marginLeft:10, color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.chooseCommDevices"/></Typography>
				}
				{
					isFacilitator() && <Typography variant="body1" className="b1-bright-gray" style={dir == "rtl" ? {marginRight:10, color:"#b5b9be"} : {marginLeft:10, color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.choosePlayers"/></Typography>
				}
				
				{
					isFacilitator() && 
					<Fragment>
						<TableContainer className={classes.tableContainer}>
							<Table size="small" aria-label="a dense table">
								<TableHead>
									<TableRow>
										<TableCell padding="checkbox" ><T2CheckBox name="Select All" checked={isAgentsSelected(agentsList)} onChange={(e) => selectAll(e, agentsList)} /></TableCell>
										<TableCell align="left" width="80" ><div style={{color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.team"/></div></TableCell>
										<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.player"/></div></TableCell>
										<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.time"/></div></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{getSortedAgents().map(agnt => {
										const lastCommunicatedTime = getLastCommunicatedTime(agnt.id);
										return (<TableRow key={`tr ${agnt.id}`}>
											<TableCell padding="checkbox">
												<T2CheckBox disabled={isAgentDisabled(agnt.id) || agnt.entityData.properties.neutralized}
													checked={isAgentSelected(agnt.id)} name={`${agnt.id}`} onChange={(e) => playerChangeHandler(e, agnt.id)} />
											</TableCell>
											<TableCell align="left" width="80"><AgentIcon agent={agnt} group={false} /></TableCell>
											<TableCell align="left">{agnt.entityData.properties.displayName|| agnt.entityData.properties.name}</TableCell>
											<TableCell align="left" className="viewTimeLink">
												{lastCommunicatedTime != null &&
													<div>
														<a className="viewTimes" style={{color: "#4db5f4", cursor: "pointer"}} onClick={(event) => handleToggleFacilitator(event, agnt.id)}><Translate value="tableopSession.panels.roster.equipmentSharing.viewTimes"/></a>
														
													</div>
												}
											</TableCell>
										</TableRow>);
									})}
								</TableBody>
							</Table>
						</TableContainer>
						{buttonEl && buttonElAgentId &&
							getPopper(buttonEl, buttonElAgentId)
						}
					</Fragment>
				}
				{
					!isFacilitator() && 
					<Fragment>
						<TableContainer className={classes.tableContainer}>
							<Table size="small" aria-label="comm sharing table">
								<TableHead>
									<TableRow>
										<TableCell> </TableCell>
										<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.comm"/>&nbsp;<Translate value="tableopSession.panels.roster.equipmentSharing.device"/></div></TableCell>
										<TableCell align="left"><div style={{color:"#b5b9be", width:150}}><Translate value="tableopSession.panels.roster.equipmentSharing.owner"/></div></TableCell>
										<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.recipients"/></div></TableCell>
										<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.panels.roster.equipmentSharing.time"/></div></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{ownerCommDevices.map(comm => {
										const lastCommunicatedTime = getLastCommunicationTimeNonFacilitators(comm.id);
										const ownerName = selfAgent && selfAgent.entityData.properties.displayName? selfAgent.entityData.properties.displayName: selfAgent.entityData.properties.name;
										return (<TableRow key={`tr ${comm.id}`}>
											<TableCell padding="checkbox">
												<T2CheckBox  disabled={isCommDeviceDisabled(comm.id)} checked={isCommDeviceSelected(comm.id)}
													 name={`${comm.id}`} onChange={(e) => commDeviceChangeHandler(e, comm.id)} />
											</TableCell>
											<TableCell align="left">{comm.entityData.properties.name}</TableCell>
											<TableCell align="left">{ownerName}</TableCell>
											<TableCell align="left">{
												<div style={{color: "#414449"}}>
													<List key={comm.id} component="nav" aria-label={"View recipients"}>
														<ListItem
															button
															aria-haspopup="true"
															aria-controls="view-recipient"
															aria-label="View recipient"
															onClick={(e) => viewRecipients(e, comm.entityData.properties.recipientIds)}
														>
															<ListItemText primary={<span style={dir == "rtl" ? {color:"#4DB5F4", marginRight:-12} : {color:"#4DB5F4", marginLeft:-12}}><Translate value="tableopSession.panels.roster.equipmentSharing.viewRecipients"/></span>}/>
																
														</ListItem>
													</List>
												</div>
											}</TableCell>
											<TableCell align="left" className="viewTimeLink">
												{lastCommunicatedTime != null &&
													<div>
														<a className="viewTimes" style={{color: "#4db5f4", cursor: "pointer"}} onClick={(event) => handleToggleNonFacilitator(event, comm.id)}><Translate value="tableopSession.panels.roster.equipmentSharing.viewTimes"/></a>
														
													</div>
												}
											</TableCell>
										</TableRow>);
									})}
								</TableBody>
							</Table>
						</TableContainer>
						{btnEl && btnCommId &&
							getPopper(btnEl, btnCommId)
						}
						{recipientsAnchorEl && currentRecipients && 
							<Menu
								id="menu-recipients" 
								PaperProps={{
									style: {
										backgroundColor: "#5E6571"
									}
								}}
								anchorEl={recipientsAnchorEl}
								keepMounted
								open={Boolean(recipientsAnchorEl)}
								onClose={handleRecipientsClose}
							>
								{
									getRecipients(currentRecipients).map((option) => {
										return (<MenuItem
											key={option}
											className="viewRecipientsList"
											onClick={handleRecipientsClose}
										>
											{option}
										</MenuItem>);
									})
								}
							</Menu>
						}
					</Fragment>
				}
			</div>
			
			<Container className={dir == "rtl" ? classes.dialogActionsRTL : classes.dialogActions}>
				<Button style={dir == "rtl" ? { width: 74, height:41, marginRight:10, marginLeft:20} : { width: 74, height:41, marginLeft:10, marginRight:20}} onClick={onClose}><Translate value="tableopSession.panels.roster.equipmentSharing.cancel"/></Button>
				<Button variant="contained" color="primary" disabled={disabledNotify()} style={dir == "rtl" ? { width: 74, height:41, marginRight:0, marginLeft:10 } : { width: 74, height:41, marginLeft:0, marginRight:10 }} onClick={handleNotify}><Translate value="tableopSession.panels.roster.equipmentSharing.notify"/></Button>
			</Container>

		</Container>
	);
};

EquipmentSharing.propTypes = propTypes;
export default withStyles(styles)(EquipmentSharing);