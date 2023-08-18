import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Star, StarOutline } from "mdi-material-ui";
import TargetingIconContainer from "../../Controls/TargetingIcon/TargetingIconContainer";
import AgentIcon from "../../MapBase/LayerSources/MapLayer/AgentIcon";
import { Translate } from "orion-components/i18n/I18nContainer";

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
	targetIconContainer:{
		background: "transparent",
		order:1,
		flexBasis: "10%" 
	},
	agentIconContainer:{
		background: "transparent",
		order:2,
		flexBasis: "15%"
	},
	starIconContainer:{
		background: "transparent",
		order:3,
		flexBasis: "10%",
		marginLeft: 10
		

	},
	contentContainer:{
		order:4,
		flexBasis: "60%",
		flexWrap: "wrap",
		background: "transparent",
		paddingLeft: 5,
		paddingRight: 5
	},
	starIconContainerRTL:{
		background: "transparent",
		order:3,
		flexBasis: "10%",
		marginRight: 10
		

	}
};

const propTypes = {
	agent: PropTypes.object.isRequired,
	isSelfAgent: PropTypes.bool.isRequired,
	isControlAgent: PropTypes.bool.isRequired,
	itemsSpacing: PropTypes.number,
	classes: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const AgentEntry = ({ agent, isSelfAgent, isControlAgent, itemsSpacing, classes, dir }) => {
	const getAgentStatus =(agentProperty) => {
		if (agentProperty) {
			if (!agentProperty.enabled) {
				return <Translate value="tableopSession.shared.disabled"/>;
			}
			return agentProperty.neutralized? <Translate value="tableopSession.shared.neutralized"/>: (agentProperty.detected? <Translate value="tableopSession.shared.detected"/>: <Translate value="tableopSession.shared.undetected"/>); 
		} else {
			return <Translate value="tableopSession.shared.unknown"/>;
		}
	};

	return (
		<div className={classes.flexContainer}>
			<div className={classes.targetIconContainer} style={{minWidth:45, visibility:"visible", 
				marginLeft: `${itemsSpacing ? itemsSpacing : "0"}px`}}> 
				{agent.entityData.geometry && <TargetingIconContainer entities={[agent]} />}
			</div>
			<div className={classes.agentIconContainer} style={dir == "rtl" ? {marginRight: `${itemsSpacing ? itemsSpacing : "0"}px`} : {marginLeft: `${itemsSpacing ? itemsSpacing : "0"}px`}}> 
				<AgentIcon agent={agent} group={false} />
			</div>
			<div className={dir == "rtl" ? classes.starIconContainerRTL : classes.starIconContainer} style={{minWidth:45, visibility:"visible", 
				marginLeft: `${itemsSpacing ? itemsSpacing : "0"}px`}}>
				{
					isSelfAgent && <Star style={{color: "white"}} />
				}
				{
					isControlAgent && <StarOutline style={{color: "white"}} />
				}
			</div>
			
			<div className={classes.contentContainer}>
				<div className="b1-white">{agent.entityData.properties.name}</div>
				<div className="b1-bright-gray">{getAgentStatus(agent.entityData.properties)}</div>
			</div>
		</div>
	);
};

AgentEntry.propTypes = propTypes;
export default withStyles(styles)(AgentEntry);

