import React, { Component } from "react";
import { Dialog, TextField, SelectField, CBCheckbox } from "orion-components/CBComponents";
import { withStyles } from "@material-ui/core/styles";
import { withWidth, MenuItem, ClickAwayListener } from "@material-ui/core";
import { AddField } from "../../shared/components";
import { Translate } from "orion-components/i18n/I18nContainer";

import _ from "lodash";

const styles = {
	container: {
		display: "flex",
		flexDirection: "column"
	}
};

class CreateList extends Component {
	state = { name: "", category: "", newCategory: "", selectOpen: false, noPagination: true, generateActivities: false };

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeydown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeydown);
	}

	// Override autofocus on menu items when first letter of value is keyed in
	handleKeydown = e => {
		const { newCategory } = this.state;
		const field = document.getElementById("new-category");
		if (field && e.defaultPrevented && !e.key.includes("Arrow")) {
			field.focus();
			this.setState({ newCategory: newCategory.concat(e.key) });
		}
	};

	handleChange = name => event => {
		const { categories } = this.props;
		const value = event && event.target && event.target.hasOwnProperty("value")
			? event.target.value
			: event && event.target && _.isBoolean(event.target.checked)
				? event.target.checked
				: event;
		// Prevent menu from closing if electing to add a new category
		value === "new-category"
			? this.setState({ [name]: "" })
			: _.isBoolean(value) ? this.setState({ [name]: name === "noPagination" ? !value : value }) :
			// If entering new category name, update value (but do not close)
				value.toLowerCase() !== "uncategorized" && !_.includes(_.keys(categories), value)
					? this.setState({ [name]: value })
					: // If choosing a preexisting value, update, close, and clear new category field
					value.toLowerCase() === "uncategorized" ?
						this.setState({ [name]: "", selectOpen: false, newCategory: "" })
						:
			  this.setState({ [name]: value, selectOpen: false, newCategory: "" });
	};

	handleCreateList = () => {
		const { name, category, noPagination, generateActivities } = this.state;
		const { duplicating, createList, duplicateList, list } = this.props;
		const columns = [
			{
				name: "Item",
				id: "item",
				type: "text",
				order: 0,
				required: true,
				defaultValue: ""
			}
		];
		duplicating
			? duplicateList(list.id, { name, category, noPagination, generateActivities })
			: createList({ name: name, category: category, columns: columns, noPagination, generateActivities });
		this.handleClose();
	};

	handleCreateCategory = () => {
		const { createListCategory } = this.props;
		const { newCategory } = this.state;
		createListCategory(newCategory);
		this.setState({ newCategory: "" });
	};

	handleClose = () => {
		const { closeDialog, dialogRef } = this.props;
		closeDialog(dialogRef);
		this.setState({ name: "", category: "", newCategory: "" });
	};

	// Method for opening controlled select field
	handleSelectOpen = () => {
		this.setState({ selectOpen: true });
	};

	handleClickAway = () => {
		this.setState({ selectOpen: false, newCategory: "" });
	};

	render() {
		const {
			classes,
			width,
			dialog,
			duplicating,
			dialogRef,
			canManageCategories,
			dir
		} = this.props;
		const { name, category, newCategory, selectOpen, noPagination, generateActivities } = this.state;
		const categories = Object.keys(this.props.categories).length > 0 ? {"uncategorized": {name: "Uncategorized", id: "uncategorized"}, ...this.props.categories} : this.props.categories;
		const categoryList = (
			<SelectField
				id="select-category"
				label={<Translate value="listPanel.createList.fieldLabel.chooseCategory"/>}
				handleChange={this.handleChange("category")}
				value={category}
				items={categories}
				handleOpen={this.handleSelectOpen}
				open={selectOpen}
				controlled={true}
				dir={dir}
			>
				{canManageCategories && (
					<ClickAwayListener
						mouseEvent="onMouseDown"
						touchEvent="onTouchStart"
						onClickAway={this.handleClickAway}
					>
						<div>
							<MenuItem value="new-category" style={{ height: "auto" }}>
								<AddField
									id="new-category"
									label={<Translate value="listPanel.createList.fieldLabel.addCategory"/>}
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
		);
		return (
			<Dialog
				key="create-list"
				open={dialog === dialogRef}
				style={{ width: width === "xs" ? "auto" : 400 }}
				confirm={{
					label: <Translate value="listPanel.createList.dialog.create"/>,
					action: this.handleCreateList,
					disabled: !name
				}}
				onBackdropClick={this.handleClose}
				abort={{ label: <Translate value="listPanel.createList.dialog.cancel"/>, action: this.handleClose }}
				textFooter={
					duplicating ? <Translate value="listPanel.createList.dialog.textFooter"/> : ""
				}
			>
				<div
					className={classes.container}
					style={{ width: width === "xs" ? "auto" : 400 }}
				>
					<TextField
						id="list-name"
						label={<Translate value="listPanel.createList.fieldLabel.listName"/>}
						value={name}
						handleChange={this.handleChange("name")}
						autoFocus={true}
						dir={dir}
					/>
					{(canManageCategories || (!canManageCategories && _.size(categories) !== 0)) && (
						<div>
							{canManageCategories ? categoryList : 
								<ClickAwayListener onClickAway={this.handleClickAway}>
									{categoryList}
								</ClickAwayListener>}
						</div>
					)}
					<CBCheckbox
						checked={!noPagination}
						handleChange={this.handleChange("noPagination")}
						label={<Translate value="listPanel.createList.fieldLabel.paginate"/>}
						style={dir == "rtl" ? {marginLeft: 16, marginRight: -11} : {}}
					/>
					<CBCheckbox
						checked={generateActivities}
						handleChange={this.handleChange("generateActivities")}
						label={<Translate value="listPanel.createList.fieldLabel.generateRow"/>}
						style={dir == "rtl" ? {marginLeft: 16, marginRight: -11} : {}}
					/>
				</div>
			</Dialog>
		);
	}
}

export default withStyles(styles)(withWidth()(CreateList));
