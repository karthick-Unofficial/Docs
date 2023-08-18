import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Drawer, ClickAwayListener } from "@mui/material";
import { Translate } from "orion-components/i18n";

const styles = {
	paper: {
		marginTop: 48,
		width: 420
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired
};

const Dock = ({ classes, open, handleClose, dir }) => {
	return (
		<ClickAwayListener onClickAway={handleClose}>
			<Drawer
				classes={{ paper: classes.paper }}
				open={open}
				anchor={dir == "rtl" ? "left" : "right"}
				variant="persistent"
			>
				<Translate value="global.CBComponents.CBDock.drawer" />
			</Drawer>
		</ClickAwayListener>
	);
};

Dock.propTypes = propTypes;

export default withStyles(styles)(Dock);
