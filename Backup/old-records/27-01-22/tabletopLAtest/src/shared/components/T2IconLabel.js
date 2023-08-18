import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography, FormControlLabel } from "@material-ui/core";
import { Star, StarOutline, CubeOutline } from "mdi-material-ui";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		background: "transparent",
		minHeight: 41,
		paddingLeft: 20,
		paddingRight: 10
	},
	contentContainer: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "transparent",
		paddingBottom: 5,
		paddingLeft: 5,
		paddingRight: 10
	},
	flexContainerRTL: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		background: "transparent",
		minHeight: 41,
		paddingRight: 20,
		paddingLeft: 10
	},
	contentContainerRTL: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "transparent",
		paddingBottom: 5,
		paddingRight: 5,
		paddingLeft: 10
	}
};

function T2IconLabel(props) {
	const { classes, dir } = props;
	const labelText = props.labelText ? props.labelText : "None";
	return (
		<div className={dir == "rtl" ? classes.flexContainerRTL : classes.flexContainer}>
			<div className={dir == "rtl" ? classes.contentContainerRTL : classes.contentContainer}>
				<FormControlLabel
					control={
						<div className={dir == "rtl" ? classes.contentContainerRTL : classes.contentContainer}>
							{(props.star && <Star style={{ color: "white" }} />)}
							{(props.starOutline && <StarOutline style={{ color: "white" }} />)}
							{(props.cubeOutline && <CubeOutline style={{ color: "white", fontSize: "48px" }} />)}
						</div>
					}
					label={<Typography variant="body1">{labelText == "None" ? <Translate value="shared.components.t2IconButton.none" /> : labelText}</Typography>}
				/>
			</div>
		</div>
	);
}

T2IconLabel.propTypes = {
	classes: PropTypes.object.isRequired,
	star: PropTypes.bool,
	starOutline: PropTypes.bool,
	cubeOutline: PropTypes.bool,
	labelText: PropTypes.string,
	dir: PropTypes.string
};

export default withStyles(styles)(T2IconLabel);
