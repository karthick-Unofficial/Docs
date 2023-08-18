import React, { Fragment, useState, useEffect } from "react";
import { SelectField, TextField } from "orion-components/CBComponents";
import { AddField } from "../../shared/components";
import { Button, MenuItem } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Translate, getTranslation } from "orion-components/i18n";

import each from "lodash/each";
import map from "lodash/map";
import includes from "lodash/includes";
import size from "lodash/size";

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

const ChoiceColumn = ({
	classes,
	defaultValue,
	options,
	handleChange,
	handleRemoveOption,
	dir,
	handleUpdateOption,
	handleThrowError,
	handleAddOption,
	handleClearError,
	rows,
	columnId
}) => {
	const [state, setState] = useState({});
	const [newChoice, setnewChoice] = useState("");
	const [error, setError] = useState({ add: false });
	const [errorMessage, setErrorMessage] = useState({ add: "" });

	useEffect(() => {
		each(options, (option, index) =>
			setState(prevState => ({
				...prevState,
				[index]: option.value
			}))
		);
		setnewChoice("");
	}, [options]);


	const inputChange = name => event => {
		const value = event.target.value;
		const currentOptions = map(options, option => option.value);
		// Clear error state on value change
		if (name === "newChoice") {
			setnewChoice(value);
			setError({ ...error, add: false });
			setErrorMessage({ ...errorMessage, add: "" });
		}
		else {
			setError({ ...error, [name]: false });
			setErrorMessage({ ...errorMessage, [name]: "" });
			setState(prevState => ({
				...prevState,
				[name]: value
			}));
		}
		// Clear error state in parent component
		handleClearError();
		// Check for duplicate choices and throw error
		if (includes(currentOptions, value) && name !== "newChoice") {
			setError({ ...error, [name]: true });
			setErrorMessage({
				...errorMessage,
				[name]: `The choice, ${value} , already exists`
			});
			// Update error state in parent component
			handleThrowError();
		}
		if (name !== "newChoice") handleUpdateOption(name, value);
	};

	const handleAdd = value => {
		const currentOptions = map(options, option => option.value);
		// Check for duplicate choices and throw error
		if (includes(currentOptions, value)) {
			setError({ ...error, add: true });
			setErrorMessage({
				...errorMessage,
				add: `The choice, ${value} , already exists`
			});
			handleThrowError();
		} else {
			handleAddOption(value);
		}
	};

	const checkAssignment = optionId => {
		const assignments = size(rows)
			? map(rows, row => row.data[columnId])
			: rows;
		return includes(assignments, optionId);
	};

	return (
		<Fragment>
			<SelectField
				id="default"
				label={getTranslation("shared.choiceColumn.fieldLabel.defaultValue")}
				handleChange={handleChange("defaultValue")}
				value={defaultValue}
				items={options}
				dir={dir}
			>
				<MenuItem value=""><Translate value="shared.choiceColumn.fieldLabel.none" /></MenuItem>
			</SelectField>
			<div style={{ marginLeft: 24, marginBottom: 24 }}>
				<AddField
					id="add-choice"
					label={getTranslation("shared.choiceColumn.fieldLabel.addNewChoice")}
					value={newChoice}
					handleChange={inputChange("newChoice")}
					handleSubmit={() => handleAdd(newChoice)}
					error={error.add}
					errorMessage={errorMessage.add}
					dir={dir}
				/>
				{map(options, (option, index) => {
					const assigned = checkAssignment(option.id);
					return (
						<div
							key={option.id}
							style={{
								display: "flex"
							}}
						>
							<TextField
								id={option.id}
								value={state[index] || ""}
								handleChange={inputChange(index)}
								error={error[index]}
								helperText={
									!assigned
										? errorMessage[index]
										: getTranslation("shared.choiceColumn.fieldLabel.unableToEdit")
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
								<Translate value="shared.choiceColumn.fieldLabel.remove" />
							</Button>
						</div>
					);
				})}
			</div>
		</Fragment>
	);
};

export default withStyles(styles)(ChoiceColumn);
