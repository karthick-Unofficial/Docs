import _ from "lodash";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import T2IconButton from "../../shared/components/T2IconButton";
import T2IconLabel from "../../shared/components/T2IconLabel";
import T2Chips from "../../shared/components/T2Chips";
import PlayersSelection from "./PlayersSelection";
import T2DialogBox from "../../shared/components/T2DialogBox";
import ConfirmationDialog from "../../shared/components/ConfirmationDialog";

const useStyles = makeStyles({
	flexContainer: {
		display: "flex",
		flexDirection: "column",
		marginTop: 20,
		paddingTop: 10

	},
	flexContainerHorizontal: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		paddingLeft: 0
	},
	flexContainerHorizontalRTL: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		paddingRight: 0
	}
});


const propTypes = {
	role: PropTypes.string.isRequired, //BLUE or RED
	players: PropTypes.array.isRequired, //mapped Users based on role
	allUsers: PropTypes.object.isRequired, //all users
	allAgents: PropTypes.object.isRequired, // all Agents for given role, its an object having key value pair as collection.
	agentGroups: PropTypes.object.isRequired,
	getNewPlayersforAddition: PropTypes.func.isRequired, //to fetch not mapped user to be added as a Player. 
	deletePlayer: PropTypes.func.isRequired,
	updateSelfAgent: PropTypes.func.isRequired, //Instead of delete better to update
	updateControlledAgent: PropTypes.func.isRequired, //Instead of delete better to update
	saveTeamPlayers: PropTypes.func.isRequired, // to save data to db
	dir: PropTypes.string
};

