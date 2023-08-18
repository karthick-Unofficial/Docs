import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@material-ui/core";
import { Error, ErrorOutline } from "@material-ui/icons";

const propTypes = {
	fontSize: PropTypes.oneOf(["inherit", "default", "small", "large"]),
	dir: PropTypes.string
};

const defaultProps = {
	fontSize: "default",
	customStyles: {},
	dir: "ltr"
};

const Alert = ({ fontSize, customStyles, dir }) => {
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
				<Error style={{ color: "#E85858", ...(customStyles.errorStyle ? customStyles.errorStyle : {})}} />
			</SvgIcon>
			<SvgIcon
				fontSize={fontSize}
				style={dir == "rtl" ? {...styles.iconRTL, position: "absolute"} : { ...styles.icon, position: "absolute" }}
			>
				<ErrorOutline style={{ color: "#FFF", ...(customStyles.outerStyle ? customStyles.outerStyle : {}) }} />
			</SvgIcon>
		</div>
	);
};

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

export default Alert;
