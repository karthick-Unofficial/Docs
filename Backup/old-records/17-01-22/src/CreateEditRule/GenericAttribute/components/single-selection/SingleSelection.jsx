import React, {Fragment} from "react";
import List, { ListItem } from "material-ui/List";

import SingleSelectionDialogContainer from "./dialog/SingleSelectionDialogContainer";

const SingleSelection = ({
	inputOptions,
	singleSelectValue,
	handleSelect,
	selectionType,
	searchProperty,
	openDialog
}) => {
	return(
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
									style={{color: "tomato"}} 
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
							primaryText={`Add ${selectionType}...`}
							onClick={() => openDialog("single-selection-dialog")}
							leftIcon={<i className='material-icons' style={{color: "#35b7f3"}}>add</i>}
						/>
					)}
                
			</List>

			<SingleSelectionDialogContainer
				selectionOptions={inputOptions}
				handleSingleSelect={handleSelect}
				searchProperty={searchProperty}
			/>
		</Fragment>
	);
};

export default SingleSelection;