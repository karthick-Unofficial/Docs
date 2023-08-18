import React, { useState } from "react";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";

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

	return (
		<div className="generic-attribute">
			<h4><Translate value="createEditRule.conditions.main.title" /></h4>
			<List className="rule-attributes-list">
				{conditions.map((condition, index) => (
					<ListItem
						key={index}
						onClick={() => handleConditionClick(index)}
						primaryText={
							condition.type === "in-collection"
								? getTranslation("createEditRule.conditions.main.inCollection", entityCollections[condition.id].name)
								: condition.type === "not-in-collection"
									? getTranslation("createEditRule.conditions.main.notInCollection", entityCollections[condition.id].name)
									: getTranslation("createEditRule.conditions.main.condition", _capitalize(condition.type))
						}
						leftIcon={
							condition.type === "duration" ? (
								<i className="material-icons" style={{ color: "tomato" }} />
							) : (
								<i
									className="material-icons"
									style={{ color: "tomato" }}
									onClick={e => handleDeleteClick(e, index)}
								>
									clear
								</i>
							)
						}
					/>
				))}
				{conditions.length > 0 ? (
					<ListItem
						className="add-rule-attribute"
						primaryText={getTranslation("createEditRule.conditions.main.addAnother")}
						onClick={handleClick}
						leftIcon={
							<i className="material-icons" style={{ color: "#35b7f3" }}>
								add
							</i>
						}
					/>
				) : (
					<ListItem
						className="add-rule-attribute"
						primaryText={getTranslation("createEditRule.conditions.main.addACondition")}
						onClick={handleClick}
						leftIcon={
							<i className="material-icons" style={{ color: "#35b7f3" }}>
								add
							</i>
						}
					/>
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
