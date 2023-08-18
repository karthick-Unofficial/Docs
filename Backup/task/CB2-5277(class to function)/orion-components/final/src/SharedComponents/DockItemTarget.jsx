import React from "react";

// Material UI
import Target from "material-ui/svg-icons/device/gps-not-fixed";

const DockItemTarget = ({ onMouseExit, onClick, onMouseEnter }) => {
	const mouseEnter = e => {
		const pos = e.target.getBoundingClientRect();
		onMouseEnter(pos.right - pos.width / 2 - 6, pos.top - 36);
	};

	const mouseLeave = e => {
		onMouseExit();
	};

	return (
		<a className="target" onClick={onClick} onMouseLeave={mouseLeave}>
			<Target onMouseEnter={mouseEnter} />
		</a>
	);
};

export default DockItemTarget;
