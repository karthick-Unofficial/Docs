import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "orion-components/CBComponents";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import { Reorder } from "@material-ui/icons";

const SortableItem = SortableElement(({ item }) => (
	<ListItem
		style={{ marginBottom: 12, backgroundColor: "#494D53", zIndex: 99999 }}
	>
		<ListItemIcon>
			<Reorder />
		</ListItemIcon>
		<ListItemText
			primary={item.name}
			primaryTypographyProps={{ noWrap: true }}
		/>
	</ListItem>
));

const SortableList = SortableContainer(({ items }) => {
	return (
		<List>
			{items.map((item, index) => (
				<SortableItem key={index} index={index} item={item} />
			))}
		</List>
	);
});

const propTypes = {
	closeDialog: PropTypes.func.isRequired,
	groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
	open: PropTypes.bool,
	updateGroupOrder: PropTypes.func.isRequired
};

const defaultProps = {
	open: false
};

const GroupSorter = ({ closeDialog, groups, open, updateGroupOrder }) => {
	const mobile = useMediaQuery("(max-width:450px)");
	const [groupOrder, setGroupOrder] = useState(groups);

	useEffect(() => {
		setGroupOrder(groups);
	}, [groups]);
	const handleSortEnd = ({ oldIndex, newIndex }) => {
		const newOrder = arrayMove(groupOrder, oldIndex, newIndex);
		setGroupOrder(newOrder);
	};
	const handleClose = () => {
		closeDialog("group-order");
	};
	const handleSave = () => {
		const newGroups = groupOrder.map((group, index) => {
			return { ...group, order: index };
		});
		updateGroupOrder(newGroups);
		handleClose();
	};
	return (
		<Dialog
			open={open}
			confirm={{ label: "OK", action: handleSave }}
			abort={{ label: "Cancel", action: handleClose }}
		>
			<div style={{ width: mobile ? "auto" : 350 }}>
				<SortableList items={groupOrder} onSortEnd={handleSortEnd} />
			</div>
		</Dialog>
	);
};

GroupSorter.propTypes = propTypes;
GroupSorter.defaultProps = defaultProps;

export default memo(GroupSorter);
