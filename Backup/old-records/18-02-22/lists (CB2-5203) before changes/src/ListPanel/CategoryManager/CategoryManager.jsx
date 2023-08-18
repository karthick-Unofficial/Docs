import React, { Component } from "react";
import { Dialog, TextField } from "orion-components/CBComponents";
import { withWidth, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { AddField } from "../../shared/components";
import { Translate } from "orion-components/i18n/I18nContainer";

import _ from "lodash";

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

class CategoryManager extends Component {
	state = {};

	componentDidMount() {
		const { categories } = this.props;

		_.each(categories, category => {
			this.setState({ [category.id]: category.name });
		});

		this.setState({ newCategory: "", removals: [] });
	}

	componentDidUpdate(prevProps) {
		const { categories } = this.props;
		if (categories !== prevProps.categories)
			_.each(categories, category => {
				if (!this.state[category.id])
					this.setState({ [category.id]: category.name });
			});
	}

	handleChange = key => event => {
		const value = event.target.value;
		this.setState({ [key]: value });
		if (key !== "newCategory")
			this.setState({ disabled: !value ? true : false });
	};

	handleRemove = id => {
		const { removals, disabled } = this.state;
		this.setState({ removals: [...removals, id] });
		if (!this.state[id] && disabled) this.setState({ disabled: false });
	};

	handleConfirm = () => {
		const { categories, updateListCategory, deleteListCategory } = this.props;
		const { removals } = this.state;
		const newCategories = { ...categories };
		_.each(removals, id => deleteListCategory(id));
		_.each(newCategories, (category, key) => {
			const localValue = this.state[key];
			if (localValue && localValue !== category.name) {
				category.name = localValue;
				updateListCategory(category.id, category.name);
			}
		});

		this.handleClose();
	};

	handleClose = () => {
		const { closeDialog, categories } = this.props;
		closeDialog("categoryManager");
		_.each(categories, (category, key) =>
			this.setState({ [key]: category.name })
		);
		this.setState({ newCategory: "", removals: [] });
	};

	handleCreate = () => {
		const { createListCategory } = this.props;
		const { newCategory } = this.state;
		createListCategory(newCategory);
		this.setState({ newCategory: "" });
	};

	render() {
		const { classes, width, categories, dialog, canEdit, user, dir } = this.props;
		const { newCategory, removals, disabled } = this.state;

		const availableCategories = _.pickBy(
			categories,
			category => {
				return category.ownerOrg === user.orgId && !_.includes(removals, category.id);
			}
		);

		return (
			<Dialog
				key="category-manager"
				open={dialog === "categoryManager"}
				confirm={{ label: <Translate value="listPanel.categoryManager.ok"/>, action: this.handleConfirm, disabled }}
				abort={{ label: <Translate value="listPanel.categoryManager.cancel"/>, action: this.handleClose }}
			>
				<div
					className={classes.container}
					style={{ width: width === "xs" ? "auto" : 350 }}
				>
					<div style={{ marginBottom: 60, width: "85%" }}>
						<AddField
							id="new-category"
							label={<Translate value="listPanel.categoryManager.fieldLabel.addCategory"/>}
							value={newCategory}
							handleChange={this.handleChange("newCategory")}
							handleSubmit={this.handleCreate}
							dir={dir}
						/>
					</div>
					{_.map(availableCategories, category => (
						<div
							key={category.id}
							style={{
								marginBottom: 30,
								display: "flex"
							}}
						>
							<TextField
								id={category.id}
								value={this.state[category.id] || ""}
								disabled={!canEdit}
								handleChange={this.handleChange(category.id)}
								dir={dir}
							/>
							{canEdit ?							
								<Button
									variant="text"
									className={dir == "rtl" ? classes.textRTL : classes.text}
									onClick={() => this.handleRemove(category.id)}
								>
								<Translate value="listPanel.categoryManager.remove"/>
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
	}
}

export default withStyles(styles)(withWidth()(CategoryManager));
