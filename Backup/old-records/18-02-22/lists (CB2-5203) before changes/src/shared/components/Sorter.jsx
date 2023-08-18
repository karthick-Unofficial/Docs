import React, { Component } from "react";
import PropTypes from "prop-types";

import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";

import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Reorder } from "@material-ui/icons";

import _ from "lodash";

const styles = {
	root: {
		color: "#fff",
		backgroundColor: "#35b7f3",
		"&:hover": {
			backgroundColor: "#35b7f3"
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
			style={dir == "rtl" ? {textAlign: "right"} : {}}
		/>
	</ListItem>
));

const SortableList = SortableContainer(({ classes, items, dir }) => {
	return (
		<List className="widget-list">
			{_.map(items, (item, index) => (
				<SortableItem key={index} index={index} item={item} classes={classes} dir={dir}/>
			))}
		</List>
	);
});

class ListOrder extends Component {
	constructor(props) {
		super(props);
		const { items, sortKey } = this.props;

		this.state = {
			items: _.sortBy(items, [sortKey])
		};
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		const { handleSortEnd } = this.props;
		const { items } = this.state;
		const newItems = arrayMove(items, oldIndex, newIndex);
		this.setState({
			items: newItems
		});
		handleSortEnd(newItems);
	};

	render() {
		const { classes, dir } = this.props;
		const { items } = this.state;
		return (
			<SortableList
				classes={classes}
				items={items}
				onSortEnd={this.onSortEnd}
				dir={dir}
			/>
		);
	}
}

ListOrder.propTypes = {
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListOrder);
