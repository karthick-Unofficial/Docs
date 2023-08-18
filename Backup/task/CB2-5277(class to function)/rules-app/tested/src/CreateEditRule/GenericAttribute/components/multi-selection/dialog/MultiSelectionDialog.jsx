import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";

// components
import TypeAheadFilterContainer from "../../../../../TypeAheadFilter/TypeAheadFilterContainer";

// misc
import _ from "lodash";

// virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const isMobile = window.matchMedia("(max-width: 600px)").matches;

const styles = {
	buttonStyles: {
		...(isMobile && { fontSize: "13px" })
	}
};

const MultiSelectionDialog = ({ closeDialog, handleMultiSelect, typeAheadFilter, isOpen, selectionOptions, typeAheadFilterValue, searchProperty }) => {
	const [selectedItems, setSelectedItems] = useState([]);

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

		typeAheadFilter("");
		closeDialog("multi-selection-dialog");
	};

	const handleCancelClick = () => {
		setSelectedItems([]);

		typeAheadFilter("");
		closeDialog("multi-selection-dialog");
	};

	const actions = [
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.genericAttribute.multiSelection.multiSelectionDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.genericAttribute.multiSelection.multiSelectionDialog.addItem")}
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
			const isSelected = selectedItems.indexOf(item) > -1;
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
			open={isOpen === "multi-selection-dialog"}
			onRequestClose={handleCancelClick}
			actions={actions}
		>
			<List
				className='rule-attributes-list'
			>
				<ErrorBoundary>
					<TypeAheadFilterContainer
						className="typeAheadFilter"
						placeholder={getTranslation("createEditRule.genericAttribute.multiSelection.multiSelectionDialog.wantToFind")}
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

export default MultiSelectionDialog;
