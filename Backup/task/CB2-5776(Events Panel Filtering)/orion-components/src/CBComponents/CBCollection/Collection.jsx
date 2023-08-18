import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@mui/styles";
import { List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton, Typography } from "@mui/material";
import { ExpandMore, ExpandLess, ChatBubble, Share } from "@mui/icons-material";
import { Alert } from "orion-components/CBComponents/Icons";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n";

const styles = {
	root: {
		color: "#fff",
		backgroundColor: "#494D53",
		"&:hover": {
			backgroundColor: "#494D53"
		},
		borderRadius: 5,
		paddingLeft: 12,
		paddingRight: 12,
		minHeight: 70
	},
	selected: {
		backgroundColor: "#494D53",
		borderRight: "3px solid #35b7f3"
	},
	container: {
		paddingLeft: 30
	},
	nested: {
		marginBottom: 8,
		paddingLeft: 60
	},
	containerRTL: {
		paddingRight: 30
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	primaryText: PropTypes.string.isRequired,
	secondaryText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	selected: PropTypes.bool,
	childSelected: PropTypes.bool,
	children: PropTypes.array,
	alerts: PropTypes.bool,
	icon: PropTypes.element,
	handleSelect: PropTypes.func,
	commentCount: PropTypes.number,
	filterButton: PropTypes.element,
	open: PropTypes.bool,
	dir: PropTypes.string,
	targetingEnabled: PropTypes.bool,
	iconStyles: PropTypes.object
};

const defaultProps = {
	secondaryText: "",
	selected: false,
	childSelected: false,
	children: [],
	alerts: false,
	filtered: false,
	handleFilter: null,
	icon: null,
	handleSelect: null,
	commentCount: 0,
	filterButton: null,
	targetingEnabled: true
};

const Collection = ({
	open,
	classes,
	primaryText,
	secondaryText,
	selected,
	childSelected,
	children,
	alerts,
	filterButton,
	icon,
	handleSelect,
	commentCount,
	dir,
	filterType,
	geometry,
	feedId,
	id,
	sharedBy,
	targetingEnabled,
	iconStyles
}) => {
	const [stateOpen, setStateOpen] = useState(open ? true : false);

	const handleExpand = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setStateOpen(!stateOpen);
	};
	const styles = {
		primary: {
			color: "#fff"
		},
		secondary: {
			color: "#B5B9BE"
		},
		icon: {
			...(dir === "ltr" && { marginRight: 0 }),
			...(dir === "rtl" && { marginLeft: 0 })
		},
		commentIcon: {
			...(dir === "ltr" && { marginRight: 0 }),
			...(dir === "rtl" && { marginLeft: 0 }),
			minWidth: "35px"
		},
		layered: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "35px"
		},
		selected: {
			backgroundColor: "#383D48"
		},
		childSelected: {
			borderWidth: dir === "rtl" ? "0 0 0 3px" : "0 3px 0 0",
			borderColor: "#383D48",
			borderStyle: "solid"
		},
		textRightAlign: {
			...(sharedBy && { margin: 0 }),
			...(dir === "rtl" && { textAlign: "right" })
		},
		targetingIcon: {
			...(dir === "ltr" && { paddingLeft: 0 }),
			...(dir === "rtl" && { paddingRight: 0 })
		},
		shareIcon: {
			fontSize: 14,
			color: "rgb(181, 185, 190)",
			...(dir === "ltr" && { marginRight: 5 }),
			...(dir === "rtl" && { marginLeft: 5 })
		}
	};


	const getSecondaryText = () => {
		if (sharedBy) {
			// const description = secondaryText ? `${secondaryText} <br/>` : "";
			return <>
				{secondaryText}
				<span style={{ display: "flex" }}>
					<Share style={styles.shareIcon} />
					{`${getTranslation("global.CBComponents.CBCollection.sharedBy")} ${sharedBy}`}
				</span>
			</>
		} else {
			return secondaryText || null;
		}
	};

	return (
		<div style={{ marginBottom: 12 }}>
			<ListItem
				button={Boolean(handleSelect)}
				onClick={handleSelect ? handleSelect : null}
				style={selected ? styles.selected : childSelected ? styles.childSelected : {}}
				className={classNames(classes.root)}
			>
				{!filterType && children.length > 0 && (
					<ListItemIcon style={{ minWidth: "auto" }}>
						{stateOpen ? (
							<IconButton onClick={handleExpand}>
								<ExpandLess />
							</IconButton>
						) : (
							<IconButton onClick={handleExpand}>
								<ExpandMore />
							</IconButton>
						)}
					</ListItemIcon>
				)}
				{filterType && targetingEnabled && ((id && feedId) || geometry) &&
					<TargetingIcon
						feedId={feedId}
						id={id}
						geometry={geometry}
						iconContainerStyle={styles.targetingIcon}
					/>
				}

				{children.length > 0 && Boolean(filterButton) && (
					<ListItemIcon>{filterButton}</ListItemIcon>
				)}
				{icon && (
					<ListItemIcon style={iconStyles || styles.icon}>
						{icon}
						{filterType && <Translate value={`global.CBComponents.CBCollection.${filterType}`} style={{ fontSize: 9, marginTop: 5 }} />}
					</ListItemIcon>
				)}
				<ListItemText
					primary={primaryText}
					secondary={getSecondaryText()}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1",
						component: "p"
					}}
					secondaryTypographyProps={{
						style: styles.secondary,
						noWrap: true,
						variant: "body2"
					}}
					style={styles.textRightAlign}
				/>
				{alerts && <Alert fontSize="large" />}
				{Boolean(commentCount) && (
					<div style={styles.layered}>
						<ListItemIcon style={styles.commentIcon}>
							<ChatBubble style={styles.secondary} fontSize="large" />
						</ListItemIcon>
						<Typography
							style={{
								position: "absolute",
								bottom: 26,
								color: "#000"
							}}
						>
							{commentCount < 1000 ? commentCount : "1k+"}
						</Typography>
					</div>
				)}
			</ListItem>
			<Collapse
				className={dir && dir == "rtl" ? classes.containerRTL : classes.container}
				in={stateOpen}
				timeout="auto"
				unmountOnExit
			>
				<List>{children}</List>
			</Collapse>
		</div>
	);
};

Collection.propTypes = propTypes;
Collection.defaultProps = defaultProps;

export default withStyles(styles)(Collection);
