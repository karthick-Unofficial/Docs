import React, { useState, Fragment } from "react";
import {
	Dialog,
	SelectField,
	TextField,
	CBCheckbox
} from "orion-components/CBComponents";
import {
	TextColumn,
	ChoiceColumn,
	DateTimeColumn
} from "../../shared/components";
import {
	useMediaQuery,
	MenuItem, Checkbox, FormControlLabel
} from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";

import moment from "moment-timezone";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { updateList } from "./columnAddActions";
import isBoolean from "lodash/isBoolean";
import toLower from "lodash/toLower";
import filter from "lodash/filter";
import size from "lodash/size";
import each from "lodash/each";
import find from "lodash/find";

const styles = {
	root: {
		color: "#828283",
		"&$checked": {
			color: "#69f0ae"
		}
	},
	checked: {},
	disabled: {
		opacity: 0.5
	}
};

const ColumnAdd = ({
	dialogRef,
	list,
	handleCloseDialog,
	classes
}) => {

	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const user = useSelector(state => state.session.user.profile);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	const [includeTime, setIncludeTime] = useState(false);
	const [error, setError] = useState(false);
	const [options, setOptions] = useState([]);
	const [name, setName] = useState("");
	const [lookupType, setLookupType] = useState("");
	const [type, setType] = useState("");
	const [showUser, setShowUser] = useState(true);
	const [defaultValue, setDefaultValue] = useState("");
	const [showTime, setShowTime] = useState(true);
	const dispatch = useDispatch();

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
				: event && event.target && isBoolean(event.target.checked)
					? event.target.checked
					: event;
		if (setState) {
			setState(value);
		}

		switch (value) {
			case "notes":
			case "text":
			case "lookup":
				setDefaultValue("");
				break;
			case "choice":
				setDefaultValue("choice_1");
				setOptions([
					{ id: "choice_1", value: "Choice 1" },
					{ id: "choice_2", value: "Choice 2" },
					{ id: "choice_3", value: "Choice 3" }
				]);
				break;
			case "checkbox":
				setShowUser(false);
				setDefaultValue(false);
				setShowTime(false);
				break;
			case "date-time":
				setShowUser(null);
				setDefaultValue(moment());
				break;
			default:
				break;
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
			id: toLower(value.replace(/ /g, "_")),
			value: value
		};
		setOptions([...options, newOption]);
	};

	const handleUpdateOption = (index, value) => {
		const newOptions = [...options];
		const selectedOption = newOptions[index];
		selectedOption.value = value;
		setOptions(newOptions);
	};

	const handleRemoveOption = id => {
		const newOptions = filter(options, option => option.id !== id);
		setOptions(newOptions);
	};

	const handleClose = () => {
		handleCloseDialog(dialogRef);
		setName("");
		setType("");
	};

	const handleConfirm = () => {
		let stateLessDefaultValue = defaultValue;
		let newColumns = list.columns ? [...list.columns] : [];
		const newRows = size(list.rows) > 0 ? [...list.rows] : [];
		const columns = [];
		const id = toLower(name.replace(/ /g, "_"));
		const order = newColumns.length;

		switch (type) {
			case "notes":
			case "text":
			case "lookup":
				columns.push({
					name,
					id,
					type,
					order,
					defaultValue,
					lookupType,
					required: false
				});
				break;
			case "choice":
				// Update ids of edited choices to match new values
				each(options, option => {
					if (stateLessDefaultValue === option.id)
						stateLessDefaultValue = toLower(option.value.replace(/ /g, "_"));
					option.id = toLower(option.value.replace(/ /g, "_"));
				});
				columns.push({
					name,
					id,
					type,
					order,
					defaultValue: stateLessDefaultValue,
					options,
					required: false
				});

				break;
			case "checkbox":
				columns.push({
					name,
					id,
					type,
					order,
					defaultValue,
					required: false
				});
				if (showUser) {
					const showUserName = `${name} User Completed`;
					columns.push({
						name: showUserName,
						id: id + "_user-completed",
						forCheckBox: true,
						type: "text",
						order: order + 1,
						defaultValue: defaultValue ? user.name : "",
						required: false
					});
				}
				if (showTime) {
					const showUserName = `${name} Time Completed`;
					columns.push({
						name: showUserName,
						id: id + "_show-time",
						forCheckBox: true,
						type: "date-time",
						order: order + 1,
						defaultValue: defaultValue ? moment() : "",
						includeTime: true,
						required: false
					});
				}
				break;
			case "date-time":
				columns.push({
					name,
					id,
					type,
					order,
					defaultValue,
					includeTime,
					required: false
				});
				break;
			default:
				break;
		}

		if (columns.length) {
			newColumns = [...newColumns, ...columns];
			each(newRows, row => {
				columns.forEach(column => {
					const defaultValue = column.defaultValue;
					let value;

					switch (column.type) {
						case "choice":
							{
								const defaultVal = find(
									column.options,
									option => option.id === defaultValue
								);
								value = defaultVal ? defaultVal.id : "";
							}
							break;
						default:
							value = defaultValue;
							break;
					}

					row.data[column.id] = value;
				});
			});

			dispatch(updateList(list.id, { columns: newColumns, rows: newRows }));
		}

		handleClose();
	};

	const conditionalStyles = {
		checkbox: {
			...(dir === "rtl" && { marginLeft: 16, marginRight: -11 })
		}
	}

	const getColumnFields = () => {
		let field = null;
		switch (type) {
			case "lookup":
				field = (
					<SelectField
						id="select-lookup-type"
						label={getTranslation("listView.columnAdd.fieldLabel.chooseLookupType")}
						handleChange={handleChange("lookupType", setLookupType)}
						value={lookupType || ""}
						controlled={false}
						dir={dir}
					>
						<MenuItem value="user"><Translate value="listView.columnAdd.fieldLabel.user" /></MenuItem>
					</SelectField>
				);
				break;
			case "notes":
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
						dir={dir}
					/>
				);
				break;
			case "checkbox":
				field = (
					<Fragment>
						<div style={{ marginTop: 16 }}>
							<CBCheckbox
								checked={defaultValue}
								handleChange={handleChange("defaultValue", setDefaultValue)}
								label={getTranslation("listView.columnAdd.fieldLabel.defaultValue")}
								style={conditionalStyles.checkbox}
							/>
						</div>
						<div>
							<FormControlLabel
								control={
									<Checkbox
										color="default"
										onChange={handleChange("showUser", setShowUser)}
										classes={{
											root: classes.root,
											checked: classes.checked,
											disabled: classes.disabled
										}}
									/>
								}
								label={getTranslation("listView.columnAdd.fieldLabel.showUser")}
							/>
							<FormControlLabel
								control={
									<Checkbox
										color="default"
										onChange={handleChange("showTime", setShowTime)}
										classes={{
											root: classes.root,
											checked: classes.checked,
											disabled: classes.disabled
										}}
									/>
								}
								label={getTranslation("listView.columnAdd.fieldLabel.showTime")}
							/>
						</div>
					</Fragment>

				);
				break;
			case "date-time":
				field = (
					<DateTimeColumn
						locale={locale}
						includeTime={includeTime}
						handleToggleTimeOption={handleToggleTimeOption}
						timeFormatPreference={timeFormatPreference}
						dir={dir}
					/>
				);
				break;
			default:
				break;
		}

		if (field) return field;
	};

	let exists = false;
	if (list.columns) {
		let i = 0;
		while (!exists && i < list.columns.length) {
			if (list.columns[i].id.trim() === name.toLowerCase().trim()) {
				exists = true;
			}
			i++;
		}
	}

	return (
		<Dialog
			key="add-column"
			open={dialog === dialogRef}
			confirm={{
				label: getTranslation("listView.columnAdd.dialog.create"),
				action: handleConfirm,
				disabled: !name || !type || error || exists || (type === "lookup" && !lookupType)
			}}
			abort={{ label: getTranslation("listView.columnAdd.dialog.cancel"), action: handleClose }}
		>
			<div style={{ width: isXS ? "auto" : 350 }}>
				<SelectField
					id="select-column"
					label={getTranslation("listView.columnAdd.fieldLabel.chooseColumnType")}
					handleChange={handleChange("type", setType)}
					value={type}
					controlled={false}
					dir={dir}
				>
					<MenuItem value="text"><Translate value="listView.columnAdd.menuItem.text" /></MenuItem>
					<MenuItem value="date-time"><Translate value="listView.columnAdd.menuItem.dateTime" /></MenuItem>
					<MenuItem value="choice"><Translate value="listView.columnAdd.menuItem.choice" /></MenuItem>
					<MenuItem value="checkbox"><Translate value="listView.columnAdd.menuItem.checkbox" /></MenuItem>
					<MenuItem value="lookup"><Translate value="listView.columnAdd.menuItem.lookup" /></MenuItem>
					<MenuItem value="notes"><Translate value="listView.columnAdd.menuItem.notes" /></MenuItem>
				</SelectField>
				<TextField
					id="column-name"
					label={exists ? getTranslation("listView.columnAdd.fieldLabel.columnAleadyExist") : getTranslation("listView.columnAdd.fieldLabel.columnName")}
					error={exists}
					value={name}
					handleChange={handleChange("name", setName)}
					dir={dir}
				/>
				{getColumnFields()}
			</div>
		</Dialog>
	);
};

export default withStyles(styles)(ColumnAdd);