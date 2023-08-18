import _ from "lodash";
import React, {useState} from "react";
import { Grid, Button, Container} from "@material-ui/core";
//import {Cancel} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import T2SelectControl from "../../shared/components/T2SelectControl";
import T2MultiSelectControl from "./T2MultiSelectControl";
import T2Chips from "../../shared/components/T2Chips";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer: {
	  paddingTop: 10,
	  paddingLeft: 10,
	  display: "flex",
	  flexDirection: "column",
	  justifyContent: "space-between",
	  background: "transparent"
	},
	dialogActions: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 50,
		paddingBottom: 20,
		paddingRight: 10,
		background: "#414449"
	},
	flexContainerRTL: {
		paddingTop: 10,
		paddingLeft: 10,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		background: "transparent"
	  },
	  dialogActionsRTL: {
		  display: "flex",
		  justifyContent: "flex-end",
		  paddingTop: 50,
		  paddingBottom: 20,
		  paddingRight: 10,
		  background: "#414449"
	  }
};

const propTypes = {
	role: PropTypes.string.isRequired,
	editMode: PropTypes.bool.isRequired,
	editInfo: PropTypes.object,
	classes: PropTypes.object.isRequired,
	users: PropTypes.object.isRequired,
	primaryAgents: PropTypes.object.isRequired, //note: its a dic<int, object>
	secondaryAgents: PropTypes.object.isRequired, //note: its a dic<int, object>
	agentGroups: PropTypes.object.isRequired, // Agent groups for controlling
	saveTeamPlayers: PropTypes.func.isRequired, //Save team information to db
	onClose: PropTypes.func.isRequired,
	dir: PropTypes.string 

};

