import React from "react";
import PropTypes from "prop-types";

import $ from "jquery";
import size from "lodash/size";
import filter from "lodash/filter";

const propTypes = {
	children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	xOffset: PropTypes.number,
	emptyMessage: PropTypes.string,
	padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	dir: PropTypes.string
};

const defaultProps = {
	children: [],
	xOffset: 0,
	emptyMessage: "",
	padding: null
};

// TODO: Investigate using Material UI transform utilities to smooth transition
// TODO: Update to handle Portals
const Canvas = ({ children, xOffset, emptyMessage, padding, dir }) => {
	const isMobile = $(window).width() <= 1023;

	const childCount = size(filter(children, (child) => Boolean(child)));
	const styles = {
		height: isMobile ? "calc(100% - 48px)" : "100%",
		width: `calc(100% - ${isMobile ? 0 : xOffset}px)`,
		marginLeft: dir && dir == "rtl" ? {} : isMobile ? 0 : xOffset,
		marginRight: dir && dir == "rtl" ? (isMobile ? 0 : xOffset) : {},
		padding:
			typeof padding === "number" || typeof padding === "string" ? padding : isMobile ? "24px 6px" : "24px 36px",
		overflowY: "scroll",
		empty: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			color: "#828283"
		}
	};

	return (
		<div id="canvas" style={childCount > 0 ? styles : { ...styles, ...styles.empty }}>
			{childCount ? children : emptyMessage}
		</div>
	);
};

Canvas.propTypes = propTypes;
Canvas.defaultProps = defaultProps;

export default Canvas;
