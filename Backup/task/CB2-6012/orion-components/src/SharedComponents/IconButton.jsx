import React from "react";

const IconButton = ({ onClick, iconName }) => {
	return (
		<button
			onClick={onClick}
			style={{
				backgroundColor: "transparent",
				color: "white",
				border: "none"
			}}
		>
			<i className="material-icons">{iconName}</i>
		</button>
	);
};

export default IconButton;
