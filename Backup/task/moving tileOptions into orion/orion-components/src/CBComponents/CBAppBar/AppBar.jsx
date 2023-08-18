import React, { useEffect, useState } from "react";
import { default as AppMenu } from "../CBAppMenu/AppMenu";
import { Dock } from "../index";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import {
	Toolbar,
	AppBar,
	Typography,
	IconButton,
	Popover
} from "@mui/material";
import { Apps, RssFeed, Videocam, Info } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./appBarActions";
import size from "lodash/size";
import pickBy from "lodash/pickBy";

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

const CBAppBar = ({
	classes,
	location,
	dir
}) => {
	const dispatch = useDispatch();
	const { startNotificationStream } = actionCreators;

	const globalData = useSelector(state => state.globalData);
	const alertCount = size(
		pickBy(globalData.notifications.activeItemsById, item => item.isPriority)
	);
	// const user = useSelector(state => state.user); #comment-Not used anymore

	const [anchorEl, setAnchorEl] = useState(null);
	const [dockOpen, setDockOpen] = useState(false);

	useEffect(() => {
		dispatch(startNotificationStream());
	}, []);

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleOpenDock = () => {
		setDockOpen(true);
	};

	const handleCloseDock = () => {
		setDockOpen(false);
	};

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
					<IconButton onClick={handleOpenDock} color="inherit">
						<Info />
					</IconButton>
					<IconButton color="inherit">
						<Videocam />
					</IconButton>
					<IconButton color="inherit">
						<RssFeed />
					</IconButton>
					<IconButton
						onClick={open ? handleMenuClose : handleMenuOpen}
						color="inherit"
					>
						<Apps />
					</IconButton>
					<Popover
						id="cb-app-menu"
						className={classes.paper}
						open={open}
						anchorEl={anchorEl}
						onClose={handleMenuClose}
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
			<Dock open={dockOpen} handleClose={handleCloseDock} dir={dir} />
		</div>
	);
};

CBAppBar.propTypes = propTypes;

export default withStyles(styles)(CBAppBar);
