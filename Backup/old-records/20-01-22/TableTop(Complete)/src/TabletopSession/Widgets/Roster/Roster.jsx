import _ from "lodash";
import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { withStyles } from "@material-ui/core/styles";
import { AccountVoice, FileAccount, Eye, EyeOff } from "mdi-material-ui";
import { getEquipmentDetail, canShareEquipment } from "../../../shared/utility/equipmentUtility";
import { ExpandMore } from "@material-ui/icons";
import T2DialogBox from "../../../shared/components/T2DialogBox";
import AgentEntry from "../../shared/components/AgentEntry";
import EquipmentSharingContainer from "./EquipmentSharingContainer";
import { Translate } from "orion-components/i18n/I18nContainer";
import { getDir } from "orion-components/i18n/Config/selector";

const styles = {
	flexContainer:{
		display: "flex",
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		paddingLeft: 5,
		paddingRight: 5,
		width:"100%"
	},
	leftText: {
		flex: "0 0 120px",
		alignItems: "center",
		marginRight: 12,
		paddingTop: 4,
		paddingLeft: 12,
		fontSize: 12,
		color: "#b5b9be",
		"& span" :{
			fontSize: 12,
			color: "#b5b9be"
		}
		  
	},
	rightText: {
		alignItems: "center",
		marginRight: 12,
		paddingTop: 4,
		paddingLeft: 12,
		fontSize: 12,
		color: "#b5b9be",
		"& span" :{
			fontSize: 12,
			color: "#b5b9be"
		}
	},

	listItem: {
		paddingLeft: 0
	},

	accordionSummary_content:{
		margin:0,
		"& div" :{
			margin:0
		}
	},

	rootAccordion: {
		"&:before": {
			display: "none"
		}
	},

	roundedAccordion: {
		borderRadius: 5
	}

};

