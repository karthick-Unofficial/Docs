import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Drawer, ClickAwayListener } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

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

class Dock extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { classes, open, handleClose, dir } = this.props;
		return (
			<ClickAwayListener onClickAway={handleClose}>
				<Drawer
					classes={{ paper: classes.paper }}
					open={open}
					anchor={dir == "rtl" ? "left" : "right"}
					variant="persistent"
				>
					<Translate value="global.CBComponents.CBDock.drawer"/>
				</Drawer>
			</ClickAwayListener>
		);
	}
}

Dock.propTypes = propTypes;

export default withStyles(styles)(Dock);
