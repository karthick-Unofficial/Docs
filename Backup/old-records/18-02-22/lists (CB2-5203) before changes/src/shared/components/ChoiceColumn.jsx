import React, { Component, Fragment } from "react";
import { SelectField, TextField } from "orion-components/CBComponents";
import { AddField } from "../../shared/components";
import { Button, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";

import _ from "lodash";

const styles = {
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

class ChoiceColumn extends Component {
	state = { newChoice: "", error: { add: false }, errorMessage: { add: "" } };

	componentDidMount() {
		const { options } = this.props;

		_.each(options, (option, index) =>
			this.setState({ [index]: option.value })
		);
	}

	componentDidUpdate(prevProps) {
		const { options } = this.props;
		if (prevProps.options !== options) {
			_.each(options, (option, index) =>
				this.setState({ [index]: option.value })
			);
			this.setState({ newChoice: "" });
		}
	}

	handleChange = name => event => {
		const {
			handleUpdateOption,
			options,
			handleThrowError,
			handleClearError
		} = this.props;
		const { error, errorMessage } = this.state;
		const value = event.target.value;
		const currentOptions = _.map(options, option => option.value);
		// Clear error state on value change
		if (name === "newChoice") {
			this.setState({
				error: { ...error, add: false },
				errorMessage: { ...errorMessage, add: "" },
				[name]: value
			});
		} else {
			this.setState({
				[name]: value,
				error: { ...error, [name]: false },
				errorMessage: { ...errorMessage, [name]: "" }
			});
		}
		// Clear error state in parent component
		handleClearError();
		// Check for duplicate choices and throw error
		if (_.includes(currentOptions, value) && name !== "newChoice") {
			this.setState({
				error: { ...error, [name]: true },
				errorMessage: {
					...errorMessage,
					[name]: `The choice, ${value} , already exists`
				}
			});
			// Update error state in parent component
			handleThrowError();
		}

		if (name !== "newChoice") handleUpdateOption(name, value);
	};

	handleAdd = value => {
		const { options, handleAddOption, handleThrowError } = this.props;
		const { error, errorMessage } = this.state;
		const currentOptions = _.map(options, option => option.value);
		// Check for duplicate choices and throw error
		if (_.includes(currentOptions, value)) {
			this.setState({
				error: { ...error, add: true },
				errorMessage: {
					...errorMessage,
					add: `The choice, ${value} , already exists`
				}
			});
			handleThrowError();
		} else {
			handleAddOption(value);
		}
	};

	checkAssignment = optionId => {
		const { rows, columnId } = this.props;
		const assignments = _.size(rows)
			? _.map(rows, row => row.data[columnId])
			: rows;
		return _.includes(assignments, optionId);
	};

	render() {
		const {
			classes,
			defaultValue,
			options,
			handleChange,
			handleRemoveOption,
			dir
		} = this.props;
		const { newChoice, error, errorMessage } = this.state;

		return (
			<Fragment>
				<SelectField
					id="default"
					label={<Translate value="shared.choiceColumn.fieldLabel.defaultValue"/>}
					handleChange={handleChange("defaultValue")}
					value={defaultValue}
					items={options}
					dir={dir}
				>
					<MenuItem value=""><Translate value="shared.choiceColumn.fieldLabel.none"/></MenuItem>
				</SelectField>
				<div style={{ marginLeft: 24, marginBottom: 24 }}>
					<AddField
						id="add-choice"
						label={<Translate value="shared.choiceColumn.fieldLabel.addNewChoice"/>}
						value={newChoice}
						handleChange={this.handleChange("newChoice")}
						handleSubmit={() => this.handleAdd(newChoice)}
						error={error.add}
						errorMessage={errorMessage.add}
						dir={dir}
					/>
					{_.map(options, (option, index) => {
						const assigned = this.checkAssignment(option.id);
						return (
							<div
								key={option.id}
								style={{
									display: "flex"
								}}
							>
								<TextField
									id={option.id}
									value={this.state[index] || ""}
									handleChange={this.handleChange(index)}
									error={error[index]}
									helperText={
										!assigned
											? errorMessage[index]
											: <Translate value="shared.choiceColumn.fieldLabel.unableToEdit"/>
									}
									disabled={assigned}
									dir={dir}
								/>

								<Button
									disabled={assigned}
									variant="text"
									className={dir == "rtl" ? classes.textRTL : classes.text}
									onClick={() => handleRemoveOption(option.id)}
								>
									<Translate value="shared.choiceColumn.fieldLabel.remove"/>
								</Button>
							</div>
						);
					})}
				</div>
			</Fragment>
		);
	}
}

export default withStyles(styles)(ChoiceColumn);
