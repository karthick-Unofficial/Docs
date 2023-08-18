import React from "react";

const DockItemLabel = ({ onClick, primary, secondary }) => {
	return (
		<div className="text" onClick={onClick}>
			<div className="cb-font-b2 primaryName">{primary}</div>
			<div className="itemType">{secondary}</div>
		</div>
	);
};

export default DockItemLabel;
