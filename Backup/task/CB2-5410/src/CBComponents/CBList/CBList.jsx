import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import {
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	ListItemSecondaryAction,
	IconButton,
	Tooltip
} from "@mui/material";
import {
	Person as User,
	DirectionsBoat as Track,
	Videocam as Camera,
	Event,
	Layers as Polygon,
	Timeline as Line,
	Place as Point,
	Error,
	AddCircle as Add,
	RemoveCircle as Remove
} from "@mui/icons-material";

const propTypes = {
	classes: PropTypes.object,
	listItems: PropTypes.array.isRequired,
	listItemStyle: PropTypes.object
};

const defaultProps = {
	listItemStyle: null
};

const styles = {
	root: {
		width: "100%"
	},
	primary: {
		color: "white",
		fontFamily: "Roboto",
		lineHeight: "20px",
		fontSize: "16px"
	},
	listItem: {
		backgroundColor: "#41454A",
		margin: "4px 0",
		height: "60px"
	},
	avatar: {
		backgroundColor: "#1f1f21",
		color: "white"
	},
	errorIcon: {
		color: "white"
	}
};

// Return correct avatar based on type
const avatar = (type) => {
	switch (type) {
		case "user":
			return <User />;
		case "event":
			return <Event />;
		case "track":
			return <Track />;
		case "camera":
			return <Camera />;
		case "polygon":
			return <Polygon />;
		case "line":
			return <Line />;
		case "point":
			return <Point />;
		default:
			return type;
	}
};

/**
 * A pre-styled CB list
 * @param classes {object} -- MaterialUi class overwrites
 * @param listItems {array} -- Array of objects you want to display as list items (See below for example)
 * -- A helper method in /Helpers/transform can transform any CB data type (users, events, tracks, shapes, etc)
 * -- Into the correct input for this method
 * @param listItemStyle {object} -- Optional list style object to overwrite default list item styling
 */
const CBList = ({ classes, listItems, listItemStyle }) => {
	return (
		<div className={classes.root}>
			<List>
				{listItems &&
					listItems.map((item) => {
						return (
							<ListItem
								key={item.id}
								style={listItemStyle ? listItemStyle : styles.listItem}
								onClick={item.action ? item.action : null}
							>
								<ListItemAvatar>
									<Avatar className={classes.avatar}>{item.avatar && avatar(item.avatar)}</Avatar>
								</ListItemAvatar>
								<ListItemText primary={item.name} classes={{ primary: classes.primary }} />
								{(item.icon || item.errorMessage) && (
									<ListItemSecondaryAction>
										{/* If error message, show tooltip and icon */}
										{item.errorMessage && (
											<Tooltip title={item.errorMessage} placement="left">
												<IconButton aria-label="Error" className={classes.errorIcon}>
													<Error />
												</IconButton>
											</Tooltip>
										)}
										{/* If no error message, show specific icon */}
										{!item.errorMessage && (
											<IconButton aria-label="Error" className={classes.errorIcon}>
												{item.icon === "error" ? (
													<Error />
												) : item.icon === "add" ? (
													<Add />
												) : item.icon === "remove" ? (
													<Remove />
												) : null}
											</IconButton>
										)}
									</ListItemSecondaryAction>
								)}
							</ListItem>
						);
					})}
			</List>
		</div>
	);
};

CBList.propTypes = propTypes;
CBList.defaultProps = defaultProps;

/**
 * listItem example
 * {
 *      id: string,
 *      name: string,
 *      avatar: string (track, user, shape, line, point, camera, or event)
 * }
 */

export default withStyles(styles)(CBList);
