import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";

const styles = {
	dense: {
		padding: 0
	},
	root: {
		"&:hover": {
			backgroundColor: "transparent"
		}
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	header: PropTypes.string.isRequired,
	headerStyle: PropTypes.object,
	nestedStyle: PropTypes.object,
	inset: PropTypes.bool,
	dense: PropTypes.bool
};

const defaultProps = {
	headerStyle: { variant: "body1", color: "#FFF" },
	nestedStyle: { variant: "body1", color: "#FFF" },
	inset: true,
	dense: false
};

class NestedList extends Component {
	constructor(props) {
		super(props);
		this.state = { expanded: false };
	}
	handleExpand = () => {
		const { expanded } = this.state;
		this.setState({ expanded: !expanded });
	};
	render() {
		const {
			classes,
			items,
			header,
			headerStyle,
			nestedStyle,
			inset,
			dense
		} = this.props;
		const { expanded } = this.state;

		return (
			<Fragment>
				<ListItem
					className={classes.root}
					style={{ color: headerStyle.color, height: dense ? 16 : "auto" }}
					button
					dense={dense}
					onClick={this.handleExpand}
					disableGutters
					disableTouchRipple
				>
					<ListItemText
						primary={header}
						primaryTypographyProps={{
							noWrap: true,
							variant: headerStyle.variant
						}}
					/>
					{expanded ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={expanded}>
					<List style={{ padding: 0 }}>
						{_.map(items, item => (
							<ListItem
								key={item.name}
								style={{ color: nestedStyle.color }}
								className={dense ? classes.dense : ""}
								disableGutters={!inset}
								dense={dense}
								id={item.name}
							>
								<ListItemText
									primary={item.name}
									primaryTypographyProps={{
										noWrap: true,
										variant: nestedStyle.variant
									}}
								/>
							</ListItem>
						))}
					</List>
				</Collapse>
			</Fragment>
		);
	}
}

NestedList.propTypes = propTypes;
NestedList.defaultProps = defaultProps;

export default withStyles(styles)(NestedList);
