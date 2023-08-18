import React, {Fragment} from "react";
import List, { ListItem } from "material-ui/List";

import MultiSelectionDialogContainer from "./dialog/MultiSelectionDialogContainer";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const MultiSelection = ({
	inputOptions,
	multiSelectValues,
	handleSelect,
	handleRemove,
	selectionType,
	searchProperty,
	openDialog
}) => {

	// Remove previously selected items
	const filteredOptions = inputOptions.filter(item => {
		return !multiSelectValues.includes(item);
	});

	return(
		<Fragment>
			<List className='rule-attributes-list'>
				{multiSelectValues.length ? (
					multiSelectValues.map(item => {
						return(
							<ListItem
								key={`multi-selection-item-${item[searchProperty]}`}
								primaryText={item[searchProperty]}
								leftIcon={<i className='material-icons' style={{color: "tomato"}} onClick={() => handleRemove(item.id)}>clear</i>}
							/>
						);
					})
				) : null}
                    
				<ListItem
					className='add-rule-attribute'
					primaryText={(multiSelectValues && multiSelectValues.length) ? getTranslation("createEditRule.genericAttribute.multiSelection.addAnother") : getTranslation("createEditRule.genericAttribute.multiSelection.addDynamic", selectionType)}
					onClick={() => openDialog("multi-selection-dialog")}
					leftIcon={<i className='material-icons' style={{color: "#35b7f3"}}>add</i>}
				/>
			</List>

			<MultiSelectionDialogContainer
				selectionOptions={filteredOptions}
				handleMultiSelect={handleSelect}
				searchProperty={searchProperty}
			/>
		</Fragment>
	);
};

export default MultiSelection;