import React from "react";
import PropTypes from "prop-types";
import { Typography, Tooltip } from "@mui/material";
import { Navigation } from "@mui/icons-material";
import { UnitParser } from "orion-components/CBComponents";

const propTypes = {
	label: PropTypes.string.isRequired,
	tooltip: PropTypes.string,
	unit: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object
	]).isRequired,
	visual: PropTypes.string.isRequired
};

const defaultProps = {
	tooltip: "",
	unit: ""
};

const VisualDetail = ({ label, tooltip, unit, value, visual }) => {
	const styles = {
		wrapper: {
			display: "flex",
			flexDirection: "column",
			placeContent: "center",
			alignItems: "center"
		},
		direction: {
			transform: `rotate(${value > 180 ? value - 360 : value}deg)`,
			color: "#FFF",
			width: 30,
			height: 30,
			margin: 4
		},
		flag: { height: 20, width: 28, margin: 4 }
	};
	switch (visual) {
		case "text":
			return (
				<div style={styles.wrapper}>
					<Typography variant="caption">{label}</Typography>
					<Typography variant="h5">
						{value.unit ? (
							<UnitParser
								sourceUnit={value.unit}
								value={value.val}
							/>
						) : unit ? (
							<UnitParser sourceUnit={unit} value={value} />
						) : (
							value
						)}
					</Typography>
				</div>
			);
		case "direction":
			return (
				<div style={styles.wrapper}>
					<Typography variant="caption">{label}</Typography>
					<Navigation style={styles.direction} />
					<Typography variant="caption">
						<UnitParser sourceUnit={unit} value={value} />
					</Typography>
				</div>
			);
		case "flag":
			return (
				<Tooltip title={tooltip} placement="bottom">
					<div style={styles.wrapper}>
						<Typography variant="caption">{label}</Typography>
						<div
							style={styles.flag}
							className={`flag-icon-background ${
								"flag-icon-" + value.toLowerCase()
							}`}
						/>
						<Typography variant="caption">{value}</Typography>
					</div>
				</Tooltip>
			);
		default:
			return null;
	}
};

VisualDetail.propTypes = propTypes;
VisualDetail.defaultProps = defaultProps;

export default VisualDetail;
