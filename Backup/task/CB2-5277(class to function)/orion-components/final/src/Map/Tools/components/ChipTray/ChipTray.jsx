import React from "react";

const ChipTray = ({ children, buttonCount, offset, dockState, dir }) => {
	const styles = {
		wrapper: {
			left: 360 + offset,
			right: 64 * buttonCount,
			position: "absolute",
			bottom: "2.55rem",
			width: "auto",
			marginRight: 8,
			alignItems: "center",
			//transition: "transform 200ms linear", //Leaving out for now because it's choppy
			transform: `translateX(-${dockState.isOpen ? 420 : 0}px)`
		},
		row: {
			display: "flex",
			flexDirection: "row-reverse",
			overflowX: "scroll",
			marginTop: 8
		}
	};

	return (
		<div style={styles.wrapper}>
			{Array.isArray(children) ? (
				children.map((child, index) => (
					<div key={index} style={styles.row}>
						{child}
					</div>
				))
			) : (
				<div style={styles.row}>{children}</div>
			)}
		</div>
	);
};

export default ChipTray;
