import React, { useState, useEffect } from "react";
import { Dialog, TextField } from "orion-components/CBComponents";
import { Button, useMediaQuery } from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";
import { AddField } from "../../shared/components";
import { Translate, getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";

//Actions
import { closeDialog } from "./categoryManagerActions";
import {
	createListCategory,
	updateListCategory,
	deleteListCategory
} from "./categoryManagerActions";

import { useDispatch, useSelector } from "react-redux";
import each from "lodash/each";
import pickBy from "lodash/pickBy";
import includes from "lodash/includes";
import map from "lodash/map";

const styles = {
	container: {
		display: "flex",
		flexDirection: "column"
	},
	text: {
		textTransform: "none",
		color: "#35b7f3",
		marginLeft: "auto"
	},
	textRTL: {
		textTransform: "none",
		color: "#35b7f3",
		marginRight: "auto"
	}
};

const CategoryManager = ({
	classes,
	canEdit
}) => {

	const [state, setState] = useState({});
	const [newCategory, setNewCategory] = useState("");
	const [removals, setRemovals] = useState([]);
	const [disabled, setDisabled] = useState(false);

	const dispatch = useDispatch();

	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const categories = useSelector(state => state.globalData.listCategories.data);
	const user = useSelector(state => state.session.user.profile);
	const dir = useSelector(state => getDir(state));

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	useEffect(() => {
		each(categories, category => {
			setState({
				...state,
				[category.id]: category.name
			});
		});
	}, []);

	useEffect(() => {
		each(categories, category => {
			setState(prevState => ({
				...prevState,
				[category.id]: category.name
			}));
		});
	}, [categories]);

	const handleChange = key => event => {
		const value = event.target.value;
		if (key === "newCategory") {
			setNewCategory(value);
		}
		else {
			setState(prevState => ({
				...prevState,
				[key]: value
			}));
		}

		if (key !== "newCategory") {
			setDisabled(!value ? true : false);
		}
	};

	const handleRemove = id => {
		setRemovals([...removals, id]);

		if (!state[id] && disabled) {
			setDisabled(false);
		}
	};

	const handleConfirm = () => {

		const newCategories = { ...categories };
		each(removals, id => dispatch(deleteListCategory(id)));
		each(newCategories, (category, key) => {
			const localValue = state[key];
			if (localValue && localValue !== category.name) {
				category.name = localValue;
				dispatch(updateListCategory(category.id, category.name));
			}
		});
		handleClose();
	};

	const handleClose = () => {
		dispatch(closeDialog("categoryManager"));
		each(categories, (category, key) =>
			setState(prevState => ({
				...prevState,
				[key]: category.name
			}))
		);
		setNewCategory("");
		setRemovals([]);
	};

	const handleCreate = () => {
		dispatch(createListCategory(newCategory));
		setNewCategory("");

	};

	const availableCategories =
		pickBy(
			categories,
			category => {
				return category.ownerOrg === user.orgId && !includes(removals, category.id);
			}
		);

	return (
		<Dialog
			key="category-manager"
			open={dialog === "categoryManager"}
			confirm={{ label: getTranslation("listPanel.categoryManager.ok"), action: handleConfirm, disabled }}
			abort={{ label: getTranslation("listPanel.categoryManager.cancel"), action: handleClose }}
		>
			<div
				className={classes.container}
				style={{ width: isXS ? "auto" : 350 }}
			>
				<div style={{ marginBottom: 60, width: "85%" }}>
					<AddField
						id="new-category"
						label={getTranslation("listPanel.categoryManager.fieldLabel.addCategory")}
						value={newCategory}
						handleChange={handleChange("newCategory")}
						handleSubmit={handleCreate}
						dir={dir}
					/>
				</div>
				{map(availableCategories, category => (
					<div
						key={category.id}
						style={{
							marginBottom: 30,
							display: "flex"
						}}
					>
						<TextField
							id={category.id}
							value={state[category.id] || ""}
							disabled={!canEdit}
							handleChange={handleChange(category.id)}
							dir={dir}
						/>
						{canEdit ?
							<Button
								variant="text"
								className={dir == "rtl" ? classes.textRTL : classes.text}
								onClick={() => handleRemove(category.id)}
							>
								<Translate value="listPanel.categoryManager.remove" />
							</Button>
							:
							<div
								style={{
									minheight: 36,
									minWidth: 64
								}}
								className={dir == "rtl" ? classes.textRTL : classes.text}>
							</div>
						}
					</div>
				))}
			</div>
		</Dialog>
	);
};

export default withStyles(styles)(CategoryManager);
