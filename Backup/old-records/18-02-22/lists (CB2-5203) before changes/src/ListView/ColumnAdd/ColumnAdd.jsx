import React, { Component, Fragment } from "react";
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
import { withWidth, MenuItem, Checkbox, FormControlLabel } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import _ from "lodash";
import moment from "moment-timezone";
import { Translate } from "orion-components/i18n/I18nContainer";

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

class ColumnAdd extends Component {
	state = {
		type: "",
		name: "",
		defaultValue: "",
		includeTime: false,
		error: false
	};

	handleChange = name => event => {
	
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

		this.setState({ [name]: value });
		switch (value) {
			case "notes":
			case "text":
			case "lookup":
				this.setState({ defaultValue: "" });
				break;
			case "choice":
				this.setState({
					defaultValue: "choice_1",
					options: [
						{ id: "choice_1", value: "Choice 1" },
						{ id: "choice_2", value: "Choice 2" },
						{ id: "choice_3", value: "Choice 3" }
					]
				});
				break;
			case "checkbox":
				this.setState({
					defaultValue: false,
					showTime: false,
					showUser: false
				});
				break;
			case "date-time":
				this.setState({
					defaultValue: null
				});
				break;
			default:
				break;
		}
	};

	handleThrowError = () => {
		this.setState({ error: true });
	};

	handleClearError = () => {
		this.setState({ error: false });
	};

	handleToggleTimeOption = () => {
		const { includeTime } = this.state;
		this.setState({ includeTime: !includeTime });
	};

	handleAddOption = value => {
		const { options } = this.state;
		const newOption = {
			id: _.toLower(value.replace(/ /g, "_")),
			value: value
		};
		this.setState({ options: [...options, newOption] });
	};

	handleUpdateOption = (index, value) => {
		const { options } = this.state;
		const newOptions = [...options];
		const selectedOption = newOptions[index];
		selectedOption.value = value;
		this.setState({ options: newOptions });
	};

	handleRemoveOption = id => {
		const { options } = this.state;
		const newOptions = _.filter(options, option => option.id !== id);
		this.setState({ options: newOptions });
	};

	handleClose = () => {
		const { handleCloseDialog, dialogRef } = this.props;
		handleCloseDialog(dialogRef);
		this.setState({ type: "", name: "" });
	};

	handleConfirm = () => {
		const { list, updateList, user } = this.props;
		const { type, name, includeTime, options, showUser, showTime, lookupType } = this.state;

		let defaultValue = this.state.defaultValue;

		let newColumns = list.columns ? [...list.columns] : [];
		const newRows = _.size(list.rows) > 0 ? [...list.rows] : [];
		const columns = [];

		const id = _.toLower(name.replace(/ /g, "_"));
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
				_.each(options, option => {
					if (defaultValue === option.id)
						defaultValue = _.toLower(option.value.replace(/ /g, "_"));
					option.id = _.toLower(option.value.replace(/ /g, "_"));
				});
				columns.push({
					name,
					id,
					type,
					order,
					defaultValue,
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
			_.each(newRows, row => {
				columns.forEach(column => {
					const defaultValue = column.defaultValue;
					let value;

					switch (column.type) {
						case "choice":
							{
								const defaultVal = _.find(
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

			updateList(list.id, { columns: newColumns, rows: newRows });
		}

		this.handleClose();
	};

	getColumnFields = () => {
		const { type, defaultValue, options, includeTime, lookupType } = this.state;
		const { classes, timeFormatPreference, dir } = this.props;
		let field = null;

		switch (type) {
			case "lookup": 
				field = (
					<SelectField
						id="select-lookup-type"
						label={<Translate value="listView.columnAdd.fieldLabel.chooseLookupType"/>}
						handleChange={this.handleChange("lookupType")}
						value={lookupType || ""}
						controlled={false}
						dir={dir}
					>
						<MenuItem value="user"><Translate value="listView.columnAdd.fieldLabel.user"/></MenuItem>
					</SelectField>
				);
				break;
			case "notes":
			case "text":
				field = (
					<TextColumn
						defaultValue={defaultValue}
						handleChange={this.handleChange}
						dir={dir}
					/>
				);
				break;
			case "choice":
				field = (
					<ChoiceColumn
						defaultValue={defaultValue}
						handleChange={this.handleChange}
						options={options}
						handleUpdateOption={this.handleUpdateOption}
						handleAddOption={this.handleAddOption}
						handleRemoveOption={this.handleRemoveOption}
						handleThrowError={this.handleThrowError}
						handleClearError={this.handleClearError}
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
								handleChange={this.handleChange("defaultValue")}
								label={<Translate value="listView.columnAdd.fieldLabel.defaultValue"/>}
								style={dir == "rtl" ? {marginLeft: 16, marginRight: -11} : {}}
							/>
						</div>
						<div>
							<FormControlLabel
								control={
									<Checkbox
										color="default"
										onChange={this.handleChange("showUser")}
										classes={{
											root: classes.root,
											checked: classes.checked,
											disabled: classes.disabled
										}}
									/>
								}
								label={<Translate value="listView.columnAdd.fieldLabel.showUser"/>}
							/>
							<FormControlLabel
								control={
									<Checkbox
										color="default"
										onChange={this.handleChange("showTime")}
										classes={{
											root: classes.root,
											checked: classes.checked,
											disabled: classes.disabled
										}}
									/>
								}
								label={<Translate value="listView.columnAdd.fieldLabel.showTime"/>}
							/>
						</div>
					</Fragment>

				);
				break;
			case "date-time":
				field = (
					<DateTimeColumn
						includeTime={includeTime}
						handleToggleTimeOption={this.handleToggleTimeOption}
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

	render() {
		const { width, dialog, dialogRef, dir } = this.props;
		const { type, name, error, lookupType } = this.state;
		const { list } = this.props;
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
					label: <Translate value="listView.columnAdd.dialog.create"/>,
					action: this.handleConfirm,
					disabled: !name || !type || error || exists || (type === "lookup" && !lookupType)
				}}
				abort={{ label: <Translate value="listView.columnAdd.dialog.cancel"/>, action: this.handleClose }}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<SelectField
						id="select-column"
						label={<Translate value="listView.columnAdd.fieldLabel.chooseColumnType"/>}
						handleChange={this.handleChange("type")}
						value={type}
						controlled={false}
						dir={dir}
					>
						<MenuItem value="text"><Translate value="listView.columnAdd.menuItem.text"/></MenuItem>
						<MenuItem value="date-time"><Translate value="listView.columnAdd.menuItem.dateTime"/></MenuItem>
						<MenuItem value="choice"><Translate value="listView.columnAdd.menuItem.choice"/></MenuItem>
						<MenuItem value="checkbox"><Translate value="listView.columnAdd.menuItem.checkbox"/></MenuItem>
						<MenuItem value="lookup"><Translate value="listView.columnAdd.menuItem.lookup"/></MenuItem>
						<MenuItem value="notes"><Translate value="listView.columnAdd.menuItem.notes"/></MenuItem>
					</SelectField>
					<TextField
						id="column-name"
						label={exists ?  <Translate value="listView.columnAdd.fieldLabel.columnAleadyExist"/> : <Translate value="listView.columnAdd.fieldLabel.columnName"/>}
						error={exists}
						value={name}
						handleChange={this.handleChange("name")}
						dir={dir}
					/>
					{this.getColumnFields()}
				</div>
			</Dialog>
		);
	}
}

export default withStyles(styles)(withWidth()(ColumnAdd));
