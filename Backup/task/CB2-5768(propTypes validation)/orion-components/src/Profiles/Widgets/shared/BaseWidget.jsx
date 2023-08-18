import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import Expand from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import size from "lodash/size";
// TODO: Restore once Portals are implemented
// import { Portal } from "orion-components/CBComponents";

const propTypes = {
	classes: PropTypes.object.isRequired,
	order: PropTypes.number,
	title: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	handleExpand: PropTypes.func,
	expanded: PropTypes.bool,
	expandable: PropTypes.bool,
	icon: PropTypes.element,
	enabled: PropTypes.bool,
	handleLaunch: PropTypes.func,
	launchable: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	handleExpand: null,
	children: [],
	expanded: false,
	order: 0,
	expandable: false,
	icon: null,
	enabled: true,
	handleLaunch: null,
	launchable: false,
	dir: "ltr"
};

const styles = {
	root: {
		paddingRight: 0,
		"&:hover": {
			backgroundColor: "transparent"
		}
	},
	rootRTL: {
		paddingLeft: 0,
		"&:hover": {
			backgroundColor: "transparent"
		}
	}
};

const BaseWidget = ({
	classes,
	order,
	enabled,
	title,
	children,
	icon,
	// TODO: Remove once Portals are implemented
	handleExpand,
	expanded,
	expandable, // This is a good case for properties that should be provided via Context rather than passed through (https://reactjs.org/docs/context.html)
	handleLaunch,
	launchable,
	dir
}) => {
	// TODO: Restore once Portals are implemented
	// componentDidMount() {
	// 	const node = document.getElementById("profile-widgets");
	// 	this.setState({ node });
	// }

	// handleExpand = () => {
	// 	const { expanded } = this.state;
	// 	const node = document.getElementById("node");
	// 	this.setState({ expanded: !expanded, node });
	// };
	// TODO: Restore once Portals are implemented
	// const { expanded, node } = this.state;
	const styles = {
		wrapper: {
			backgroundColor: expanded ? "transparent" : "#2C2D2F",
			marginTop: 4,
			borderRadius: 5,
			padding: 10,
			order,
			display: "flex",
			flexDirection: "column"
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			color: "#FFF"
		},
		headerButtons: {
			...(dir === "rtl" && { marginRight: "auto" }),
			...(dir === "ltr" && { marginLeft: "auto" }),
			display: "flex"
		},
		iconButton: {
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 }),
			width: "auto"
		},
		launchableButton: {
			width: "auto",
			color: "white",
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 })
		}
	};

	// TODO: Restore once Portals are implemented
	// return node ? (
	// 	<Portal node={node}>

	return enabled ? (
		/**
		 * Remove styling if theres nothing to render
		 * Prevents padding on empty widgets (Map Widget) from from affecting
		 * profile layout
		 */
		<div style={expanded && !size(children) ? {} : styles.wrapper}>
			{!expanded && (
				<div style={styles.header}>
					{Boolean(icon) && icon}
					<Typography
						style={
							dir == "rtl"
								? {
										marginLeft: "auto",
										marginRight: icon ? "1rem" : 0
								  }
								: {
										marginRight: "auto",
										marginLeft: icon ? "1rem" : 0
								  }
						}
						variant="subtitle1"
					>
						{title}
					</Typography>
					<div style={styles.headerButtons}>
						{expandable && (
							<IconButton
								disableTouchRipple
								className={dir == "rtl" ? classes.rootRTL : classes.root}
								style={styles.iconButton}
								onClick={handleExpand}
							>
								<Expand style={{ color: "#FFF" }} />
							</IconButton>
						)}
						{launchable && (
							<IconButton disableTouchRipple style={styles.launchableButton} onClick={handleLaunch}>
								<LaunchIcon />
							</IconButton>
						)}
					</div>
				</div>
			)}
			{children}
		</div>
	) : (
		<Fragment />
	);

	// 	</Portal>
	// ) : (
	// 	<div />
	// );
};

BaseWidget.propTypes = propTypes;
BaseWidget.defaultProps = defaultProps;

export default withStyles(styles)(BaseWidget);
