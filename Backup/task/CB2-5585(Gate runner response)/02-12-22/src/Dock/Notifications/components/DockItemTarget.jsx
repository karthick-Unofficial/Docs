import React from "react";

const DockItemTarget = ({
	onMouseEnter,
	onMouseExit,
	onClick
}) => {

	const mouseEnter = (e) => {
		// console.log(e.target.getBoundingClientRect());
		const pos = e.target.getBoundingClientRect();
		// console.log(pos.height);
		onMouseEnter(pos.right - (pos.width / 2) - 6, pos.top - 36);
	};

	const mouseLeave = (e) => {
		onMouseExit();
	};

	return (
		<a className="target-icon-wrapper" onClick={onClick}
			onMouseLeave={mouseLeave}
		>
			<i
				className="targeting-icon"
				onMouseEnter={mouseEnter}
			></i>
		</a>
	);
};

export default DockItemTarget;