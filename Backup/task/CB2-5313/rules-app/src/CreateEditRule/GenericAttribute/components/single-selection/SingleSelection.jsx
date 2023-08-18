import React, { Fragment } from "react";
import { List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";

import SingleSelectionDialog from "./dialog/SingleSelectionDialog";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const SingleSelection = ({
	inputOptions,
	singleSelectValue,
	handleSelect,
	selectionType,
	searchProperty,
	openDialog
}) => {
	const dispatch = useDispatch();
	const dir = useSelector(state => getDir(state) || "ltr");

	const customStyle = {
		ruleAttributesList: {
			...(dir === "rtl" ? { paddingRight: "16px" } : { paddingLeft: "16px" })
		}
	};

	return (
		<Fragment>
			<List className='rule-attributes-list' sx={customStyle.ruleAttributesList}>
				{singleSelectValue
					? (
						<ListItemButton
							className="listItemButton-overrides"
							key={"single-selection-item"}
						>
							<ListItemIcon>
								<i
									className='material-icons'
									style={{ color: "tomato" }}
									onClick={() => handleSelect(null)}
								>
									clear
								</i>
							</ListItemIcon>
							<ListItemText
								primary={singleSelectValue[searchProperty]}
								primaryTypographyProps={{ style: { fontSize: 16 } }}
							/>
						</ListItemButton>
					)
					: (
						<ListItemButton
							className='add-rule-attribute listItemButton-overrides'
							onClick={() => dispatch(openDialog("single-selection-dialog"))}
						>
							<ListItemIcon>
								<i className='material-icons' style={{ color: "#35b7f3" }}>add</i>
							</ListItemIcon>
							<ListItemText
								primary={getTranslation("createEditRule.genericAttribute.singleSelection.addDynamic", selectionType)}
								primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
							/>
						</ListItemButton>
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