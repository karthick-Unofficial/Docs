import React from "react";

const DockItemRemove = ({ onClick }) => {
	return (
		<div className="removeTarget" onClick={onClick}>
			<i className="material-icons">close</i>
		</div>
	);
};

export default DockItemRemove;
