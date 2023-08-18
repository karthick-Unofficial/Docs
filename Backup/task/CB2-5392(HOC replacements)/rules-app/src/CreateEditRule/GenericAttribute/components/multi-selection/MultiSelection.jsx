import React, { Fragment } from "react";
import List, { ListItem } from "material-ui/List";

import MultiSelectionDialog from "./dialog/MultiSelectionDialog";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const MultiSelection = ({
	inputOptions,
	multiSelectValues,
	handleSelect,
	handleRemove,
	selectionType,
	searchProperty,
	openDialog
}) => {
	const dispatch = useDispatch();

	// Remove previously selected items
	const filteredOptions = inputOptions.filter(item => {
		return !multiSelectValues.includes(item);
	});

	return (
		<Fragment>
			<List className='rule-attributes-list'>
				{multiSelectValues.length ? (
					multiSelectValues.map(item => {
						return (
							<ListItem
								key={`multi-selection-item-${item[searchProperty]}`}
								primaryText={item[searchProperty]}
								leftIcon={<i className='material-icons' style={{ color: "tomato" }} onClick={() => handleRemove(item.id)}>clear</i>}
							/>
						);
					})
				) : null}

				<ListItem
					className='add-rule-attribute'
					primaryText={(multiSelectValues && multiSelectValues.length) ? getTranslation("createEditRule.genericAttribute.multiSelection.addAnother") : getTranslation("createEditRule.genericAttribute.multiSelection.addDynamic", selectionType)}
					onClick={() => dispatch(openDialog("multi-selection-dialog"))}
					leftIcon={<i className='material-icons' style={{ color: "#35b7f3" }}>add</i>}
				/>
			</List>

			<MultiSelectionDialog
				selectionOptions={filteredOptions}
				handleMultiSelect={handleSelect}
				searchProperty={searchProperty}
			/>
		</Fragment>
	);
};

export default MultiSelection;