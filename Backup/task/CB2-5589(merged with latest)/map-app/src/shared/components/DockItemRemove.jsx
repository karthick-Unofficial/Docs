import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	onClick: PropTypes.func
};

const DockItemRemove = ({ onClick }) => {
	return (
		<div className="removeTarget" onClick={onClick}>
			<i className="material-icons">close</i>
		</div>
	);
};

DockItemRemove.propTypes = propTypes;

export default DockItemRemove;
