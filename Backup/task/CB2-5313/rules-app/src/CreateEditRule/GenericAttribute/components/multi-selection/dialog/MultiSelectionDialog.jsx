import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { List, ListItem, ListItemText, Button, Dialog, DialogActions } from "@mui/material";

// components
import TypeAheadFilter from "../../../../../TypeAheadFilter/TypeAheadFilter";

// misc
import _ from "lodash";

// virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { getTranslation } from "orion-components/i18n";
import { useStore } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./multiSelectionDialogActions";
import {useStyles} from "../../../../../shared/styles/overrides";

const isMobile = window.matchMedia("(max-width: 600px)").matches;

const styles = {
	buttonStyles: {
		...(isMobile && { fontSize: "13px" })
	},
	paperProps: {
		width: "100%",
		borderRadius: "2px"
	},
	list: {
		padding: "25px"
	}
};


const MultiSelectionDialog = ({ handleMultiSelect, selectionOptions, searchProperty }) => {
	const classes = useStyles();

	const dispatch = useDispatch();

	const { typeAheadFilter, closeDialog } = actionCreators;

	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const typeAheadFilterValue = useSelector(state => state.appState.indexPage.typeAheadFilter);

	const [selectedItems, setSelectedItems] = useState([]);
	const store = useStore();

	const handleSelect = (item) => {
		const copy = [...selectedItems];
		const index = copy.indexOf(item);

		copy.indexOf(item) > -1
			? copy.splice(index, 1)
			: copy.push(item);
		setSelectedItems(copy);
	};

	const handleSaveClick = () => {
		handleMultiSelect(selectedItems);
		setSelectedItems([]);

		dispatch(typeAheadFilter(""));
		dispatch(closeDialog("multi-selection-dialog"));
	};

	const handleCancelClick = () => {
		setSelectedItems([]);

		dispatch(typeAheadFilter(""));
		dispatch(closeDialog("multi-selection-dialog"));
	};

	const actions = [
		<Button
			className="themedButton"
			variant="text"
			style={styles.buttonStyles}
			onClick={handleCancelClick}
		>
			{getTranslation("createEditRule.genericAttribute.multiSelection.multiSelectionDialog.cancel")}
		</Button>,
		<Button
			className="themedButton"
			variant="text"
			style={styles.buttonStyles}
			onClick={() => handleSaveClick()}
		>
			{getTranslation("createEditRule.genericAttribute.multiSelection.multiSelectionDialog.addItem")}
		</Button>
	];

	const renderedItems = selectionOptions
		.filter(item => {
			if (typeAheadFilterValue === "") {
				return item;
			}
			else {
				if (item[searchProperty].toLowerCase().includes(typeAheadFilterValue.toLowerCase())) {
					return item;
				}
				else {
					return false;
				}
			}
		})
		.map(item => {
			const isSelected = selectedItems.indexOf(item) > -1;
			return (
				<ListItem
					className={isSelected ? "selected" : "unselected"}
					key={item.id}
					onClick={() => handleSelect(item)}
					style={{ backgroundColor: "#41454A" }}
				>
					<ListItemText
						primary={item[searchProperty]}
						primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "unset", padding: "16px" } }}
						sx={{ margin: "0px" }}
					/>
				</ListItem>
			);
		});

	const rowRenderer = ({
		key,
		index,
		isScrolling,
		isVisible,
		style
	}) => {
		return (
			<div key={key} style={style}>
				{renderedItems[index]}
			</div>
		);
	};

	return (
		<Dialog
			PaperProps={{ className: "rule-dialog", sx: styles.paperProps }}
			open={isOpen === "multi-selection-dialog"}
			onClose={handleCancelClick}
			classes={{ scrollPaper: classes.scrollPaper }}
		>
			<List
				className='rule-attributes-list'
				sx={styles.list}
			>
				<ErrorBoundary>
					<TypeAheadFilter
						className="typeAheadFilter"
						placeholder={getTranslation("createEditRule.genericAttribute.multiSelection.multiSelectionDialog.wantToFind")}
						dispatch={dispatch}
					/>
				</ErrorBoundary>

				<AutoSizer disableHeight>
					{({ width }) => (
						<VirtList
							rowCount={selectionOptions.length}
							autoContainerWidth={true}
							rowHeight={68}
							width={width}
							height={700}
							rowRenderer={rowRenderer}
							overscanRowCount={1}
						/>
					)}
				</AutoSizer>
			</List>
			<DialogActions>{actions}</DialogActions>
		</Dialog>
	);
};

export default MultiSelectionDialog;
