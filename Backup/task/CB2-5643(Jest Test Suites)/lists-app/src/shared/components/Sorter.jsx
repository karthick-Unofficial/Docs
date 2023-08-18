import React, { useState } from "react";
import PropTypes from "prop-types";

import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";

import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Reorder } from "@mui/icons-material";

import sortBy from "lodash/sortBy";
import map from "lodash/map";

const styles = {
	root: {
		color: "#fff",
		backgroundColor: "#383D48",
		"&:hover": {
			backgroundColor: "#383D48"
		},
		marginBottom: 12,
		zIndex: 999999
	}
};

const SortableItem = SortableElement(({ classes, item, dir }) => (
	<ListItem className={classes.root}>
		<ListItemIcon>
			<Reorder />
		</ListItemIcon>
		<ListItemText
			primary={item.name}
			primaryTypographyProps={{ noWrap: true }}
			style={dir === "rtl" ? { textAlign: "right" } : {}}
		/>
	</ListItem>
));

const SortableList = SortableContainer(({ classes, items, dir }) => {
	return (
		<List className="widget-list">
			{map(items, (item, index) => (
				<SortableItem key={index} index={index} item={item} classes={classes} dir={dir} />
			))}
		</List>
	);
});

const ListOrder = ({ classes, dir, items, sortKey, handleSortEnd }) => {
	const [Items, setItems] = useState(sortBy(items, [sortKey]));

	const onSortEnd = ({ oldIndex, newIndex }) => {
		const newItems = arrayMove(items, oldIndex, newIndex);
		setItems(newItems);
		handleSortEnd(newItems);
	};
	return (
		<SortableList
			classes={classes}
			items={Items}
			onSortEnd={onSortEnd}
			dir={dir}
		/>
	);
};

ListOrder.propTypes = {
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListOrder);