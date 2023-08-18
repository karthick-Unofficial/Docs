import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	onClick: PropTypes.func,
	isDock: PropTypes.bool
};

const DockItemAdd = ({ onClick, isDock }) => {
	return (
		<div className="removeTarget" onClick={onClick}>
			{isDock ? (
				<i className="material-icons">check</i>
			) : (
				<div className="add-wrapper">
					<i className="material-icons">add_box</i>
				</div>
			)}
		</div>
	);
};

DockItemAdd.propTypes = propTypes;

export default DockItemAdd;
