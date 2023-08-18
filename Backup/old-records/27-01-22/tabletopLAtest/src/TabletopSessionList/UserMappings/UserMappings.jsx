import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import { Divider, Container, Button} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExerciseContainer from "../../shared/components/ExerciseContainer";
import HeaderContainer from "../../shared/components/HeaderContainer";
import { Translate } from "orion-components/i18n/I18nContainer";
import T2SelectControl from "../../shared/components/T2SelectControl";
import ExerciseTeam from "./ExerciseTeam";
import T2IconLabel from "../../shared/components/T2IconLabel";
import T2IconButton from "../../shared/components/T2IconButton";
import ConfirmationDialog from "../../shared/components/ConfirmationDialog";
//import rawData from "./rawData";

const useStyles = makeStyles({
	flexBackContainer:{
		display: "flex",
		justifyContent: "flex-start",
		alignItems:"center",
		background: "transparent",
		minHeight: 41,
		paddingLeft: 20,
		paddingRight: 10,
		marginLeft:"18%"
	},

	flexContentContainer:{
		paddingTop: 20,
		paddingBottom: 20,
		display: "flex",
		flexDirection: "column",
		justifyContent: "stretch"
	},	

	buttonContainer:{
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 20,
		paddingBottom: 20,
		paddingRight: 20,
		background: "transparent"
	},

	selectContainer: {
		paddingTop: 20,
		paddingBottom: 20,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		background: "transparent"
	},
	flexBackContainerRTL:{
		display: "flex",
		justifyContent: "flex-start",
		alignItems:"center",
		background: "transparent",
		minHeight: 41,
		paddingLeft: 10,
		paddingRight: 20,
		marginLeft:"18%"
	},
	buttonContainerRTL:{
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		background: "transparent"
	}
});