const propTypes = {
	classes: PropTypes.object.isRequired,
	equipmentConfig: PropTypes.array,
	agents: PropTypes.object,
	userMappings:PropTypes.array,
	userInfo: PropTypes.object,
	sessionId:PropTypes.string,
	simId: PropTypes.number,
	orgId: PropTypes.string,
	userHasCommDevices: PropTypes.bool,
	simulationMode: PropTypes.string,
	locationHistory: PropTypes.object,
	externalMessage: PropTypes.object,
	clearComponentMessage: PropTypes.func.isRequired,
	createCommunication: PropTypes.func.isRequired,
	fetchLocationHistory: PropTypes.func.isRequired,
	clearLocationHistory: PropTypes.func.isRequired,
	displayGuardOrders: PropTypes.func.isRequired,
	useLocalState: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const Roster = ({ 
	classes,
	agents, 
	equipmentConfig, 
	userMappings, 
	userInfo, 
	sessionId, 
	simId, 
	orgId,
	userHasCommDevices, 
	simulationMode, 
	locationHistory, 
	externalMessage, 
	clearComponentMessage, 
	createCommunication,
	fetchLocationHistory,
	clearLocationHistory,
	displayGuardOrders,
	useLocalState,
	dir
}) => {
	const [ expanded, setExpanded ] = useLocalState("expanded", 0);
	const [teamSelected, setTeamSelected] = useLocalState("teamSelected", { blueTeam: true, redTeam: true});
	const [openSharing, setOpenSharing] = useState(false);
	const [agentToShare, setAgentToShare] = useState(null);

	useEffect(() => {
		if (externalMessage && externalMessage.agentId) {
			setExpanded(externalMessage.agentId);
			clearComponentMessage(); // Clear the message now that we have handled it
			// Scroll to the accordion
			const accordion = document.querySelector(`#accord-${externalMessage.agentId}`);
			if (accordion) {
				accordion.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}
		}
	}, [ externalMessage ]);

	const getEquipmentData = (equipment) => {
		return equipment.map((eq, index) => {
			const equipmentDetail = getEquipmentDetail(eq, equipmentConfig);
			if (equipmentDetail && equipmentDetail.display) {
				return (
					<Fragment key={`equip-${index}`}>
						<ListItem style={{paddingLeft: 0, marginTop: 5, marginBottom: 5}} key={`equipListItem-${index}`}>
							<ListItemIcon>
								<img style={{width: 22}} src={equipmentDetail.icon} className="b1-white"></img>
							</ListItemIcon>
							<ListItemText
								style={styles.leftText}
								primary={<p style={{color: "#b5b9be", fontSize: 12, marginLeft: -30}}>{equipmentDetail.category}</p>}
							/>
							<ListItemText
								style={styles.rightText}
								primary={<p style={{color: "#b5b9be", fontSize: 12, marginLeft: -30}}>{eq.name}</p>}
							/>
						</ListItem>
						{index !== equipment.length - 1 ?
							<Divider style={{ position: "absolute", left:0, right:0 }}/> : null
						}
					</Fragment>
				);
			}
		});
	};

	const isSelfAgent =(agentId) =>{
		if (userInfo.isFacilitator){
			return false;
		}

		const usermapInfo = userMappings && _.find(userMappings, (u)=> {
			return (u.userId === userInfo.userId);
		});

		return (usermapInfo && usermapInfo.selfAgentIds.includes(agentId))? true: false;
	};

	const isControlAgent =(agentId) =>{
		if (userInfo.isFacilitator){
			return false;
		}

		const usermapInfo = userMappings && _.find(userMappings, (u)=> {
			return (u.userId === userInfo.userId);
		});

		return (usermapInfo && usermapInfo.controlledAgentIds.includes(agentId))? true: false;
	};

	const handleTeamclick = (e) =>{
		if (e.currentTarget.value === "blue"){
			const newValue = {...teamSelected, blueTeam: !teamSelected.blueTeam};
			setTeamSelected(newValue);
		}

		if (e.currentTarget.value === "red"){
			const newValue = {...teamSelected, redTeam: !teamSelected.redTeam};
			setTeamSelected(newValue);
		}
	};

	const getRosterList = () =>{
		
		if (!teamSelected.blueTeam && !teamSelected.redTeam){
			return [];
		}

		const getRosters = (agnts, role) => {
			const filteredAgents = _.values(agnts).filter( agent =>{
				return agent.entityData.properties.team.toUpperCase() === role;
			});

			return _.orderBy(filteredAgents, 
				["entityData.properties.enabled", "entityData.properties.name"], ["desc", "asc"]);
		};

		let dataTemp =[];
		const agentsTemp = Object.assign({}, agents); //Clone();

		if (teamSelected.blueTeam && teamSelected.redTeam){
			dataTemp = getRosters(agentsTemp, "BLUE"); //first blue agents
			dataTemp = dataTemp.concat(getRosters(agentsTemp, "RED")); //then red agents
		} 
		else {
			const role= teamSelected.blueTeam? "BLUE": "RED";
			return getRosters(agentsTemp, role);
		}

		return dataTemp;
	};

	const handleOpenSharing = (agnt) => {
		setAgentToShare(agnt);
		setOpenSharing(true);
	};

	const handleShareEvent = (shareInfo) =>{
		shareInfo.simId = simId;
		try {
			createCommunication(sessionId, shareInfo);	
		} catch (error) {
			console.log("error occurred submitting equipment communication.");			
		}

		handleClose();
	};

	const handleClose = () => {
		setAgentToShare(null);
		setOpenSharing(false);
	};

	let _currSelfAgent = null;
	const getSelfAgent = () =>{
		
		if (_currSelfAgent){
			return _currSelfAgent;
		}
		
		if (userInfo.isFacilitator){
			return null;
			//console.log("uncomment isFacilitator");
		}

		const usermapInfo = userMappings && _.find(userMappings, (u)=> {
			return (u.userId === userInfo.userId);
		});

		const selfAgentId = (usermapInfo && usermapInfo.selfAgentIds[0]) || 0;

		if (selfAgentId === 0){
			return null;
		}
		else {
			_currSelfAgent = agents && agents.hasOwnProperty(selfAgentId)? agents[selfAgentId]: null;
		}

		return _currSelfAgent;
	};

	const getTrackHistoryIcon = (agent) => {
		if (!agent.entityData.geometry) {
			return null;
		}
		if (locationHistory && locationHistory.hasOwnProperty(agent.id)) {
			return (
				<div className="b2-white" style={{display: "flex", cursor: "pointer"}} onClick={() => clearLocationHistory(agent.id)}>
					<Eye style={{width: 22, height: 20, marginTop:5}} />
					<div style={{margin: 10}}><Translate value="tableopSession.widgets.roster.main.trackHist"/></div>
				</div>
			);
		} else {
			return (
				<div className="b2-bright-gray" style={{display: "flex", cursor: "pointer"}} onClick={() => fetchLocationHistory(sessionId, simId, agent.id)}>
					<EyeOff style={{width: 22, height: 20, marginTop:5}} />
					<div style={{margin: 10}}><Translate value="tableopSession.widgets.roster.main.trackHist"/></div>
				</div>
			);
		}
	};

	const canSeeLocationHistory = userInfo.isFacilitator || simulationMode === "playback";

	return (
		<div>
			<div className={classes.flexContainer} style={{justifyContent:"flex-start"}}>
				<ToggleButton value="blue" aria-label="blue" onClick={handleTeamclick} 
					style={{ marginRight:20, color: teamSelected.blueTeam? "white": "#3C4656", border:"none" }}>
					{teamSelected.blueTeam && <Eye style={{width: 22, height: 20}} className="b2-white"/>}
					{!teamSelected.blueTeam && <EyeOff style={{width: 22, height: 20}} className="b2-white"/>}
					<div style={{marginLeft: 20, textTransform: "none"}}><Translate value="tableopSession.widgets.roster.main.blueTeam"/></div>
				</ToggleButton>
				<ToggleButton value="red" aria-label="blue" onClick={handleTeamclick}
					style={{ marginLeft:20, color: teamSelected.redTeam? "white": "#3C4656", border:"none"}}>
					{teamSelected.redTeam && <Eye style={{width: 22, height: 20}} className="b2-white"/>}
					{!teamSelected.redTeam && <EyeOff style={{width: 22, height: 20}} className="b2-white"/>}
					<div style={{marginLeft: 20, textTransform: "none"}}><Translate value="tableopSession.widgets.roster.main.redTeam"/></div>
				</ToggleButton>
			</div>
			{getRosterList().map(agent => {
				return (
					<Accordion id={`accord-${agent.id}`}
						style={{backgroundColor:"#3C4656", marginTop:10, marginBottom:10}}
						key={`accord-${agent.id}`} 
						expanded={expanded === agent.id}
						onChange={(e, isExpanded) => setExpanded(isExpanded ? agent.id : 0)}
						classes={{root: classes.rootAccordion, rounded: classes.roundedAccordion}}
					>
						<AccordionSummary expandIcon={<ExpandMore style={{color: "#fff"}} />} className={classes.accordionSummary_content}>
							<AgentEntry agent={agent} isSelfAgent={isSelfAgent(agent.id)} isControlAgent={isControlAgent(agent.id)} dir={dir}/>
						</AccordionSummary>
						<AccordionDetails>
							<div className={classes.flexContainer} style={{flexWrap: "wrap"}}>
								<div className={classes.flexContainer} style={{display:"flex"}}>
									{canShareEquipment(agent, equipmentConfig, userInfo, userHasCommDevices) && 
										<div key={`voice-${agent.id}`} style={{display: "flex", cursor: "pointer"}} onClick={()=>handleOpenSharing(agent)}>
											<AccountVoice style={{width: 22, height: 20, marginTop:5}} className="b2-white"/>
											<div style={{margin: 10}} className="b2-white"><Translate value="tableopSession.widgets.roster.main.shareEquip"/></div>
										</div>
									}
									{agent.entityData.properties.team === "BLUE" &&
										(userInfo.isFacilitator || userInfo.userRole === agent.entityData.properties.team) &&	
										<div style={{display: "flex", cursor: "pointer"}} onClick={()=>displayGuardOrders(orgId, agent.entityData.properties.name)}>
											<FileAccount style={{width: 22, height: 20, marginTop:5}} className="b2-white"/>
											<div style={{margin: 10}} className="b2-white"><Translate value="tableopSession.widgets.roster.main.vieworders"/></div>
										</div>
									}
									{canSeeLocationHistory && agent.entityData.properties.enabled && getTrackHistoryIcon(agent)}
								</div>
								{
									agent.entityData.properties.equipment && agent.entityData.properties.equipment.length > 0 &&
								<List style={{marginTop:0, marginLeft:10, marginBottom:10, marginRight:0, width:"100%"}}>
									{
										getEquipmentData(agent.entityData.properties.equipment) 
									}
								</List>
								}
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
			{
				agentToShare && <T2DialogBox
					open= {openSharing}
					onClose={handleClose}
					headline={<Translate value="tableopSession.widgets.roster.main.shareToTeam"/>}
					submitlabel={"Notify"}
					handleSubmit={handleShareEvent}
					content={
						<EquipmentSharingContainer selfAgent={getSelfAgent()} agentInfo={agentToShare} onClose={handleClose} shareEvents={handleShareEvent}/>
					}
				/>
			}
		</div>
	);
};

Roster.propTypes = propTypes;
export default withStyles(styles)(Roster);