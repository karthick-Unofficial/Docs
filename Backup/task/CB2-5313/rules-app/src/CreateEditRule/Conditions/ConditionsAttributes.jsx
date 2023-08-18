import React, { useState } from "react";

// material-ui

import { List, ListItemText, ListItemIcon, ListItemButton } from "@mui/material";

// components
import ConditionDialog from "./components/ConditionDialog";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const ConditionsAttributes = ({
	openDialog,
	closeDialog,
	deleteCondition,
	addCondition,
	updateCondition,
	entityCollections,
	styles,
	conditions,
	landUnitSystem,
	timeFormatPreference,
	isOpen,
	availableConditions,
	dir,
	locale
}) => {
	const dispatch = useDispatch();

	const [editing, setEditing] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null);

	const handleClick = () => {
		dispatch(openDialog("condition-dialog"));
	};

	const handleCancelClick = () => {
		dispatch(closeDialog("condition-dialog"));
		setEditing(false);
		setEditingIndex(null);
	};

	const handleDeleteClick = (e, index) => {
		e.stopPropagation();
		deleteCondition(index);
	};

	const handleConditionClick = index => {
		dispatch(openDialog("condition-dialog"));
		setEditing(true);
		setEditingIndex(index);
	};

	const _addCondition = newCondition => {
		addCondition(newCondition);
		dispatch(closeDialog("condition-dialog"));
	};

	const _updateCondition = updatedCondition => {
		updateCondition(updatedCondition, editingIndex);
		dispatch(closeDialog("condition-dialog"));
		setEditing(false);
		setEditingIndex(null);
	};

	const _capitalize = string => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	// const conditionsAddActions = [
	// 	<FlatButton
	// 		style={styles.buttonStyles}
	// 		label={getTranslation("createEditRule.conditions.main.cancel")}
	// 		onClick={handleConditionDialogClose}
	// 		primary={true}
	// 	/>,
	// 	<FlatButton
	// 		style={styles.buttonStyles}
	// 		label={getTranslation("createEditRule.conditions.main.addCondition")}
	// 		onClick={() => handleAddCondition()}
	// 		primary={true}
	// 	/>
	// ];

	const customStyle = {
		ruleAttributesList: {
			...(dir === "rtl" ? { paddingRight: "16px" } : { paddingLeft: "16px" })
		}
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="createEditRule.conditions.main.title" /></h4>
			<List className="rule-attributes-list" sx={customStyle.ruleAttributesList}>
				{conditions.map((condition, index) => (
					<ListItemButton
						className="listItemButton-overrides"
						key={index}
						onClick={() => handleConditionClick(index)}
					>
						<ListItemIcon>
							{condition.type === "duration" ? (
								<i className="material-icons" style={{ color: "tomato" }} />
							) : (
								<i
									className="material-icons"
									style={{ color: "tomato" }}
									onClick={e => handleDeleteClick(e, index)}
								>
									clear
								</i>
							)}
						</ListItemIcon>
						<ListItemText
							primary={condition.type === "in-collection"
								? getTranslation("createEditRule.conditions.main.inCollection", entityCollections[condition.id].name)
								: condition.type === "not-in-collection"
									? getTranslation("createEditRule.conditions.main.notInCollection", entityCollections[condition.id].name)
									: getTranslation("createEditRule.conditions.main.condition", _capitalize(condition.type))}
							primaryTypographyProps={{ style: { fontSize: 16 } }}
						/>
					</ListItemButton>
				))}
				{conditions.length > 0 ? (
					<ListItemButton
						className="add-rule-attribute listItemButton-overrides"
						onClick={handleClick}
					>
						<ListItemIcon>
							<i className="material-icons" style={{ color: "#35b7f3" }}>
								add
							</i>
						</ListItemIcon>
						<ListItemText
							primary={getTranslation("createEditRule.conditions.main.addAnother")}
							primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}

						/>
					</ListItemButton>
				) : (
					<ListItemButton
						className="add-rule-attribute listItemButton-overrides"
						onClick={handleClick}
					>
						<ListItemIcon>
							<i className="material-icons" style={{ color: "#35b7f3" }}>
								add
							</i>
						</ListItemIcon>
						<ListItemText
							primary={getTranslation("createEditRule.conditions.main.addACondition")}
							primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
						/>
					</ListItemButton>
				)}
			</List>

			<ConditionDialog
				modal={true}
				conditions={conditions}
				availableConditions={availableConditions}
				contentStyle={styles.dialogStyles}
				isOpen={isOpen === "condition-dialog"}
				closeDialog={handleCancelClick}
				addCondition={_addCondition}
				updateCondition={_updateCondition}
				editing={editing}
				editingIndex={editingIndex}
				entityCollections={entityCollections}
				autoScrollBodyContent={true}
				// actions={conditionsAddActions}
				landUnitSystem={landUnitSystem}
				timeFormatPreference={timeFormatPreference}
				dir={dir}
				locale={locale}
			/>
		</div>
	);
};

export default ConditionsAttributes;
