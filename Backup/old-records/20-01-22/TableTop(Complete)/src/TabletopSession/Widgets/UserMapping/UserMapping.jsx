import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff} from "mdi-material-ui";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Star, StarOutline } from "mdi-material-ui";
import { iconConfig } from "../../../shared/iconConfig";
import TargetingIconContainer from "../../Controls/TargetingIcon/TargetingIconContainer";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	userInfo: PropTypes.object,
	agents: PropTypes.object,
	teamsConfig: PropTypes.object,
	userMappings: PropTypes.array,
	users: PropTypes.object.isRequired,
	useLocalState: PropTypes.func.isRequired
};

const UserMapping = ({
	agents,
	userMappings, 
	userInfo, 
	users,
	teamsConfig,
	useLocalState
}) => {

	const initTeamSelection = () => {
		const teamSelection = {};
		_.keys(teamsConfig).forEach(team => teamSelection[team] = true);
		return teamSelection;
	};

	const [ teamSelected, setTeamSelected ] = useLocalState("teamSelected", initTeamSelection());
	const [userMappingList, setUserMappingList] = useState([]);

	useEffect(() => {
		let filteredArray = [];
		userMappings.forEach(function (item) {
			if(userInfo.isFacilitator) {
				if(teamSelected[item.userRole] === true){
					filteredArray.push(item);
				}
			}
			else {
				if(userInfo.userRole === item.userRole){
					filteredArray.push(item);
				}
			}
		});
		
		let sortedUserNames =[];
		
		filteredArray.map(user => {
			const usersId = users[user.userId];
			sortedUserNames.push({userId: user.userId, name: usersId.name, selfAgentIds: user.selfAgentIds, controlledAgentIds: user.controlledAgentIds, userRole: user.userRole});
		});

		sortedUserNames = _.sortBy(sortedUserNames, (e) => {
			return e.name;
		});

		if(userInfo.isFacilitator){
			sortedUserNames = _.sortBy(sortedUserNames, (e) => {
				return e.userRole;
			});
		}

		setUserMappingList(sortedUserNames);

	}, [ teamSelected, userMappings ]);

	if(!agents || !userMappings || !users){
		return null;
	}

	const handleTeamclick = (e) =>{
		const teamValue = e.currentTarget.value;
		const newValue = {...teamSelected, [teamValue]: !teamSelected[teamValue]};
		setTeamSelected(newValue);
	};

	const getSelfAgents = (userMapped) => {
		const selfAgentsIds = userMapped.selfAgentIds;
		if(selfAgentsIds){
			const agentsdetails = selfAgentsIds.map(function(agentId){
				return (
					<div key={agents[agentId].id} className="userMappingChips">
						<TargetingIconContainer entities={[agents[agentId]]} />
						<span className="b2-white">{agents[agentId].entityData.properties.name}</span>
					</div>
				);
			});
			return agentsdetails;
		}
	};

	const getControlledAgents = (userMapped) => {
		const controlAgentsIds = userMapped.controlledAgentIds;
		if(controlAgentsIds){
			const agentsdetails = controlAgentsIds.map(function(agentId){
				return (
					<div key={agents[agentId].id} className="userMappingChips">
						<TargetingIconContainer entities={[agents[agentId]]} />
						<span className="b2-white">{agents[agentId].entityData.properties.name}</span>
					</div>
				);
			});
			return agentsdetails;
		}	
	};

	/*const getUserName = (userMapped) => {
		const userMappingId = userMapped.userId;
		const usersId = users[userMappingId];
		return usersId.name;
	};*/

	const getUserImagePath = (userMapped) => {	
		const userId = userMapped.userId;
		const mappedUserId = userMappings.find(item => item.userId === userId);
		const iconPath = iconConfig[`player_${mappedUserId.userRole}`];
		return iconPath;
	};

	return (
		<div>
			{userInfo.isFacilitator &&
				<div className="userMappingMainContainer" style={{justifyContent:"flex-start"}}>
					{_.keys(teamsConfig).map(team => {
						return (
							<ToggleButton key={`${team}-size`} value={team} aria-label={team} onClick={handleTeamclick}
								style={{ marginRight:20, color: teamSelected[team] ? "white": "#3C4656", border:"none" }}>
								{teamSelected[team] && <Eye style={{width: 22, height: 20}} className="b2-white"/>}
								{!teamSelected[team] && <EyeOff style={{width: 22, height: 20}} className="b2-white"/>}
								<div style={{marginLeft: 20, textTransform: "none"}}>{`${team.charAt(0).toUpperCase()}${team.substring(1).toLowerCase()} `}<Translate value="tableopSession.widgets.userMapping.team"/></div>
							</ToggleButton>
						);
					})}
				</div>
			}
			{userMappingList.map(userMapped => {
				return ( 
					<div className={"userMappingsList"} key={userMapped.userId} id={userMapped.userId} style={{display:"block"}}>
						<p className="userName"><img className="playerIcon" src={getUserImagePath(userMapped)} /><span className="b1-white">{userMapped.name}</span></p>
						{userMapped.selfAgentIds && userMapped.selfAgentIds.length > 0 &&
							<div className="usersList">
								<p className="b2-white"><Star style={{color: "white", verticalAlign: "middle", marginRight: 10}} /><span><Translate value="tableopSession.widgets.userMapping.playersPrimaryRole"/></span></p>
								<div className="selfAgentsBox">{getSelfAgents(userMapped)}</div>
							</div>
						}
						{userMapped.controlledAgentIds && userMapped.controlledAgentIds.length > 0 &&
							<div className="usersList">
								<p className="b2-white"><StarOutline style={{color: "white", verticalAlign: "middle", marginRight: 10}} /><span><Translate value="tableopSession.widgets.userMapping.playerCan"/></span></p>
								<div className="controlAgentsBox">{getControlledAgents(userMapped)}</div>
							</div>
						}
					</div>
				);
			})}
			{userMappingList.length === 0 &&
				<div className="b1-white" style={{textAlign: "center", marginTop: 30}}><Translate value="tableopSession.widgets.userMapping.noMappings"/></div>
			}
		</div>
	);
};

UserMapping.propTypes = propTypes;
export default UserMapping;