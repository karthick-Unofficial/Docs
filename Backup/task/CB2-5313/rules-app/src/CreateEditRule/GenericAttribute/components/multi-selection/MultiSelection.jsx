import React, { Fragment } from "react";
import { List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";

import MultiSelectionDialog from "./dialog/MultiSelectionDialog";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

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
	const dir = useSelector(state => getDir(state) || "ltr");

	// Remove previously selected items
	const filteredOptions = inputOptions.filter(item => {
		return !multiSelectValues.includes(item);
	});

	const customStyle = {
		ruleAttributesList: {
			...(dir === "rtl" ? { paddingRight: "16px" } : { paddingLeft: "16px" })
		}
	};

	return (
		<Fragment>
			<List className='rule-attributes-list' sx={customStyle.ruleAttributesList}>
				{multiSelectValues.length ? (
					multiSelectValues.map(item => {
						return (
							<ListItemButton
								className="listItemButton-overrides"
								key={`multi-selection-item-${item[searchProperty]}`}
								onClick={() => dispatch(openDialog("multi-selection-dialog"))}
							>
								<ListItemIcon>
									<i className='material-icons' style={{ color: "tomato" }} onClick={() => handleRemove(item.id)}>clear</i>
								</ListItemIcon>
								<ListItemText
									primary={item[searchProperty]}
									primaryTypographyProps={{ style: { fontSize: 16 } }}
								/>
							</ListItemButton>
						);
					})
				) : null}
				<ListItemButton
					className='add-rule-attribute listItemButton-overrides'
					onClick={() => dispatch(openDialog("multi-selection-dialog"))}
				>
					<ListItemIcon>
						<i className='material-icons' style={{ color: "#35b7f3" }}>add</i>
					</ListItemIcon>
					<ListItemText
						primary={(multiSelectValues && multiSelectValues.length) ? getTranslation("createEditRule.genericAttribute.multiSelection.addAnother") : getTranslation("createEditRule.genericAttribute.multiSelection.addDynamic", selectionType)}
						primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
					/>
				</ListItemButton>
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