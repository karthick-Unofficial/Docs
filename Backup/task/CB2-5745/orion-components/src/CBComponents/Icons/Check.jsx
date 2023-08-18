import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@mui/material";
import { CheckCircle, CheckCircleOutline } from "@mui/icons-material";

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
			...(dir === "rtl" && { marginLeft: 0 }),
			...(dir === "ltr" && { marginRight: 0 })
		},
		layered: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center"
		}
	};
	return (
		<div style={styles.layered}>
			<SvgIcon fontSize={fontSize} style={styles.icon}>
				<CheckCircle style={{ color: "#00af3b" }} />
			</SvgIcon>
			<SvgIcon
				fontSize={fontSize}
				style={{ ...styles.icon, position: "absolute" }}
			>
				<CheckCircleOutline style={{ color: "#FFF" }} />
			</SvgIcon>
		</div>
	);
};

Check.propTypes = propTypes;
Check.defaultProps = defaultProps;

export default Check;