const propTypes = {
	sessionToLoad: PropTypes.object,
	users: PropTypes.object.isRequired,
	displayUserMappings: PropTypes.func.isRequired,
	setUserMappings: PropTypes.func.isRequired,
	setController: PropTypes.func.isRequired,
	startSession: PropTypes.func.isRequired,
	clearSessionToLoad: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const UserMappings = ( { sessionToLoad, displayUserMappings, users, setUserMappings, setController, startSession, clearSessionToLoad, dir } ) => {
	
	const classes = useStyles();
	//const [usersMapped] = useState(sessionToLoad && sessionToLoad.session && sessionToLoad.session.userMappings || []);
	//const [controller, setController] = useState();
	//const [baseSimId] = useState(sessionToLoad && sessionToLoad.baseSimId);
	const [confirmMessage, setConfirmMessage] = useState(null);

	const getController = () => {
		return sessionToLoad && sessionToLoad.session && sessionToLoad.session.controller|| "";
	};

	const getUserMapping = () => {
		return sessionToLoad && sessionToLoad.session && sessionToLoad.session.userMappings || [];
	};

	const controller = getController();
	const usersMapped = getUserMapping();

	const getAllAgentsForTeam = (role) =>{
		//dic<int, object>
		const teamAgents = {};
		const agentsTemp = Object.assign({}, sessionToLoad.simulationData.agents); //Clone();

		Object.keys(agentsTemp).forEach(key => {
			const agent = agentsTemp[key];
			if (agent.entityData.properties.team == role){
				teamAgents[agent.id] = agent;
			}
		});

		return teamAgents;
	};

	const [blueTeamAllAgents] = useState(getAllAgentsForTeam("BLUE"));
	const [redTeamAllAgents] = useState(getAllAgentsForTeam("RED"));

	const getAllAgentsGroup = () =>{
		const agentGrps ={};
		const agentGroupsTemp = Object.assign({}, sessionToLoad.simulationData.agentGroups); //Clone();

		Object.keys(agentGroupsTemp).forEach(key => {
			const agentGrp = agentGroupsTemp[key];
			agentGrps[agentGrp.id] = {
				name: agentGrp.entityData.properties.name, 
				agentIds: agentGrp.entityData.properties.agentIds
			};
		});

		return agentGrps;
	};

	const [agentGroups] = useState(getAllAgentsGroup());

	
	// We don't display UserMappings control till we have enough data
	if (!sessionToLoad || !sessionToLoad.newSession || !sessionToLoad.session || !sessionToLoad.simulationData) {
		return <h4>Simulation information not available</h4>;
	}

	const handleControllerChange = (c) => {
		const currSessId = (sessionToLoad.sessionId || sessionToLoad.session.id);
		try {
			setController(currSessId, c);
		} catch (error) {
			console.log(`error occurred saving controller '${c}' in sessions '${currSessId}'. err : ` + error);
		}
	};	

	const getControllers = ()=> {
		
		const itemsArray =[];
		//itemsArray.push({id: 0, name: "Select"}); // no need
		
		//Add current session Controller
		itemsArray.push({id: controller, name: users[controller].name});
		
		//Add Blue and Red Players (Mapped Users) in controller 
		usersMapped && usersMapped.map(user => {
			return {id: user.userId, name: users[user.userId].name};
		}).forEach(item => {
			const ele = itemsArray.find( c =>{
				return (c.id === item.id);
			});

			if (!ele){
				itemsArray.push(item);
			}
		});

		return itemsArray;
	};

	const getAlreadyMappedTeamPlayers = (role)=>{
		const retArr = usersMapped && usersMapped.filter( u =>{
			return (u.userRole === role);
		}) || [];

		return retArr;
	};

	const getNewUsersForAddition = ()=>{
		//get users not part of Blue or Red Team or facilitator.
		//todo : how to determine facilitator)

		//users is not an array but an object with key value pair
		const newUsers = Object.assign({}, users); //Clone();
		delete newUsers[controller]; //remove controller as well

		const existingPlayers =[];
		usersMapped && usersMapped.forEach( u =>{
			existingPlayers.push(u.userId);
		});

		Object.keys(newUsers).forEach(key => {
			if (existingPlayers.includes(key)){ 
				delete newUsers[key]; //then remove user from collection
			}
		});

		return newUsers;
	};

	const deletePlayer =(role, playerId)=>{
		const userMappedArray = usersMapped || [];

		const newUserMappedArray = userMappedArray.filter((u) => {
			return (u.userId !== playerId);
		});

		setUserMappings((sessionToLoad.sessionId || sessionToLoad.session.id), newUserMappedArray );
	};

	const updateSelfAgent =(role, playerId, agentIds)=>{
		let userMappedArray = usersMapped || [];
		
		if (userMappedArray.length<1){
			const newUserMapInfo = {userId: playerId, userRole: role.toUpperCase(), selfAgentIds: agentIds, controlledAgentIds: [] };
			userMappedArray.push(newUserMapInfo);
		}
		else {
			userMappedArray = userMappedArray.map((um)=>{
				if (um.userId == playerId){
					um.selfAgentIds = agentIds;
				}
				return um;
			});
		}
		setUserMappings((sessionToLoad.sessionId || sessionToLoad.session.id), userMappedArray );
	};

	const updateControlledAgent =(role, playerId, agentIds)=>{
		let userMappedArray = usersMapped || [];
		
		if (userMappedArray.length<1){
			const newUserMapInfo = {userId: playerId, userRole: role.toUpperCase(), selfAgentIds: [], controlledAgentIds: agentIds };
			userMappedArray.push(newUserMapInfo);
		}
		else {
			userMappedArray = userMappedArray.map((um)=>{
				if (um.userId == playerId){
					um.controlledAgentIds = agentIds;
				}
				return um;
			});
		}
		setUserMappings((sessionToLoad.sessionId || sessionToLoad.session.id), userMappedArray );

	};

	const saveTeamPlayers= (dataToSave) =>{
		//dataToSave = {role: role, editMode: editMode, playerId:selectedPlayer, selfAgents: selectedSelfAgents, controlledAgents: selectedControlledAgents}
		
		let userMappedArray = usersMapped || [];

		if (dataToSave.editMode){
			userMappedArray = userMappedArray.map((um)=>{
				if (um.userId == dataToSave.playerId){
					um.controlledAgentIds = dataToSave.controlledAgents;
					um.selfAgentIds = dataToSave.selfAgents;
				}
				return um;
			});
		} else{
			const newUserMapInfo = {userId: dataToSave.playerId, userRole: dataToSave.role.toUpperCase(), 
				selfAgentIds: dataToSave.selfAgents, controlledAgentIds: dataToSave.controlledAgents };
			userMappedArray.push(newUserMapInfo);
		}
		
		setUserMappings((sessionToLoad.sessionId || sessionToLoad.session.id), userMappedArray );
	};

	const backTriggered = () => {
		setConfirmMessage(<Translate value="tableopsessionList.userMappings.confirmText.backText" />);
	};

	const cancelTriggered = () => {
		setConfirmMessage(<Translate value="tableopsessionList.userMappings.confirmText.cancelText" />);
	};

	const cancelUserMappings = () => {
		displayUserMappings(false);
		clearSessionToLoad();
	};

	return (
		<div style={{width:"100%"}}>
			<div className={dir == "rtl" ? classes.flexBackContainerRTL : classes.flexBackContainer}>
				<T2IconButton back  labelText="back" openPlayerSelection={backTriggered} dir={dir}/>
				
			</div>
			<Divider style={{marginTop:0, marginLeft:0, marginRight:0, width:"100%"}}/>
			<Container className={ classes.flexContentContainer} fullwidth="true">
				<HeaderContainer
					headerTitle={<Translate value="tableopsessionList.userMappings.title" />}
					headerDescription={<Translate value="tableopsessionList.userMappings.desc" />}dir={dir}>
				</HeaderContainer>
				<ExerciseContainer style={{background: "#414449"}}
					headerTitle=""
					headerDescription=""
					dir={dir}>
					<Container className={dir == "rtl" ? classes.buttonContainerRTL :  classes.buttonContainer}>
						<Button style={dir == "rtl" ? { width: 156, marginLeft:10, marginRight:0 } : { width: 156, marginLeft:0, marginRight:10 }} onClick={cancelTriggered}><Translate value="tableopsessionList.userMappings.cancel" /></Button>
						<Button variant="contained" color="primary" style={{ width: 253, marginLeft:10, marginRight:10 }} onClick={() => startSession(sessionToLoad.sessionId)}> <Translate value="tableopsessionList.userMappings.start" /></Button>
					</Container>
					<Container className={classes.selectContainer} style={{ minWidth: 800 }}>
						{/* <T2SelectControl
						cubeOutline
						labelText="Choose Base Simulation"
						width="433px"
						items={baseSims()}
						selectedValue= {baseSimId}
					/> */}
						<T2IconLabel cubeOutline  labelText={sessionToLoad.session.baseSimName} dir={dir}/>
						<T2SelectControl
							human
							//role="green"
							isFacilitator ={true}
							labelText={<Translate value="tableopsessionList.userMappings.Controller" />}
							width="239px"
							items={getControllers()}
							selectedValue= {controller}
							handleChange= {handleControllerChange}
							dir={dir}
						/>
					</Container>
			
					<Divider style={{marginTop:20}}/>
				
					{
						<ExerciseTeam role="Blue" style={{marginTop:20}} 
							players={getAlreadyMappedTeamPlayers("BLUE")} 
							allUsers={users} 
							allAgents={blueTeamAllAgents} 
							agentGroups={agentGroups}
							getNewPlayersforAddition= {getNewUsersForAddition}
							deletePlayer={deletePlayer} 
							updateSelfAgent={updateSelfAgent} updateControlledAgent={updateControlledAgent}
							saveTeamPlayers= {saveTeamPlayers}
						/>
					}

					<Divider style={{marginTop:20}}/>
				
					{ <ExerciseTeam role="Red" style={{marginTop:20}} 
						players={getAlreadyMappedTeamPlayers("RED")}
						allUsers={users} 
						allAgents={redTeamAllAgents}
						agentGroups={agentGroups}
						getNewPlayersforAddition= {getNewUsersForAddition}
						deletePlayer={deletePlayer} 
						updateSelfAgent={updateSelfAgent} updateControlledAgent={updateControlledAgent}
						saveTeamPlayers= {saveTeamPlayers}
					/> }
				</ExerciseContainer>
			</Container>
			{confirmMessage &&
				<ConfirmationDialog
					open={true}
					title=""
					content={confirmMessage}
					onClose={() => setConfirmMessage(null)}
					loading={false}
					onConfirm={cancelUserMappings}
					dir={dir}
				/>
			}
		</div>
		
	);
};

UserMappings.propTypes = propTypes;
export default memo(UserMappings);