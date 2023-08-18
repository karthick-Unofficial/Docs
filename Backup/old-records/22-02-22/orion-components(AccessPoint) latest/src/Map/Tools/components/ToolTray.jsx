import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	dockOpen: PropTypes.bool
};
const defaultProps = {
	children: [],
	dockOpen: false
};

const ToolTray = ({ children, dockOpen, WavCamOpen, dir }) => {
	const styles = {
		tray: {
			position: "absolute",
			bottom: WavCamOpen ?  "15.55rem" : "2.55rem",
			right: ".5rem",
			display: "flex",
			justifyContent: "flex-end",
			//transition: "transform 200ms linear", //Leaving out for now because it's choppy
			transform: `translateX(-${dockOpen ? 420 : 0}px)`
		},
		child: {
			marginLeft: 8,
			display: "flex",
			alignItems: "center"
		},
		trayRTL: {
			position: "absolute",
			bottom: WavCamOpen ?  "15.55rem" : "2.55rem",
			left: ".5rem",
			display: "flex",
			justifyContent: "flex-end",
			//transition: "transform 200ms linear", //Leaving out for now because it's choppy
			transform: `translateX(-${dockOpen ? 420 : 0}px)`
		},
		childRTL: {
			marginRight: 8,
			display: "flex",
			alignItems: "center"
		}
	};
	return (
		<div style={dir == "rtl" ? styles.trayRTL : styles.tray}>
			{Array.isArray(children) ? (
				children
					.filter(child => !!child)
					.map((child, index) => {
						return (
							<div key={index} style={dir == "rtl" ? styles.childRTL : styles.child}>
								{child}
							</div>
						);
					})
			) : (
				<div style={dir == "rtl" ? styles.childRTL : styles.child}>{children}</div>
			)}
		</div>
	);
};

ToolTray.propTypes = propTypes;
ToolTray.defaultProps = defaultProps;

export default ToolTray;
