import React, {useState, useEffect} from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography, Container } from "@material-ui/core";
import { AlertRhombus } from "mdi-material-ui";
import * as utilities from "../../../shared/utility/utilities";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import T2CheckBox from "../../../shared/components/Checkbox";
import EventTextContainer from "../../Controls/EventText/EventTextContainer";
//import { StyledListMenu } from "./StyledListMenu";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AgentIcon from "../../MapBase/LayerSources/MapLayer/AgentIcon";
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

	flexContainerHorizontal:{
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},

	listHeight:{
		height:"calc(100vh - 194px)",
		overflowY: "scroll"
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
	}
};

const propTypes = {
	classes:PropTypes.object.isRequired, 
	eventInfo: PropTypes.object,
	userInfo:PropTypes.object,
	selfAgent:PropTypes.object, 
	sessionId:PropTypes.string,
	simId: PropTypes.number,
	simTime: PropTypes.number,
	simTimePrecision: PropTypes.number,
	simulationData: PropTypes.object,
	agents: PropTypes.object, 
	communications: PropTypes.array,
	onClose: PropTypes.func,
	shareEvents: PropTypes.func
};

const EventSharing = ({classes, eventInfo, userInfo, selfAgent, agents, simTimePrecision, simulationData, sessionId, simId, simTime, shareEvents, communications, onClose}) => {
	const [selectedDevices, setSelectedDevices] = useState([]);
	const [selectedAgents, setSelectedAgents] = useState([]);
	const [agentsList, setAgentsList] = useState([]);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [currentRecipients, setCurrentRecipients] = useState(null);

	const isFacilitator = () =>{
		return userInfo.isFacilitator; 
	};

	useEffect(() => {
		const agents = getSortedAgents();
		const agentsList =[];
		agents.map(agnt => {
			//if(!agnt.entityData.properties.neutralized){
			agentsList.push(agnt);
			//}
		});
		setAgentsList(agentsList);
	}, [agents]);

	const isAgentsSelected =(team, agentsList) => {
		const teamList = agentsList.filter(agent => {
			const lastCommunicatedTime = getLastCommunicatedTime(agent.id);
			return (agent.entityData.properties.team === team && (lastCommunicatedTime === null) && (!agent.entityData.properties.neutralized));
		});
		const agentSelected = selectedAgents.filter(agent => {
			const agentDetails = agents[agent];
			return (agentDetails.entityData.properties.team === team);
		});
		if(teamList.length === agentSelected.length && selectedAgents.length > 0 && agentSelected.length >0){
			return true;
		}
		else {
			return false;
		}
	};

	const isTeamDisabled =(team, agentsList) => {
		const teamList = agentsList.filter(agent => {
			const lastCommunicatedTime = getLastCommunicatedTime(agent.id);
			return (agent.entityData.properties.team === team && (lastCommunicatedTime === null) && (agent.entityData.properties.neutralized));
		});
		const agentSelected = agentsList.filter(agent => {
			//const agentDetails = agents[agent];
			return (agent.entityData.properties.team === team);
		});
		if(teamList.length === agentSelected.length){
			return true;
		}
		else {
			return false;
		}
	};

	const selectAll =(event, agentsList)=>{
		let agentIds = _.cloneDeep(selectedAgents);
		const team = event.target.name;
		if (event.target.checked){
			agentsList.forEach(agent => {
				if(agent.entityData.properties.team === team){
					const lastCommunicatedTime = getLastCommunicatedTime(agent.id);
					if(lastCommunicatedTime === null && (!agent.entityData.properties.neutralized) && (!agentIds.includes(agent.id))){
						agentIds.push(agent.id);
					}
				}
			});

		}
		else {
			agentIds = agentIds.filter(agent => {
				const agentDetails = agents[agent];
				return (agentDetails.entityData.properties.team !== team);
			});
		}
		setSelectedAgents(agentIds);
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

	const viewRecipients = (event, recipients) => {
		setCurrentRecipients(recipients);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setCurrentRecipients(null);
		setAnchorEl(null);
	};
	
	const getSortedAgents = () => {
		let agentsTemp = _.cloneDeep(agents);

		const eventTeam = eventInfo.getTeam(simulationData); //red or blue
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

	const getLastCommunicatedTime = (id) =>{
		let time= null;
		communications.forEach(comm => {

			if (comm.tabletopSessionId === sessionId && comm.simId === simId){
				if (comm.type === "AVERT_EVENT" && comm.data.includes(eventInfo.event.id)){
					if (!isFacilitator() && comm.commDevices.includes(id)){
						time = utilities.truncate(comm.time, simTimePrecision);
					} else if (isFacilitator() && comm.to.includes(id)){
						time = utilities.truncate(comm.time, simTimePrecision);
					}
				}
			}
		});
		return time;
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

	const isCommDeviceSelected = (commId) =>{
		return selectedDevices && (selectedDevices.length>0) && selectedDevices.includes(commId) || false;
	};

	const isAgentSelected = (agentId) =>{
		return selectedAgents && (selectedAgents.length>0) && selectedAgents.includes(agentId) || false;
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
			type: "AVERT_EVENT",
			from: userInfo.userId,
			data: eventInfo.event.id,
			isDeleted: false,
			commDevices: selectedDevices
		};
		
		const toIds = [];
		if (isFacilitator()){
			selectedAgents.forEach(agnt => {
				if (!toIds.includes(agnt))	{
					toIds.push(agnt);
				}
			});
		} else{
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
		
		commObj.to = toIds;
		shareEvents(commObj);
	};
	
	const disabledNotify =() =>{
		let retDisabled = true;
		if (isFacilitator()){
			retDisabled = selectedAgents.length>0? false: true;
		}
		else {
			retDisabled = selectedDevices.length>0? false: true;
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

	return (
		<Container className={ classes.flexContainer} style={{width:700}}>
			<div className={ classes.flexContainerHorizontalStart}>
				<div style={{marginLeft:15, marginRight:10}}><AlertRhombus style={{color: "white"}} /></div>
				<div style={{marginLeft:10}}><EventTextContainer eventData={eventInfo.getData(agents, simulationData)}/></div>
			</div>
			
			<div className={ classes.flexContainer} style={{width:"100%", paddingTop:20, paddingLeft:10, marginTop:30}}>
				{
					!isFacilitator() && 
					<Typography variant="body1" className="b1-bright-gray" style={{marginLeft:10, color:"#b5b9be", display: "inline-block"}}><Translate value="tableopSession.widgets.events.eventSharing.chooseCommDevices"/></Typography>
				}
				{
					isFacilitator() && 
					<div>
						<Typography variant="body1" className="b1-bright-gray" style={{marginLeft:10, color:"#b5b9be", display: "inline-block"}}><Translate value="tableopSession.widgets.events.eventSharing.choosePlayers"/></Typography>
						<div style={{display: "inline-block", float: "right"}} className="selectAllTeam">
							<T2CheckBox className="selectTeamBox" disabled={isTeamDisabled("BLUE", agentsList)} checked={isAgentsSelected("BLUE", agentsList)} value="Blue Team" name ="BLUE" onChange={(e) => selectAll(e, agentsList)}/>
							<span><Translate value="tableopSession.widgets.events.blueTeam"/></span>
							<T2CheckBox className="selectTeamBox" disabled={isTeamDisabled("RED", agentsList)} checked={isAgentsSelected("RED", agentsList)} value="Red Team" name ="RED" onChange={(e) => selectAll(e, agentsList)}/>
							<span><Translate value="tableopSession.widgets.events.redTeam"/></span>
						</div>
					</div>
				}
				{
					isFacilitator() && <TableContainer className={classes.tableContainer}>
						<Table size="small" aria-label="event sharing table">
							<TableHead>
								<TableRow>
									<TableCell> </TableCell>
									<TableCell align="left" width="80" color="#b5b9be"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.widgets.events.eventSharing.team"/></div></TableCell>
									<TableCell align="left" color="#b5b9be"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.widgets.events.eventSharing.player"/></div></TableCell>
									<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.widgets.events.eventSharing.time"/></div></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{getSortedAgents().map(agnt => {
									const lastCommunicatedTime = getLastCommunicatedTime(agnt.id);
									return (<TableRow key={`tr ${agnt.id}`}>
										<TableCell padding="checkbox">
											<T2CheckBox disabled={lastCommunicatedTime != null || agnt.entityData.properties.neutralized} 
												checked={isAgentSelected(agnt.id)} name={`${agnt.id}`} onChange={(e) => playerChangeHandler(e, agnt.id)} />
										</TableCell>
										<TableCell align="left" width="80"><AgentIcon agent={agnt} group={false} /></TableCell>
										<TableCell align="left">{agnt.entityData.properties.displayName|| agnt.entityData.properties.name}</TableCell>
										<TableCell align="left">{(lastCommunicatedTime>0)?lastCommunicatedTime:""}</TableCell>
									</TableRow>);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				}
				{
					!isFacilitator() && <TableContainer className={classes.tableContainer}>
						<Table size="small" aria-label="comm sharing table">
							<TableHead>
								<TableRow>
									<TableCell> </TableCell>
									<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.widgets.events.eventSharing.comm"/>&nbsp;<Translate value="tableopSession.widgets.events.eventSharing.device"/></div></TableCell>
									<TableCell align="left"><div style={{color:"#b5b9be", width:150}}><Translate value="tableopSession.widgets.events.eventSharing.owner"/></div></TableCell>
									<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.widgets.events.eventSharing.recipients"/></div></TableCell>
									<TableCell align="left"><div style={{color:"#b5b9be"}}><Translate value="tableopSession.widgets.events.eventSharing.time"/></div></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{ownerCommDevices.map(comm => {
									const lastCommunicatedTime = getLastCommunicatedTime(comm.id);
									const ownerName = selfAgent && selfAgent.entityData.properties.displayName? selfAgent.entityData.properties.displayName: selfAgent.entityData.properties.name;
									return (<TableRow key={`tr ${comm.id}`}>
										<TableCell padding="checkbox">
											<T2CheckBox disabled={lastCommunicatedTime != null} 
												checked={isCommDeviceSelected(comm.id)} name={`${comm.id}`} onChange={(e) => commDeviceChangeHandler(e, comm.id)} />
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
														<ListItemText primary={<span style={{color:"#4DB5F4", marginLeft:-12}}><Translate value="tableopSession.widgets.events.eventSharing.viewRecipients"/></span>}/>
															
													</ListItem>
												</List>
											</div>
										}</TableCell>
										<TableCell align="left">{(lastCommunicatedTime>0)?lastCommunicatedTime:""}</TableCell>
									</TableRow>);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				}
				{anchorEl && currentRecipients &&
					<Menu
						id={"menu-recipients"}
						PaperProps={{
							style: {
								backgroundColor: "#5E6571"
							}
						}}
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						{
							getRecipients(currentRecipients).map((option) => {
								return (<MenuItem
									key={option}
									onClick={handleClose}
								>
									{option}
								</MenuItem>);
							})
						}
					</Menu>
				}
			</div>
			
			<Container className={classes.dialogActions}>
				<Button style={{ width: 156, marginLeft:10, marginRight:0}} onClick={onClose}><Translate value="tableopSession.widgets.events.eventSharing.cancel"/></Button>
				<Button variant="contained" color="primary" disabled={disabledNotify()} style={{ width: 156, marginLeft:0, marginRight:10 }} onClick={handleNotify}><Translate value="tableopSession.widgets.events.eventSharing.notify"/></Button>
			</Container>

		</Container>
	);
};

EventSharing.propTypes = propTypes;
export default withStyles(styles)(EventSharing);