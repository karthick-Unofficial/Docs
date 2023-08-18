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
		typography: {
			fontSize: 16, lineHeight: "unset", letterSpacing: "unset"
		}
	};

	return (
		<Fragment>
			<List className='rule-attributes-list'>
				{singleSelectValue
					? (
						<div>
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
									primaryTypographyProps={customStyle.typography}
								/>
							</ListItemButton>
						</div>
					)
					: (
						<div>
							<ListItemButton
								className='add-rule-attribute listItemButton-overrides'
								onClick={() => dispatch(openDialog("single-selection-dialog"))}
							>
								<ListItemIcon>
									<i className='material-icons' style={{ color: "#35b7f3" }}>add</i>
								</ListItemIcon>
								<ListItemText
									primary={getTranslation("createEditRule.genericAttribute.singleSelection.addDynamic", selectionType)}
									primaryTypographyProps={{ ...customStyle.typography, color: "#35b7f3" }}
								/>
							</ListItemButton>
						</div>
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