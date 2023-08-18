import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";

// components
import TypeAheadFilter from "../../../../../TypeAheadFilter/TypeAheadFilter";

// misc
import _ from "lodash";

// virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { getTranslation } from "orion-components/i18n";
import { useStore } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./singleSelectionDialogActions";

const isMobile = window.matchMedia("(max-width: 600px)").matches;

const styles = {
	buttonStyles: {
		...(isMobile && { fontSize: "13px" })
	}
};

const SingleSelectionDialog = ({ selection, selectedItem, handleSingleSelect, selectionOptions, searchProperty }) => {
	const dispatch = useDispatch();
	const { typeAheadFilter, closeDialog } = actionCreators;

	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const typeAheadFilterValue = useSelector(state => state.appState.indexPage.typeAheadFilter);
	const [selectedItemState, setSelectedItemState] = useState(selection || null);

	const store = useStore();

	const handleSelect = (item) => {

		if (selectedItem && (selectedItem.id === item.id)) {
			setSelectedItemState(null);
		}
		else {
			setSelectedItemState(item);
		}
	};

	const handleSaveClick = () => {
		handleSingleSelect(selectedItem);
		setSelectedItemState(null);

		typeAheadFilter("");
		closeDialog("single-selection-dialog");
	};

	const handleCancelClick = () => {
		setSelectedItemState(null);

		typeAheadFilter("");
		closeDialog("single-selection-dialog");
	};

	const actions = [
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.genericAttribute.singleSelection.singleSelectionDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.genericAttribute.singleSelection.singleSelectionDialog.addItem")}
			onClick={() => handleSaveClick()}
			primary={true}
		/>
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
			const isSelected = selectedItemState && (selectedItemState.id === item.id);
			return (
				<ListItem
					className={isSelected ? "selected" : "unselected"}
					key={item.id}
					style={{ backgroundColor: "#41454A" }}
					primaryText={item[searchProperty]}
					onClick={() => handleSelect(item)}
				/>
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
			model={true}
			paperClassName='rule-dialog'
			open={isOpen === "single-selection-dialog"}
			onRequestClose={handleCancelClick}
			actions={actions}
		>
			<List
				className='rule-attributes-list'
			>
				<ErrorBoundary>
					<TypeAheadFilter
						className="typeAheadFilter"
						placeholder={getTranslation("createEditRule.genericAttribute.singleSelection.singleSelectionDialog.wantToFind")}
						store={store} // passing store explicitly to avoid redux connect issues
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
		</Dialog>
	);
};

export default SingleSelectionDialog;
