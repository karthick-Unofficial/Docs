import React, { Fragment } from "react";
import List, { ListItem } from "material-ui/List";

import SingleSelectionDialog from "./dialog/SingleSelectionDialog";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const SingleSelection = ({
	inputOptions,
	singleSelectValue,
	handleSelect,
	selectionType,
	searchProperty,
	openDialog
}) => {
	const dispatch = useDispatch();
	
	return (
		<Fragment>
			<List className='rule-attributes-list'>
				{singleSelectValue
					? (
						<ListItem
							key={"single-selection-item"}
							primaryText={singleSelectValue[searchProperty]}
							leftIcon={
								<i
									className='material-icons'
									style={{ color: "tomato" }}
									onClick={() => handleSelect(null)}
								>
									clear
								</i>
							}
						/>
					)
					: (
						<ListItem
							className='add-rule-attribute'
							primaryText={getTranslation("createEditRule.genericAttribute.singleSelection.addDynamic", selectionType)}
							onClick={() => dispatch(openDialog("single-selection-dialog"))}
							leftIcon={<i className='material-icons' style={{ color: "#35b7f3" }}>add</i>}
						/>
					)}

			</List>

			<SingleSelectionDialog
				selectionOptions={inputOptions}
				handleSingleSelect={handleSelect}
				searchProperty={searchProperty}
			/>
		</Fragment>
	);
};

export default SingleSelection;