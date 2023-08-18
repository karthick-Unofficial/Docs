import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import {
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Collapse,
	IconButton,
	Typography
} from "@material-ui/core";
import { ExpandMore, ExpandLess, ChatBubble } from "@material-ui/icons";
import { Alert } from "orion-components/CBComponents/Icons";

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
	children: PropTypes.array,
	alerts: PropTypes.bool,
	icon: PropTypes.element,
	handleSelect: PropTypes.func,
	commentCount: PropTypes.number,
	filterButton: PropTypes.element
};

const defaultProps = {
	secondaryText: "",
	selected: false,
	children: [],
	alerts: false,
	filtered: false,
	handleFilter: null,
	icon: null,
	handleSelect: null,
	commentCount: 0,
	filterButton: null
};

class Collection extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			open: this.props.open ? true : false
		};
	}

	handleExpand = e => {
		e.preventDefault();
		e.stopPropagation();
		const { open } = this.state;
		this.setState({ open: !open });
	};

	render() {
		const {
			classes,
			primaryText,
			secondaryText,
			selected,
			children,
			alerts,
			filterButton,
			icon,
			handleSelect,
			commentCount,
			dir
		} = this.props;
		const { open } = this.state;

		const styles = {
			primary: {
				color: "#fff"
			},
			secondary: {
				color: "#B5B9BE"
			},
			icon: {
				marginRight: 0
			},
			iconRTL: {
				marginLeft: 0
			},
			commentIcon: {
				marginRight: 0,
				minWidth: "35px"
			},
			commentIconRTL: {
				marginLeft: 0,
				minWidth: "35px"
			},
			layered: {
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "35px"
			}
		};

		return (
			<div style={{ marginBottom: 12 }}>
				<ListItem
					button={Boolean(handleSelect)}
					onClick={handleSelect ? handleSelect : null}
					style={selected ? (dir && dir == "rtl" ? { borderLeft:  "3px solid #1688bd" } :{ borderRight: "3px solid #1688bd" }) : {}}
					className={classNames(classes.root)}
				>
					{children.length > 0 && (
						<ListItemIcon style={{ minWidth: "auto" }}>
							{open ? (
								<IconButton onClick={this.handleExpand}>
									<ExpandLess />
								</IconButton>
							) : (
								<IconButton onClick={this.handleExpand}>
									<ExpandMore />
								</IconButton>
							)}
						</ListItemIcon>
					)}
					{children.length > 0 && Boolean(filterButton) && (
						<ListItemIcon>{filterButton}</ListItemIcon>
					)}
					{icon && <ListItemIcon style={dir == "rtl" ? styles.iconRTL : styles.icon}>{icon}</ListItemIcon>}
					<ListItemText
						primary={primaryText}
						secondary={secondaryText || null}
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
						style={dir == "rtl" ? {textAlign: "right"} : {}} 
					/>
					{alerts && <Alert fontSize="large" />}
					{Boolean(commentCount) && (
						<div style={styles.layered}>
							<ListItemIcon style={dir == "rtl" ? styles.commentIconRTL : styles.commentIcon}>
								<ChatBubble style={styles.secondary} fontSize="large" />
							</ListItemIcon>
							<Typography
								style={{ position: "absolute", bottom: 26, color: "#000" }}
							>
								{commentCount < 1000 ? commentCount : "1k+"}
							</Typography>
						</div>
					)}
				</ListItem>
				<Collapse
					className={dir && dir == "rtl" ? classes.containerRTL : classes.container}
					in={open}
					timeout="auto"
					unmountOnExit
				>
					<List>{children}</List>
				</Collapse>
			</div>
		);
	}
}

Collection.propTypes = propTypes;
Collection.defaultProps = defaultProps;

export default withStyles(styles)(Collection);
