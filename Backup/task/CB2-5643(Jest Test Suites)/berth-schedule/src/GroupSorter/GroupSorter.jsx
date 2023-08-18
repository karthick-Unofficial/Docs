import React, { memo, useEffect, useState } from "react";
import { Dialog } from "orion-components/CBComponents";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import { List, ListItem, ListItemText, ListItemIcon, useMediaQuery } from "@mui/material";
import { Reorder } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { orderedGroupSelector } from "../selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { updateGroupOrder, closeDialog } from "./groupSorterActions";

const SortableItem = SortableElement(({ item, listItemTextStyle }) => (
	<ListItem
		style={{ marginBottom: 12, backgroundColor: "#494D53", zIndex: 99999 }}
	>
		<ListItemIcon>
			<Reorder />
		</ListItemIcon>
		<ListItemText
			primary={item.name}
			primaryTypographyProps={{ noWrap: true }}
			style={listItemTextStyle}
		/>
	</ListItem>
));

const SortableList = SortableContainer(({ items, dir }) => {
	const style = {
		listItemText: {
			...(dir === "rtl" ? { textAlign: "right" } : {})
		}
	};
	return (
		<List>
			{items.map((item, index) => (
				<SortableItem key={index} index={index} item={item} listItemTextStyle={style.listItemText} />
			))}
		</List>
	);
});



const GroupSorter = () => {
	const dispatch = useDispatch();

	const appState = useSelector(state => state.appState);
	const open = appState.dialog.openDialog === "group-order";
	const groups = useSelector(state => orderedGroupSelector(state));
	const dir = useSelector(state => getDir(state));

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
		dispatch(closeDialog("group-order"));
	};
	const handleSave = () => {
		const newGroups = groupOrder.map((group, index) => {
			return { ...group, order: index };
		});
		dispatch(updateGroupOrder(newGroups));
		handleClose();
	};
	return (
		<Dialog
			open={open}
			confirm={{ label: getTranslation("groupSorter.dialog.ok"), action: handleSave }}
			abort={{ label: getTranslation("groupSorter.dialog.Cancel"), action: handleClose }}
			dir={dir}
		>
			<div style={{ width: mobile ? "auto" : 350 }}>
				<SortableList items={groupOrder} onSortEnd={handleSortEnd} dir={dir} />
			</div>
		</Dialog>
	);
};



export default memo(GroupSorter);
