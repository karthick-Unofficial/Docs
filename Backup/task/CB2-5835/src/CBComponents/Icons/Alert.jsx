import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@mui/material";
import { Error, ErrorOutline } from "@mui/icons-material";

const propTypes = {
	fontSize: PropTypes.oneOf(["inherit", "default", "small", "large"]),
	customStyles: PropTypes.object,
	dir: PropTypes.string,
	iconStyles: PropTypes.object,
	iconColor: PropTypes.string,
	iconHeight: PropTypes.string,
	iconWidth: PropTypes.string
};

const defaultProps = {
	fontSize: "default",
	customStyles: {},
	dir: "ltr",
	iconStyles: {},
	iconColor: "#E85858",
	iconWidth: "20px",
	iconHeight: "20px"
};

const Alert = ({ fontSize, customStyles, dir, iconStyles, iconColor, iconHeight, iconWidth }) => {
	const styles = {
		icon: {
			width: iconWidth,
			height: iconHeight,
			...(dir === "ltr" && { marginRight: 0 }),
			...(dir === "rtl" && { marginLeft: 0 })
		},
		layered: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			...iconStyles
		}
	};
	return (
		<div style={styles.layered}>
			<SvgIcon fontSize={fontSize} style={styles.icon}>
				<Error
					style={{
						color: iconColor,
						...(customStyles.errorStyle ? customStyles.errorStyle : {})
					}}
				/>
			</SvgIcon>
			<SvgIcon
				fontSize={fontSize}
				style={
					dir == "rtl" ? { ...styles.icon, position: "absolute" } : { ...styles.icon, position: "absolute" }
				}
			>
				<ErrorOutline
					style={{
						color: "#FFF",
						...(customStyles.outerStyle ? customStyles.outerStyle : {})
					}}
				/>
			</SvgIcon>
		</div>
	);
};

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

export default Alert;
