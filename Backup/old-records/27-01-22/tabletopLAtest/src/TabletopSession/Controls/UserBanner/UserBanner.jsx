import _ from "lodash";
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Popper, ClickAwayListener } from "@material-ui/core";
import { ChevronDown, ChevronUp } from "mdi-material-ui";
import { makeStyles } from "@material-ui/core/styles";
import { iconConfig } from "../../../shared/iconConfig";
import TargetingIconContainer from "../TargetingIcon/TargetingIconContainer";
import AgentEntry from "../../shared/components/AgentEntry";

const propTypes = {
	userInfo: PropTypes.object,
	userProfile: PropTypes.object,
	agents: PropTypes.object,
	userMappings: PropTypes.array,
	teamsConfig: PropTypes.object,
	dir: PropTypes.string
};

const popperStyles = makeStyles({
	paper: {
		background: "#292b30"
	}
});

const UserBanner = ( { userInfo, userProfile, agents, userMappings, teamsConfig, dir } ) => {
	const [ selfAgents, setSelfAgents ] = useState(null);
	const [ controlledAgents, setControlledAgents ] = useState(null);

	const [ displayAgents, setDisplayAgents ] = useState(false);

	useEffect(() => {
		if (!userInfo.isFacilitator && agents) {
			const userMapping = userMappings.find(userMapping => userMapping.userId === userProfile.id);
			if (userMapping.selfAgentIds && userMapping.selfAgentIds.length > 0) {
				let newSelfAgents = [];
				userMapping.selfAgentIds.forEach(selfAgentId => {
					const selfAgent = agents[selfAgentId];
					if (selfAgent) {
						newSelfAgents.push(selfAgent);
					}
				});
				newSelfAgents = _.orderBy(newSelfAgents, "entityData.properties.name", "asc");
				setSelfAgents(newSelfAgents);
			}
			if (userMapping.controlledAgentIds && userMapping.controlledAgentIds.length > 0) {
				let newControlledAgents = [];
				userMapping.controlledAgentIds.forEach(controlledAgentId => {
					const controlledAgent = agents[controlledAgentId];
					if (controlledAgent) {
						newControlledAgents.push(controlledAgent);
					}
				});
				newControlledAgents = _.orderBy(newControlledAgents, "entityData.properties.name", "asc");
				setControlledAgents(newControlledAgents);
			}
		}
	}, [ agents, userInfo, userMappings ]);

	const containerDivEl = useRef(null);
	const popperClasses = popperStyles();

	if (!userInfo || !userProfile || (!userInfo.isFacilitator && !agents)) {
		return null;
	}

	const background = userInfo.isFacilitator ? "#54ac5c" : teamsConfig[userInfo.userRole].secondaryColor;
	const iconPath = userInfo.isFacilitator ? iconConfig["player_facilitator"]
		: iconConfig[`player_${userInfo.userRole}`];
	let popperWidth = 300;
	if (displayAgents && containerDivEl && containerDivEl.current) {
		const containerRect = containerDivEl.current.getBoundingClientRect();
		popperWidth = containerRect.width;
	}

	return (
		<div ref={containerDivEl} className={dir == "rtl" ? "userBannerRTL" : "userBanner"} style={{ background }}>
			{(selfAgents || controlledAgents) && 
				<TargetingIconContainer entities={[...(selfAgents || []), ...(controlledAgents || [])]} />
			}
			<img className="playerIcon" src={iconPath} />
			<div className="b1-white playerName">{userProfile.name}</div>
			{(selfAgents || controlledAgents) && !displayAgents &&
				<ChevronDown className="displayAgentsIcon" onClick={() => setDisplayAgents(true)} />
			}
			{(selfAgents || controlledAgents) && displayAgents &&
				<ChevronUp className="displayAgentsIcon" onClick={() => setDisplayAgents(false)} />
			}
			{displayAgents && 
				<Popper 
					open={true}
					disablePortal
					anchorEl={containerDivEl.current}
					classes={{paper: popperClasses.paper}}
					style={{zIndex: 99}}
					modifiers={{
						flip: {
						  enabled: false
						},
						offset: {
						  enabled: true,
						  offset: "0,-15"
						}
					}}
				>
					<ClickAwayListener onClickAway={() => setDisplayAgents(false)}>
						<div className="userBannerPopper" style={{width: `${popperWidth}px`, zIndex: 100}}>
							{selfAgents && selfAgents.map(selfAgent => {
								return <AgentEntry key={selfAgent.id} agent={selfAgent} isSelfAgent={true} isControlAgent={false} itemsSpacing={21} dir={dir}/>;
							})}
							{controlledAgents && controlledAgents.map(controlledAgent => {
								return <AgentEntry key={controlledAgent.id} agent={controlledAgent} isSelfAgent={false} isControlAgent={true} itemsSpacing={21} dir={dir}/>;
							})}
						</div>
					</ClickAwayListener>
				</Popper>
			}
		</div>
	);
};

UserBanner.propTypes = propTypes;
export default UserBanner;