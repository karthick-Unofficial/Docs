import React, { Component } from "react";
import { default as AppMenu } from "../CBAppMenu/AppMenuContainer";
import { Dock } from "../index";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	AppBar,
	Typography,
	IconButton,
	Popover
} from "@material-ui/core";
import { Apps, RssFeed, Videocam, Info } from "@material-ui/icons";

const styles = {
	root: {
		flexGrow: 1,
		position: "relative",
		zIndex: 9999
	},
	toolbar: {
		backgroundColor: "#41454a",
		color: "#fff",
		height: 48,
		minHeight: 48
	},
	flex: {
		flexGrow: 1
	},
	paper: {
		borderRadius: 0
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.string.isRequired,
	dir: PropTypes.string
};

class CBAppBar extends Component {
	state = {
		anchorEl: null,
		dockOpen: false
	};

	componentDidMount() {
		const { startNotificationStream } = this.props;
		startNotificationStream();
	}

	handleMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
	};

	handleOpenDock = () => {
		this.setState({ dockOpen: true });
	};

	handleCloseDock = () => {
		this.setState({ dockOpen: false });
	};

	render() {
		const { classes, location, alertCount, dir } = this.props;
		const { anchorEl, dockOpen } = this.state;
		const open = Boolean(anchorEl);

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar
						className={classes.toolbar}
						style={alertCount > 0 ? { backgroundColor: "#E85858" } : {}}
					>
						<Typography
							variant="title"
							color="inherit"
							className={classes.flex}
						>
							{location}
						</Typography>
						<IconButton onClick={this.handleOpenDock} color="inherit">
							<Info />
						</IconButton>
						<IconButton color="inherit">
							<Videocam />
						</IconButton>
						<IconButton color="inherit">
							<RssFeed />
						</IconButton>
						<IconButton
							onClick={open ? this.handleMenuClose : this.handleMenuOpen}
							color="inherit"
						>
							<Apps />
						</IconButton>
						<Popover
							id="cb-app-menu"
							className={classes.paper}
							open={open}
							anchorEl={anchorEl}
							onClose={this.handleMenuClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right"
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "right"
							}}
						>
							<AppMenu />
						</Popover>
					</Toolbar>
				</AppBar>
				<Dock open={dockOpen} handleClose={this.handleCloseDock} dir={dir}/>
			</div>
		);
	}
}

CBAppBar.propTypes = propTypes;

export default withStyles(styles)(CBAppBar);
