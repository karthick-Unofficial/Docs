import React from "react";
import { Icon, Typography, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";

const propTypes = {
	classes: PropTypes.object.isRequired,
	label: PropTypes.string.isRequired,
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
	action: PropTypes.func,
	toggled: PropTypes.bool,
	disabled: PropTypes.bool
};

const defaultProps = {
	action: null,
	toggled: false,
	disabled: false
};

const styles = {
	root: {
		textTransform: "none",
		flexDirection: "column",
		maxWidth: 60
	},
	label: {
		flexDirection: "column"
	}
};

const FontIconButton = ({
	classes,
	label,
	icon,
	action,
	toggled,
	disabled
}) => {
	return (
		<IconButton
			classes={{ label: classes.label, root: classes.root }}
			style={{
				color: toggled ? "#35b7f3" : "#828283",
				opacity: disabled ? 0.5 : 1
			}}
			disabled={disabled}
			onClick={action}
		>
			<Icon>{icon}</Icon>
			<Typography color="inherit" variant="caption">
				{label}
			</Typography>
		</IconButton>
	);
};

FontIconButton.propTypes = propTypes;
FontIconButton.defaultProps = defaultProps;

export default withStyles(styles)(FontIconButton);
