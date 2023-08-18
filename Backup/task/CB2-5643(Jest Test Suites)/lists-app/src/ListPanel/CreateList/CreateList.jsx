import React, { useState, useEffect } from "react";
import { Dialog, TextField, SelectField, CBCheckbox } from "orion-components/CBComponents";
import {
	useMediaQuery,
	MenuItem,
	ClickAwayListener
} from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";
import { AddField } from "../../shared/components";
import { getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";

import {
	createList,
	createListCategory,
	duplicateList
} from "./createListActions";
import { closeDialog } from "./createListActions";

import { useDispatch, useSelector } from "react-redux";
import isBoolean from "lodash/isBoolean";
import size from "lodash/size";
import includes from "lodash/includes";
import keys from "lodash/keys";

const styles = {
	container: {
		display: "flex",
		flexDirection: "column"
	}
};

const CreateList = ({
	classes,
	duplicating,
	dialogRef,
	list
}) => {

	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const user = useSelector(state => state.session.user.profile);
	const categories = useSelector(state => state.globalData.listCategories.data);
	const canManageCategories = user && user.applications.find(app => app.appId === "lists-app")
		&& user.applications.find(app => app.appId === "lists-app").permissions
		&& user.applications.find(app => app.appId === "lists-app").permissions.includes("manage");
	const dir = useSelector(state => getDir(state));

	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [noPagination, setNoPagination] = useState(true);
	const [newCategory, setNewCategory] = useState("");
	const [generateActivities, setGenerateActivities] = useState(false);
	const [selectOpen, setSelectOpen] = useState(false);
	const dispatch = useDispatch();

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	const handleKeydown = e => {
		const field = document.getElementById("new-category");
		if (field && e.defaultPrevented && !e.key.includes("Arrow")) {
			field.focus();
			setNewCategory(newCategory.concat(e.key));
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleKeydown);
		return () => {
			document.removeEventListener("keydown", handleKeydown);
		};
	}, []);

	const handleChange = (name, setState) => event => {
		const value = event && event.target && event.target.hasOwnProperty("value")
			? event.target.value
			: event && event.target && isBoolean(event.target.checked)
				? event.target.checked
				: event;
		// Prevent menu from closing if electing to add a new category

		value === "new-category"
			? setState("")
			: isBoolean(value) ?
				setState(name === "noPagination" ? !value : value) :
				// If entering new category name, update value (but do not close)
				value.toLowerCase() !== "uncategorized" && !includes(keys(categories), value)
					? setState(value)
					: // If choosing a preexisting value, update, close, and clear new category field
					value.toLowerCase() === "uncategorized" ?
						(
							setState(""),
							setNewCategory(""),
							setSelectOpen(false)
						)
						:
						(
							setState(value),
							setNewCategory(""),
							setSelectOpen(false)
						);
	};

	const handleClose = () => {
		dispatch(closeDialog(dialogRef));
		setName("");
		setCategory("");
		setNewCategory("");
	};

	const handleCreateList = () => {
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
			? dispatch(duplicateList(list.id, { name, category, noPagination, generateActivities }))
			: dispatch(createList({ name: name, category: category, noPagination: noPagination, columns: columns, generateActivities }));
		handleClose();
	};

	const handleCreateCategory = () => {
		dispatch(createListCategory(newCategory));
		setNewCategory("");
	};


	const handleSelectOpen = () => {
		setSelectOpen(true);
	};

	const handleClickAway = () => {
		setSelectOpen(false);
		setNewCategory("");
	};

	const categoriesNonProp = Object.keys(categories).length > 0 ? { "uncategorized": { name: "Uncategorized", id: "uncategorized" }, ...categories } : categories;
	const categoryList = (
		<SelectField
			id="select-category"
			label={getTranslation("listPanel.createList.fieldLabel.chooseCategory")}
			handleChange={handleChange("category", setCategory)}
			value={category}
			items={categoriesNonProp}
			handleOpen={handleSelectOpen}
			open={selectOpen}
			controlled={true}
			dir={dir}
		>
			{canManageCategories && (
				<ClickAwayListener
					mouseEvent="onMouseDown"
					touchEvent="onTouchStart"
					onClickAway={handleClickAway}

				>
					<div>
						<MenuItem value="new-category" style={{ height: "auto" }}>
							<AddField
								id="new-category"
								label={getTranslation("listPanel.createList.fieldLabel.addCategory")}
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
	);

	const conditionalStyles = {
		checkbox: {
			...(dir === "rtl" && { marginLeft: 16, marginRight: -11 })
		}
	}

	return (
		<Dialog
			key="create-list"
			open={dialog === dialogRef}
			style={{ width: isXS ? "auto" : 400 }}
			confirm={{
				label: getTranslation("listPanel.createList.dialog.create"),
				action: handleCreateList,
				disabled: !name
			}}
			onBackdropClick={handleClose}
			abort={{ label: getTranslation("listPanel.createList.dialog.cancel"), action: handleClose }}
			textFooter={
				duplicating ? getTranslation("listPanel.createList.dialog.textFooter") : ""
			}
		>
			<div
				className={classes.container}
				style={{ width: isXS ? "auto" : 400 }}
			>
				<TextField
					id="list-name"
					label={getTranslation("listPanel.createList.fieldLabel.listName")}
					value={name}
					handleChange={handleChange("name", setName)}
					autoFocus={true}
					dir={dir}
				/>
				{(canManageCategories || (!canManageCategories && size(categoriesNonProp) !== 0)) && (
					<div>
						{canManageCategories ? categoryList :
							<ClickAwayListener onClickAway={handleClickAway}>
								{categoryList}
							</ClickAwayListener>}
					</div>
				)}
				<CBCheckbox
					checked={!noPagination}
					handleChange={handleChange("noPagination", setNoPagination)}
					label={getTranslation("listPanel.createList.fieldLabel.paginate")}
					style={conditionalStyles.checkbox}
				/>
				<CBCheckbox
					checked={generateActivities}
					handleChange={handleChange("generateActivities", setGenerateActivities)}
					label={getTranslation("listPanel.createList.fieldLabel.generateRow")}
					style={conditionalStyles.checkbox}
				/>
			</div>
		</Dialog>
	);
};

export default withStyles(styles)(CreateList);
