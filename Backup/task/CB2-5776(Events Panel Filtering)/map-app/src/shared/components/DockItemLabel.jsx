import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	onClick: PropTypes.func,
	primary: PropTypes.string,
	secondary: PropTypes.string
};

const DockItemLabel = ({ onClick, primary, secondary }) => {
	return (
		<div className="text" onClick={onClick}>
			<div className="cb-font-b2 primaryName">{primary}</div>
			<div className="itemType">{secondary}</div>
		</div>
	);
};

DockItemLabel.propTypes = propTypes;

export default DockItemLabel;
