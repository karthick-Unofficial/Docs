import React, { useState } from "react";
import {
	Dialog,
	SelectField,
	TextField,
	CBCheckbox
} from "orion-components/CBComponents";
import {
	TextColumn,
	ChoiceColumn,
	DateTimeColumn,
	AddField
} from "../../shared/components";
import {
	useMediaQuery,
	Divider,
	MenuItem,
	ClickAwayListener
} from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";

import _ from "lodash";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	updateList,
	createListCategory
} from "./editListActions";

const styles = {};

const EditList = ({
	list,
	handleCloseDialog,
	dialogRef
}) => {

	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const user = useSelector(state => state.session.user.profile);
	const categories = useSelector(state => state.globalData.listCategories.data);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);
	const dispatch = useDispatch();

	const [category, setCategory] = useState(list.category || "uncategorized");
	const [name, setName] = useState(list.name);
	const [noPagination, setNoPagination] = useState(list.noPagination);
	const [generateActivities, setGenerateActivities] = useState(list.generateActivities);
	const [column, setColumn] = useState("");
	const [columnName, setColumnName] = useState("");
	const [defaultValue, setDefaultValue] = useState("");
	const [newCategory, setNewCategory] = useState("");
	const [selectOpen, setSelectOpen] = useState(false);
	const [error, setError] = useState(false);
	const [options, setOptions] = useState({});
	const [includeTime, setIncludeTime] = useState(false);
	const [optionsChanged, setOptionsChanged] = useState(false);
	const originalOptions = {};

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));


	const handleChange = (name, setState) => event => {
		/**
		 * Date Picker event does not have target prop, returns a moment date object
		 * Checkbox event target uses checked prop instead of value
		 */
		const value =
			event && event.target && event.target.hasOwnProperty("value")
				? event.target.value
				: event && event.target && _.isBoolean(event.target.checked)
					? event.target.checked
					: event;
		value === "new-category"
			? setState("")
			: _.isBoolean(value) ? setState(name === "noPagination" ? !value : value)
				: // If entering new category name, update value (but do not close)
				!_.includes(_.keys(categories), value)
					? setState(value)
					: // If choosing a preexisting value, update, close, and clear new category field
					setState(value);
		setNewCategory("");
		setSelectOpen(false);
		if (name === "column") {
			const selectedColumn = _.find(
				list.columns,
				column => column.id === event.target.value
			);
			setColumnName(selectedColumn.name);
			setDefaultValue(selectedColumn.defaultValue);
			setOptions("");
			//setState(prevState => ({
			//	...prevState,
			//	selectedColumn: selectedColumn.id
			//}));
			switch (selectedColumn.type) {
				case "choice":
					setOptions(selectedColumn.options);
					break;
				case "date-time":
					setDefaultValue(selectedColumn.defaultValue);
					setIncludeTime(selectedColumn.includeTime);
					break;
				default:
					break;
			}
		}
	};

	const handleThrowError = () => {
		setError(true);
	};

	const handleClearError = () => {
		setError(false);
	};

	const handleToggleTimeOption = () => {
		setIncludeTime(!includeTime);
	};

	const handleAddOption = value => {
		const newOption = {
			id: _.toLower(value.replace(/ /g, "_")),
			value: value
		};
		setOptions([...options, newOption]);
		setOptionsChanged(true);
	};

	const handleUpdateOption = (index, value) => {
		const newOptions = [];
		// need a deep copy for array of objects
		options.forEach(option => {
			newOptions.push({ ...option });
		});
		const selectedOption = newOptions[index];
		selectedOption.value = value;
		if (
			_(newOptions)
				.xorWith(originalOptions, _.isEqual)
				.isEmpty()
		) {
			setOptions(newOptions);
			setOptionsChanged(false);
		} else {
			setOptions(newOptions);
			setOptionsChanged(true);
		}
	};

	const checkColumnEquality = list => {

		const originalColumn = _.find(
			list.columns,
			originalColumn => originalColumn.id === column
		);
		if (originalColumn) {
			const updatedColumn = { ...originalColumn };
			if (defaultValue) {
				updatedColumn.defaultValue = defaultValue;
			}
			if (options) {
				updatedColumn.options = options;
			}
			if (_.isBoolean(includeTime)) {
				updatedColumn.includeTime = includeTime;
			}
			updatedColumn.name = columnName;
			if (_.isEqual(updatedColumn, originalColumn)) {
				return true;
			} else {
				return false;
			}
		}
		return true;
	};
	const handleRemoveOption = id => {
		const newOptions = _.filter(options, option => option.id !== id);
		setOptions(newOptions);
		setOptionsChanged(true);
	};

	const handleCreateCategory = () => {
		dispatch(createListCategory(newCategory));
		setNewCategory("");
	};

	const handleClose = () => {
		handleCloseDialog(dialogRef);
		setName("");
	};

	const handleConfirm = () => {

		const newColumns = [...list.columns];
		const newRows = _.size(list.rows) > 0 ? [...list.rows] : [];
		const selectedColumn = _.find(
			newColumns,
			newColumn => newColumn.id === column
		);

		if (
			selectedColumn &&
			(selectedColumn.name !== columnName ||
				selectedColumn.defaultValue !== defaultValue ||
				optionsChanged || selectedColumn.includeTime !== includeTime)
		) {
			const id = _.toLower(columnName.replace(/ /g, "_"));
			const update = _.find(
				newColumns,
				newColumn => newColumn.id === selectedColumn.id
			);

			update.name = columnName;
			update.id = id;
			update.defaultValue = defaultValue;
			if (selectedColumn.options) {
				update.options = _.each(
					options,
					option => (option.id = _.toLower(option.value.replace(/ /g, "_")))
				);
			}

			if (selectedColumn.type === "date-time" && _.isBoolean(includeTime)) {
				selectedColumn.includeTime = includeTime;
			}
			if (id !== column) {
				_.each(newRows, row => {
					row.data[id] = row.data[column];
					delete row.data[column];
				});
			}

			dispatch(updateList(list.id, { columns: newColumns, rows: newRows }));
		}
		if (name || category || list.noPagination !== noPagination || list.generateActivities !== generateActivities) {
			const update = {};
			if (name) update.name = name;
			if (category) update.category = category;
			if (list.noPagination !== noPagination) update.noPagination = noPagination;
			if (list.generateActivities !== generateActivities) update.generateActivities = generateActivities;
			dispatch(updateList(list.id, update));
		}

		handleClose();
	};

	const conditionalStyles = {
		checkbox: {
			...(dir === "rtl" && { marginLeft: 16, marginRight: -11 })
		}
	}

	const getColumnFields = () => {
		const selectedColumn = _.find(
			list.columns,
			listColumn => listColumn.id === column
		);

		let field = null;
		if (selectedColumn) {
			switch (selectedColumn.type) {
				case "text":
					field = (
						<TextColumn
							defaultValue={defaultValue}
							handleChange={() => handleChange("defaultValue", setDefaultValue)}
							dir={dir}
						/>
					);
					break;
				case "choice":
					field = (
						<ChoiceColumn
							defaultValue={defaultValue}
							handleChange={() => handleChange("defaultValue", setDefaultValue)}
							options={options}
							handleUpdateOption={handleUpdateOption}
							handleAddOption={handleAddOption}
							handleRemoveOption={handleRemoveOption}
							handleThrowError={handleThrowError}
							handleClearError={handleClearError}
							rows={list.rows || []}
							columnId={column}
							dir={dir}
						/>
					);
					break;
				case "checkbox":
					field = (
						<div style={{ marginTop: 16 }}>
							<CBCheckbox
								checked={defaultValue}
								handleChange={() => handleChange("defaultValue", setDefaultValue)}
								label={getTranslation("listView.editList.fieldLabel.defaultValue")}
								style={conditionalStyles.checkbox}
							/>
						</div>
					);
					break;
				case "date-time":
					field = (
						<DateTimeColumn
							defaultValue={defaultValue}
							handleChange={handleChange}
							includeTime={includeTime}
							handleToggleTimeOption={handleToggleTimeOption}
							dir={dir}
							locale={locale}
						/>
					);
					break;
				default:
					break;
			}
		}
		// TODO: Add field to rename column
		if (field) return field;
	};

	// Method for opening controlled select field
	const handleSelectOpen = () => {
		setSelectOpen(true);
	};

	const handleClickAway = () => {
		setNewCategory("");
		setSelectOpen(false);
	};

	const listsApp = user.applications.find(application => {
		return application.appId === "lists-app";
	});

	const canEdit = listsApp.permissions.includes("manage");
	const filteredColumns = list.columns.filter(column => !column.forCheckBox);
	let availableCategories = _.pickBy(
		categories,
		category => {
			return category.ownerOrg === user.orgId;
		}
	);
	availableCategories = { "uncategorized": { name: "Uncategorized", id: "uncategorized" }, ...availableCategories };

	return (
		<Dialog
			key="list-manager"
			open={dialog === dialogRef}
			confirm={{
				label: getTranslation("listView.editList.dialog.save"),
				action: handleConfirm,
				disabled:
					checkColumnEquality(list) &&
					name === list.name &&
					category === list.category &&
					noPagination === list.noPagination &&
					generateActivities === list.generateActivities
			}}
			abort={{ label: getTranslation("listView.editList.dialog.cancel"), action: handleClose }}
		>
			<div style={{ width: isXS ? "auto" : 350 }}>
				<TextField
					id="list-name"
					label={getTranslation("listView.editList.fieldLabel.listName")}
					value={name}
					disabled={!canEdit}
					handleChange={handleChange("name", setName)}
					dir={dir}
				/>
				<div>
					<SelectField
						id="select-category"
						label={getTranslation("listView.editList.fieldLabel.listCategory")}
						handleChange={handleChange("category", setCategory)}
						value={category}
						items={availableCategories}
						handleOpen={handleSelectOpen}
						open={selectOpen}
						controlled={true}
						dir={dir}
					>
						{canEdit && (
							<ClickAwayListener
								mouseEvent="onMouseDown"
								touchEvent="onTouchStart"
								onClickAway={handleClickAway}>
								<div>
									<MenuItem value="new-category" style={{ height: "auto" }}>
										<AddField
											id="new-category"
											label={getTranslation("listView.editList.fieldLabel.addCategory")}
											value={newCategory}
											handleChange={handleChange("newCategory", setNewCategory)}
											handleSubmit={handleCreateCategory}
											dir={dir}
										/>
									</MenuItem>
								</div>
							</ClickAwayListener>
						)}
					</SelectField>
				</div>
				<CBCheckbox
					checked={!noPagination}
					handleChange={handleChange("noPagination", setNoPagination)}
					label={getTranslation("listView.editList.fieldLabel.paginate")}
					style={conditionalStyles.checkbox}
				/>
				<CBCheckbox
					checked={generateActivities}
					handleChange={handleChange("generateActivities", setGenerateActivities)}
					label={getTranslation("listView.editList.fieldLabel.generateRow")}
					style={conditionalStyles.checkbox}
				/>
				<Divider style={{ margin: "36px 0 24px 0" }} />
				<SelectField
					id="select-column"
					label={getTranslation("listView.editList.fieldLabel.chooseColumn")}
					handleChange={handleChange("column", setColumn)}
					value={column}
					items={filteredColumns}
					controlled={false}
					dir={dir}
				/>
				{column && (
					<TextField
						id="column-name"
						label={getTranslation("listView.editList.fieldLabel.name")}
						value={columnName}
						handleChange={handleChange("columnName", setColumnName)}
						dir={dir}
					/>
				)}
				{getColumnFields()}
			</div>
		</Dialog>
	);
};


export default withStyles(styles)(EditList);


