import React from "react";
import PropTypes from "prop-types";
import { iconConfig } from "../iconConfig";

const propTypes = {
	facilitator: PropTypes.bool,
	team: PropTypes.string
};

const TeamIcon = ( { facilitator, team } ) => {
	const iconPath = facilitator ? iconConfig["player_facilitator"] : iconConfig[`player_${team}`];
	return (
		<img src={iconPath} style={{ width:35, height: 35 }} />
	);
};

TeamIcon.propTypes = propTypes;
export default TeamIcon;