const ExerciseTeam = ({ role, players, allUsers, allAgents,
	agentGroups, getNewPlayersforAddition, deletePlayer,
	updateSelfAgent, updateControlledAgent, saveTeamPlayers, dir }) => {

	const [openOnDelete, setOpenOnDelete] = React.useState(false);
	const [playerIdForDeletion, setPlayerIdForDeletion] = React.useState(0);
	const [open, setOpen] = React.useState(false);
	const [editMode, setEditmode] = React.useState(false); //default is Add Mode
	const [editPlayer, setEditPlayer] = React.useState({ role: role, playerId: "", selfAgents: [], controlledAgents: [] });
	const [userName, setUserName] = useState([]);

	//const [agents, setOpen] = React.useState(false); i think we should filter role agents and then send

	const classes = useStyles();

	//todo: Team name will no more be hardcoded
	const labelText = `${(role.toLowerCase() == "blue") ? "Blue" : "Red"} Team`;

	const handleClose = () => {
		setOpen(false);
		setEditmode(false);
		setOpenOnDelete(false);
		setPlayerIdForDeletion(0);
		setEditPlayer({ role: role, playerId: "", selfAgents: [], controlledAgents: [] });
	};

	const openPlayerSelection = (val) => {
		setOpen(val);//true to popup T2DialogBox
	};

	useEffect(() => {
		if (players && allUsers) {
			let sortedUserNames = [];
			players.map(user => {
				sortedUserNames.push({ userId: user.userId, name: allUsers[user.userId].name, selfAgentIds: user.selfAgentIds, controlledAgentIds: user.controlledAgentIds, userRole: user.userRole });
			});

			sortedUserNames = _.sortBy(sortedUserNames, (e) => {
				return e.name;
			});

			setUserName(sortedUserNames);
		}

	}, [players]);

	const handlePlayerEdit = (playerId, selfAgents, controlledAgents) => {
		setEditPlayer({ role: role, playerId: playerId, selfAgents: selfAgents, controlledAgents: controlledAgents });
		setEditmode(true);
	};

	const getEditPlayer = () => {
		const userTemp = {};
		userTemp[editPlayer.playerId] = allUsers[editPlayer.playerId];
		return userTemp;
	};

	const getAgentsToSelfMapping = () => {
		//delete existing self agents from agent list
		const agentsTemp = Object.assign({}, allAgents); //Clone();
		players && players.map(user => {
			user.selfAgentIds.forEach(ag => {
				delete agentsTemp[ag];
			});
		});
		return agentsTemp;
	};

	const getAgentsToControl = () => {
		const agentsTemp = Object.assign({}, allAgents); //Clone();
		return agentsTemp;
	};

	const handlePlayerDelete = (playerId) => {
		setPlayerIdForDeletion(playerId);
		setOpenOnDelete(true);
		//deletePlayer(role, playerId);
	};

	const deletePlayerConfirmed = () => {
		deletePlayer(role, playerIdForDeletion);
		setOpenOnDelete(false);
	};


	const handleSelfAgentDelete = (playerId, agents) => {
		const selectedAgnts = agents && agents.map(agnt => {
			return parseInt(agnt.id);
		}) || [];

		updateSelfAgent(role, playerId, selectedAgnts); //these agents are still selected.
	};

	const handleControlledAgentDelete = (playerId, agents) => {
		// const selectedAgnts = agents && agents.map( agnt => {
		// 	return parseInt( agnt.id);
		// }) ||[];

		let selectedContAgnts = [];
		agents && agents.forEach(selectedAgnt => {

			//If group tehn add all agents belong to group
			if (selectedAgnt.id === selectedAgnt.name) {
				const agentGrp = _.find(agentGroups, (grp) => {
					return (grp.name === selectedAgnt.name);
				});
				if (agentGrp) {
					selectedContAgnts = _.union(selectedContAgnts, agentGrp.agentIds);
				}
			} else {
				selectedContAgnts.push(parseInt(selectedAgnt.id));
			}
		});


		updateControlledAgent(role, playerId, selectedContAgnts);//these agents are still selected.
	};

	const handleTeamSubmit = (dataToSave, addAnother) => {
		console.log("handleTeamSubmit: form submitted" + dataToSave);
		saveTeamPlayers(dataToSave);
		setEditmode(false);
		setOpen(addAnother ? true : false);
	};

	const getControlledAgents = (controlledAgentIds) => {

		const grpNamesTemporary = [];
		let itemsArray = controlledAgentIds.map(agntId => {
			const agentTmp = allAgents[agntId]; //.entityData.properties.name

			if (agentTmp) {
				const grpIdTmp = agentTmp.entityData.properties.groupId;
				if (grpIdTmp) {
					const grp = agentGroups[grpIdTmp];
					if (grp.agentIds.includes(agntId)) {
						if ((grpNamesTemporary.length < 1) || (!grpNamesTemporary.includes(grp.name))) {
							grpNamesTemporary.push(grp.name);
							return { id: grp.name, name: grp.name };
						} else {
							return null;
						}
					} else {
						return null;
					}
				} else {
					return { id: agntId, name: agentTmp.entityData.properties.name };
				}
			}
		});

		//To remove null items from array becuase null is introduced to ahve unique group name in array. 
		itemsArray = _.filter(itemsArray, (itm) => {
			return itm ? true : false;
		});

		return _.sortBy(itemsArray, (e) => {
			return e.name;
		});
	};

	return (
		<Container className={classes.flexContainer}>
			<Container className={dir == "rtl" ? classes.flexContainerHorizontalRTL : classes.flexContainerHorizontal}>
				<T2IconButton human role={role.toUpperCase()} labelText={labelText} openPlayerSelection={openPlayerSelection} style={dir == "rtl" ? { paddingRight: 0 } : { paddingLeft: 0 }} dir={dir}/>
				<T2IconButton plusCircle labelText="add player" openPlayerSelection={openPlayerSelection} dir={dir}/>
			</Container>
			{
				players && (players.length > 0) && <TableContainer>
					<Table size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell align="left"><Translate value="tableopsessionList.usermapping_Excercise.Player" />
								</TableCell>
								<TableCell align="left"><T2IconLabel star labelText={<Translate value="tableopsessionList.usermapping_Excercise.primaryroles"/>} dir={dir}/></TableCell>
								<TableCell align="left" style={{ width: "45%" }}><T2IconLabel starOutline labelText={<Translate value="tableopsessionList.usermapping_Excercise.tasking" />} dir={dir}/></TableCell>
								<TableCell align="left"></TableCell>
								<TableCell align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>

							{
								//Add Players i.e. Mapped Users 
								userName && userName.length > 0 && userName.map(user => {
									let selfAgentArray = user.selfAgentIds.map(u => {
										return { id: u, name: allAgents[u] && allAgents[u].entityData.properties.name || "Not Found" };
									});

									selfAgentArray = _.sortBy(selfAgentArray, (e) => {
										return e.name;
									});
									const controlledAgentArray = getControlledAgents(user.controlledAgentIds);

									return <TableRow key={user.name}>
										<TableCell align="left" style={{ width: "18%", padding: 0 }}>{user.name}</TableCell>
										<TableCell align="left" style={{ width: "39%", padding: 0 }}><T2Chips items={selfAgentArray} onDelete={(remainedAgents) => handleSelfAgentDelete(user.userId, remainedAgents)} dir={dir}/></TableCell>
										<TableCell align="left" style={{ width: "39%", padding: 0 }}><T2Chips items={controlledAgentArray} onDelete={(remainedAgents) => handleControlledAgentDelete(user.userId, remainedAgents)} dir={dir}/></TableCell>
										<TableCell style={{ minWidth: "2%" }}>
											<IconButton edge="end" aria-label="edit" onClick={() => handlePlayerEdit(user.userId, selfAgentArray, controlledAgentArray)}>
												<EditIcon />
											</IconButton>
										</TableCell>
										<TableCell style={{ minWidth: "2%" }}>
											<IconButton edge="end" aria-label="delete" onClick={() => handlePlayerDelete(user.userId)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>;
								})
							}
						</TableBody>
					</Table>
				</TableContainer>
			}
			<T2DialogBox
				open={open || editMode}
				onClose={handleClose}
				headline={editMode ? <Translate value="tableopsessionList.userMappings.editplayers" count={role}/> : <Translate value="tableopsessionList.userMappings.addPlayers" count={role}/>}
				submitlabel={<Translate value="tableopsessionList.userMappings.save" />}
				handleSubmit={handleTeamSubmit}
				content={
					<PlayersSelection role={role} editMode={editMode}
						users={editMode ? getEditPlayer() : getNewPlayersforAddition()}
						editInfo={editMode ? editPlayer : null}
						primaryAgents={getAgentsToSelfMapping()}
						secondaryAgents={getAgentsToControl()}
						agentGroups={agentGroups}
						saveTeamPlayers={handleTeamSubmit}
						onClose={handleClose}
					/>
				}
				dir={dir}
			/>

			<ConfirmationDialog
				open={openOnDelete}
				title=""
				content={<Translate value="tableopsessionList.usermapping_Excercise.content" />}
				onClose={handleClose}
				loading={false}
				onConfirm={deletePlayerConfirmed}
				dir={dir}
			/>

		</Container>
	);
};

ExerciseTeam.propTypes = propTypes;
export default ExerciseTeam;