function PlayersSelection(props) {
	const { classes, role, editMode, editInfo, users, primaryAgents, secondaryAgents, agentGroups, saveTeamPlayers, onClose, dir } = props;
	//const teamColor = (role == "Blue")? "BLUE": "RED";
	
	//Note: {role: role, playerId: "", selfAgents: [], controlledAgents: []}
	const initialPlayer =(isSaveAndAddPlayer)=>{
		return !isSaveAndAddPlayer?(editMode? editInfo.playerId: ""): "";
	};

	const initialSelectedSelfAgents =(isSaveAndAddPlayer)=>{
		return !isSaveAndAddPlayer?(editMode? editInfo.selfAgents: []): [];
	};
	
	const initialControlledAgents =(isSaveAndAddPlayer)=>{
		return !isSaveAndAddPlayer?(editMode? editInfo.controlledAgents: []): []; 
	};

	const getItemsForSelfAgent = (selectedSelfAgnts)=> {
		const itemsArray =[];
		//itemsArray.push({id: 0, name: "Select"});
		const selectedKeys =[];
		selectedSelfAgnts.forEach(agnt => {
			selectedKeys.push(agnt.id);
		});

		//dic<int, object>
		Object.keys(primaryAgents).forEach(key => {
			if (!selectedKeys.includes(key)){
				itemsArray.push({id: key, name: primaryAgents[key].entityData.properties.name});
			}
		});
		return _.sortBy(itemsArray, (e) => {
			return e.name;
		});
	};

	const getItemsForControlledAgent = (selectedControlledAgnts)=> {
		
		const selectedKeys =[];
		selectedControlledAgnts.forEach(agnt => {
			selectedKeys.push(agnt.id);
		});
		
		const grpNamesTemporary = [];

		let itemsArray = _.map(secondaryAgents, (secAgnt) => {
			const grpIdTmp = secAgnt.entityData.properties.groupId;
			if (grpIdTmp){
				const grp = agentGroups[grpIdTmp];
				if (grp.agentIds.includes(secAgnt.id)){
					if ((grpNamesTemporary.length < 1) || (!grpNamesTemporary.includes(grp.name))){
						if (!selectedKeys.includes(grp.name)){
							grpNamesTemporary.push(grp.name);
							return { id: grp.name, name: grp.name};
						}
						return null;
					} else{
						return null;
					}
				} else{
					return null;
				}
			} else if (!selectedKeys.includes(secAgnt.id)){
				return { id:secAgnt.id, name: secAgnt.entityData.properties.name};
			} else{
				return null;
			}
		});

		//To remove null items from array becuase null is introduced to ahve unique group name in array. 
		itemsArray = _.filter(itemsArray, (itm)=>{
			return itm ? true: false;
		});

		return _.sortBy(itemsArray, (e) => {
			return e.name;
		});

	};

	//const [controlAgentsGrp, setControlAgentsGrp] = useState([]);
	//const [controlAgentsIndviduals, setControlAgentsIndviduals] = useState([]);
	const [selectedPlayer, setSelectedPlayer] = useState(initialPlayer());
	const [selectedSelfAgents, setSelectedSelfAgents] = useState(initialSelectedSelfAgents());
	const [selectedControlledAgents, setSelectedControlledAgents] = useState(initialControlledAgents()); //working fine no change in code

	const [selfAgents, setSelfAgents] = useState(getItemsForSelfAgent(selectedSelfAgents));
	const [controlledAgents, setControlledAgents] = useState(getItemsForControlledAgent(selectedControlledAgents));
	//const [selectedControlledAgentBelongToGroup, setSelectedControlledAgentBelongToGroup] = useState(null);

	const handleSave = (addAnotherPlayer)=>{
		const selectedSelfAgentsTempList = _.cloneDeep(selectedSelfAgents);
		const selectedSelfAgnts = selectedSelfAgents && selectedSelfAgents.map( agnt => {
			return parseInt( agnt.id);
		}) ||[];
		
		let selectedContAgnts = [];
		selectedControlledAgents && selectedControlledAgents.forEach(selectedAgnt => {
			
			//If group tehn add all agents belong to group
			if (selectedAgnt.id === selectedAgnt.name){
				const agentGrp = _.find(agentGroups, (grp) => {
					return (grp.name === selectedAgnt.name);
				});
				if (agentGrp){
					selectedContAgnts = _.union(selectedContAgnts, agentGrp.agentIds);
				}
			} else {
				selectedContAgnts.push(parseInt(selectedAgnt.id));
			}
		});

		try {

			saveTeamPlayers({role: role, editMode: editMode, playerId:selectedPlayer, selfAgents: selectedSelfAgnts, controlledAgents: selectedContAgnts}, addAnotherPlayer);
			if (addAnotherPlayer){ // clear previous state of all controls 
				setSelectedPlayer(initialPlayer(true));
				const selectedSelfAgentsTmp = initialSelectedSelfAgents(true);
				const controlledAgntsTmp = initialControlledAgents(true);
				setSelectedSelfAgents(selectedSelfAgentsTmp);
				setSelectedControlledAgents(controlledAgntsTmp);
				setSelfAgents(getItemsForSelfAgent(selectedSelfAgentsTempList));
				setControlledAgents(getItemsForControlledAgent(controlledAgntsTmp));
				//setSelectedControlledAgentBelongToGroup(null);
			}

		} catch (error) {
			console.log("error occurred while saving Team Players. err :" + error);
		}
	};

	const handlePlayerChange = (id) => {
		setSelectedPlayer(id);
	};	

	const disabledSave = () => {
		return (!selectedPlayer)? true: false;
	};

	const handleSelfAgentChange = (agentIds) => {
		//maintain in state
		let arr = selectedSelfAgents || [];
		agentIds.forEach(agentId =>{
			arr.push({id: agentId, name: primaryAgents[agentId].entityData.properties.name});
		});
		arr = _.sortBy(arr, (e) => {
			return e.name;
		});

		setSelectedSelfAgents(arr);
		setSelfAgents(getItemsForSelfAgent(arr));
	};	

	const handleSelfAgentDelete = (agents)=> {
		//updateSelfAgent(role, playerId, agentIds); //these are remaining Agents
		//these Agents are still selected
		const arr = selectedSelfAgents || [];
		setSelectedSelfAgents(agents||arr);
		setSelfAgents(getItemsForSelfAgent(agents||arr));
	};

	const handleControlledAgentChange = (agentIds) => {
		let arr = selectedControlledAgents || [];
		agentIds.forEach(agentId =>{
			const agentGrp = _.find(agentGroups, (grp) => {
				return (grp.name === agentId);
			});
			arr.push((agentGrp)? { id: agentGrp.name, name: agentGrp.name} : {id: agentId, name: secondaryAgents[agentId].entityData.properties.name});
		});

		arr = _.sortBy(arr, (e) => {
			return e.name;
		});

		setSelectedControlledAgents(arr);
		setControlledAgents(getItemsForControlledAgent(arr));
	};

	
	const handleControlledAgentDelete = (agents)=> {
		//these Agents are still selected
		const arr = selectedControlledAgents || [];
		setSelectedControlledAgents(agents||arr);
		setControlledAgents(getItemsForControlledAgent(agents||arr));
	};

	const getPlayers = ()=> {
		const itemsArray =[];
		//itemsArray.push({id: 0, name: "Select"});
		
		for (const key in users) { //dic<int, string>
			itemsArray.push({id: key, name: users[key].name});
		}

		return _.sortBy(itemsArray, (e) => {
			return e.name;
		});

	};

	const playerNames =[];
	return (
		<Container className={dir == "rtl" ? classes.flexContainerRTL : classes.flexContainer}>
			<Grid container spacing={4}>
				<Grid item xs={6}>
					<T2SelectControl
						human
						role = {role.toUpperCase()}
						labelText={<Translate value="tableopsessionList.playerSelection.Player" />}
						width="363px"
						items={getPlayers()}
						selectedValue={selectedPlayer}
						handleChange= {handlePlayerChange}
						dir={dir}
					/>
				</Grid>
				<Grid item xs={6}>
				</Grid>
				<Grid item xs={6}>
					<div className={dir == "rtl" ? classes.flexContainerRTL : classes.flexContainer}>
						<T2MultiSelectControl
							star
							labelText={<Translate value="tableopsessionList.playerSelection.primary" />}
							width="363px"
							items={selfAgents}
							selectedValue={playerNames}
							id="primary"
							handleChange= {handleSelfAgentChange}
						/>
						<div style={dir == "rtl" ? { paddingRight: 30, marginTop: 10, width:420 } : { paddingLeft: 30, marginTop: 10, width:420 }}>
							<T2Chips items={selectedSelfAgents} onDelete={(remainedAgent) => handleSelfAgentDelete(remainedAgent)} dir={dir}/>
						</div>
					</div>
				</Grid>
				<Grid item xs={6}>
					<div className={dir == "rtl" ? classes.flexContainerRTL : classes.flexContainer}>
						<T2MultiSelectControl
							starOutline
							labelText={<Translate value="tableopsessionList.playerSelection.sendOrder" />}
							width="363px"
							items={controlledAgents}
							selectedValue={playerNames} align="right"
							id="secondary"
							handleChange= {handleControlledAgentChange}
						/>
						<div style={dir == "rtl" ? { paddingRight: 20, marginTop: 10, width:420, alignSelf:"flex-end" } : { paddingLeft: 20, marginTop: 10, width:420, alignSelf:"flex-end" }}>
							<T2Chips items={selectedControlledAgents} onDelete={(remainedAgent) => handleControlledAgentDelete(remainedAgent)} dir={dir}/>
						</div>
						{/*{
							selectedControlledAgentBelongToGroup && 
							<div className={classes.flexContainer} 
								style={{flexDirection: "row", justifyContent: "center", marginTop: 10, width:420, alignSelf:"flex-end"}}>
								<Typography variant="body1" className="b2-white" 
									style={{margin:10, width: "100%", textAlign:"left", wordWrap:"break-word"}}>{groupPlayerSelectedMessageForControlledAgents()}</Typography>
								<div style={{width:25, margin:10, alignSelf:"center"}}>
									<Cancel style={{textAlign: "center", width:20, height:20, cursor:"pointer"}} onClick={handleClose}/>
								</div>
							</div>
						}*/}
					</div>
				</Grid>  
			</Grid>

			<Container className={dir == "rtl" ? classes.dialogActionsRTL : classes.dialogActions}>
				<Button style={dir == "rtl" ? { width: 156, marginLeft:0, marginRight:10} : { width: 156, marginLeft:10, marginRight:0}} onClick={onClose}><Translate value="tableopsessionList.playerSelection.cancel" /></Button>
				<Button variant="contained" color="primary" disabled={disabledSave()} style={dir == "rtl" ? { width: 156, marginLeft:10, marginRight:0 } : { width: 156, marginLeft:0, marginRight:10 }} onClick={()=>handleSave(false)}><Translate value="tableopsessionList.playerSelection.save" /></Button>
				<Button variant="contained" color="primary" disabled={disabledSave()} style={dir == "rtl" ? { width: 214, marginLeft:0, marginRight:10 } : { width: 214, marginLeft:10, marginRight:0 }} onClick={()=>handleSave(true)}><Translate value="tableopsessionList.playerSelection.save_add" /></Button>
			</Container>
		</Container>
	);
}

PlayersSelection.propTypes = propTypes;
export default withStyles(styles)(PlayersSelection);