import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	dockOpen: PropTypes.bool,
	WavCamOpen: PropTypes.bool,
	dir: PropTypes.string
};
const defaultProps = {
	children: [],
	dockOpen: false
};

const ToolTray = ({ children, dockOpen, WavCamOpen, dir }) => {
	const styles = {
		tray: {
			position: "absolute",
			bottom: WavCamOpen ? "15.55rem" : "2.55rem",
			...(dir === "ltr" && { right: ".5rem" }),
			...(dir === "rtl" && { left: ".5rem" }),
			display: "flex",
			justifyContent: "flex-end",
			//transition: "transform 200ms linear", //Leaving out for now because it's choppy
			transform: `translateX(-${dockOpen ? 420 : 0}px)`
		},
		child: {
			...(dir === "ltr" && { marginLeft: 8 }),
			...(dir === "rtl" && { marginRight: 8 }),
			display: "flex",
			alignItems: "center"
		}
	};
	return (
		<div style={styles.tray}>
			{Array.isArray(children) ? (
				children
					.filter((child) => !!child)
					.map((child, index) => {
						return (
							<div key={index} style={styles.child}>
								{child}
							</div>
						);
					})
			) : (
				<div style={styles.child}>{children}</div>
			)}
		</div>
	);
};

ToolTray.propTypes = propTypes;
ToolTray.defaultProps = defaultProps;

export default ToolTray;
