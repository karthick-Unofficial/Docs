import React, { Component } from "react";
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
	withWidth,
	Divider,
	MenuItem,
	ClickAwayListener
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {};

class ColumnAdd extends Component {
	constructor(props) {
		super(props);
		const { list } = this.props;
		this.state = {
			category: list.category || "uncategorized",
			name: list.name,
			noPagination: list.noPagination,
			generateActivities: list.generateActivities,
			column: "",
			columnName: "",
			defaultValue: "",
			newCategory: "",
			selectOpen: false,
			error: false
		};
	}

	handleChange = name => event => {
		const { list, categories } = this.props;
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
			? this.setState({ [name]: "" })
			: _.isBoolean(value) ? this.setState({ [name]: name === "noPagination" ? !value : value }) 
				: // If entering new category name, update value (but do not close)
				!_.includes(_.keys(categories), value)
					? this.setState({ [name]: value })
					: // If choosing a preexisting value, update, close, and clear new category field
			  this.setState({ [name]: value, selectOpen: false, newCategory: "" });
		if (name === "column") {
			const selectedColumn = _.find(
				list.columns,
				column => column.id === event.target.value
			);
			this.setState({
				selectedColumn: selectedColumn.id,
				columnName: selectedColumn.name,
				defaultValue: selectedColumn.defaultValue,
				options: ""
			});
			switch (selectedColumn.type) {
				case "choice":
					this.setState({
						options: selectedColumn.options
					});
					break;
				case "date-time":
					this.setState({
						defaultValue: selectedColumn.defaultValue,
						includeTime: selectedColumn.includeTime
					});
					break;
				default:
					break;
			}
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
		this.setState({ options: [...options, newOption], optionsChanged: true });
	};

	handleUpdateOption = (index, value) => {
		const { options } = this.state;
		const newOptions = [];
		// need a deep copy for array of objects
		options.forEach(option => {
			newOptions.push({ ...option });
		});
		const selectedOption = newOptions[index];
		selectedOption.value = value;
		if (
			_(newOptions)
				.xorWith(this.state.originalOptions, _.isEqual)
				.isEmpty()
		) {
			this.setState({ options: newOptions, optionsChanged: false });
		} else {
			this.setState({ options: newOptions, optionsChanged: true });
		}
	};

	checkColumnEquality = list => {
		const {
			column,
			defaultValue,
			options,
			includeTime,
			columnName
		} = this.state;
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
	handleRemoveOption = id => {
		const { options } = this.state;
		const newOptions = _.filter(options, option => option.id !== id);
		this.setState({ options: newOptions, optionsChanged: true });
	};

	handleCreateCategory = () => {
		const { createListCategory } = this.props;
		const { newCategory } = this.state;
		createListCategory(newCategory);
		this.setState({ newCategory: "" });
	};

	handleClose = () => {
		const { handleCloseDialog, dialogRef } = this.props;
		handleCloseDialog(dialogRef);
		this.setState({ type: "", name: "" });
	};

	handleConfirm = () => {
		const { updateList, list } = this.props;
		const {
			category,
			name,
			column,
			columnName,
			defaultValue,
			options,
			optionsChanged,
			noPagination,
			generateActivities,
			includeTime
		} = this.state;
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

			updateList(list.id, { columns: newColumns, rows: newRows });
		}
		if (name || category || list.noPagination !== noPagination || list.generateActivities !== generateActivities) {
			const update = {};
			if (name) update.name = name;
			if (category) update.category = category;
			if (list.noPagination !== noPagination) update.noPagination = noPagination;
			if (list.generateActivities !== generateActivities) update.generateActivities = generateActivities;
			updateList(list.id, update);
		}

		this.handleClose();
	};

	getColumnFields = () => {
		const { list, dir } = this.props;
		const { column, defaultValue, options, includeTime } = this.state;
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
								handleChange={this.handleChange("defaultValue")}
								label={<Translate value="listView.editList.fieldLabel.defaultValue"/>}
								style={dir == "rtl" ? {marginLeft: 16, marginRight: -11} : {}}
							/>
						</div>
					);
					break;
				case "date-time":
					field = (
						<DateTimeColumn
							defaultValue={defaultValue}
							handleChange={this.handleChange}
							includeTime={includeTime}
							handleToggleTimeOption={this.handleToggleTimeOption}
							dir={dir}
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
	handleSelectOpen = () => {
		this.setState({ selectOpen: true });
	};

	handleClickAway = () => {
		this.setState({ selectOpen: false, newCategory: "" });
	};

	render() {
		const { list, width, dialog, categories, dialogRef, user, dir } = this.props;
		const {
			column,
			columnName,
			newCategory,
			selectOpen,
			name,
			category,
			noPagination,
			generateActivities
		} = this.state;

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
		availableCategories = {"uncategorized": {name: "Uncategorized", id: "uncategorized"}, ...availableCategories};

		return (
			<Dialog
				key="list-manager"
				open={dialog === dialogRef}
				confirm={{
					label: <Translate value="listView.editList.dialog.save"/>,
					action: this.handleConfirm,
					disabled:
						this.checkColumnEquality(list) &&
						name === list.name &&
						category === list.category &&
						noPagination === list.noPagination &&
						generateActivities === list.generateActivities
				}}
				abort={{ label: <Translate value="listView.editList.dialog.cancel"/>, action: this.handleClose }}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<TextField
						id="list-name"
						label={<Translate value="listView.editList.fieldLabel.listName"/>}
						value={name}
						disabled={!canEdit}
						handleChange={this.handleChange("name")}
						dir={dir}
					/>
					<div>
						<SelectField
							id="select-category"
							label={<Translate value="listView.editList.fieldLabel.listCategory"/>}
							handleChange={this.handleChange("category")}
							value={category}
							items={availableCategories}
							handleOpen={this.handleSelectOpen}
							open={selectOpen}
							controlled={true}
							dir={dir}
						>
							{canEdit && (
								<ClickAwayListener
									mouseEvent="onMouseDown"
									touchEvent="onTouchStart"
									onClickAway={this.handleClickAway}>
									<div>
										<MenuItem value="new-category" style={{ height: "auto" }}>
											<AddField
												id="new-category"
												label={<Translate value="listView.editList.fieldLabel.addCategory"/>}
												value={newCategory}
												handleChange={this.handleChange("newCategory")}
												handleSubmit={this.handleCreateCategory}
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
						handleChange={this.handleChange("noPagination")}
						label={<Translate value="listView.editList.fieldLabel.paginate"/>}
						style={dir == "rtl" ? {marginLeft: 16, marginRight: -11} : {}}
					/>
					<CBCheckbox
						checked={generateActivities}
						handleChange={this.handleChange("generateActivities")}
						label={<Translate value="listView.editList.fieldLabel.generateRow"/>}
						style={dir == "rtl" ? {marginLeft: 16, marginRight: -11} : {}}
					/>
					<Divider style={{ margin: "36px 0 24px 0" }} />
					<SelectField
						id="select-column"
						label={<Translate value="listView.editList.fieldLabel.chooseColumn"/>}
						handleChange={this.handleChange("column")}
						value={column}
						items={filteredColumns}
						controlled={false}
						dir={dir}
					/>
					{column && (
						<TextField
							id="column-name"
							label={<Translate value="listView.editList.fieldLabel.name"/>}
							value={columnName}
							handleChange={this.handleChange("columnName")}
							dir={dir}
						/>
					)}
					{this.getColumnFields()}
				</div>
			</Dialog>
		);
	}
}

export default withStyles(styles)(withWidth()(ColumnAdd));
