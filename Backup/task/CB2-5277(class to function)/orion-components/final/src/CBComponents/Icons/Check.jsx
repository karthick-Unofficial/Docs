import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@material-ui/core";
import { CheckCircle, CheckCircleOutline } from "@material-ui/icons";

const propTypes = {
	fontSize: PropTypes.oneOf(["inherit", "default", "small", "large"]),
	dir: PropTypes.string
};

const defaultProps = {
	fontSize: "default",
	dir: "ltr"
};

const Check = ({ fontSize, dir }) => {
	const styles = {
		icon: {
			marginRight: 0
		},
		layered: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		},
		iconRTL: {
			marginLeft: 0
		}
	};
	return (
		<div style={styles.layered}>
			<SvgIcon fontSize={fontSize} style={dir == "rtl" ? styles.iconRTL : styles.icon}>
				<CheckCircle style={{ color: "#00af3b" }} />
			</SvgIcon>
			<SvgIcon
				fontSize={fontSize}
				style={dir == "rtl" ? {...styles.iconRTL, position: "absolute"} : { ...styles.icon, position: "absolute" }}
			>
				<CheckCircleOutline style={{ color: "#FFF" }} />
			</SvgIcon>
		</div>
	);
};

Check.propTypes = propTypes;
Check.defaultProps = defaultProps;

export default Check;
