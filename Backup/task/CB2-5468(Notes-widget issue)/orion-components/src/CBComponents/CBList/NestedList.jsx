import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemText, Collapse } from "@mui/material";
import { withStyles } from "@mui/styles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
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

const NestedList = ({
	classes,
	items,
	header,
	headerStyle,
	nestedStyle,
	inset,
	dense
}) => {
	const [expanded, setExpanded] = useState(false);

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<Fragment>
			<ListItem
				className={classes.root}
				style={{ color: headerStyle.color, height: dense ? 16 : "auto" }}
				button
				dense={dense}
				onClick={handleExpand}
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
};

NestedList.propTypes = propTypes;
NestedList.defaultProps = defaultProps;

export default withStyles(styles)(NestedList);
