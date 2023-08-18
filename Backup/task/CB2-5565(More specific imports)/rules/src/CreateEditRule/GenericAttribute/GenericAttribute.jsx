import React from "react";
import { default as Conditions } from "./components/conditions/Condition";
import TabSelection from "./components/tabs/TabSelection";
import DropdownSelection from "./components/dropdown/DropdownSelection";
import SingleSelection from "./components/single-selection/SingleSelection";
import MultiSelection from "./components/multi-selection/MultiSelection";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Translate } from "orion-components/i18n";


const styles = {
	tabs: {
		contentContainerStyle: {
			marginBottom: "6px"
		},
		inkBar: {
			height: 0
		},
		tabButton: {
			textTransform: "normal"
		}
	},
	conditions: {
		dialogStyles: {
			border: "none",
			maxHeight: "500px",
			maxWidth: "500px"
		},
		buttonStyles: {
			fontSize: "13px"
		}
	},
	dropdown: {
		main: {
			color: "white",
			borderRadius: 5,
			border: 0,
			width: "100%",
			backgroundColor: "#1F1F21"
		},
		label: { margin: 0, padding: "0 16px" },
		menuItem: { color: "white", backgroundColor: "#1F1F21" },
		list: { backgroundColor: "#1F1F21" },
		underline: { border: "none", margin: 0 }
	}
};

const GenericAttribute = ({
	setProperty,
	// General props
	type,
	description,
	inputType,
	inputOptions,
	value,
	// Single-selections specific props - Only needed if type is "single-selection"
	selectionType,
	searchProperty,
	openDialog,
	dir
}) => {

	const handleTabClick = (event, tab) => {
		setProperty(tab);
	};

	const handleDropdownChange = (event) => {
		setProperty(event.target.value);
	};

	const handleSingleSelect = (item) => {
		setProperty(item);
	};

	const handleMultiSelect = (array) => {
		setProperty([...value, ...array]);
	};

	const handleMultiRemove = (id) => {
		const update = value.filter(item => item.id !== id);

		setProperty(update);
	};

	const addCondition = newCondition => {
		const conditions = [...value, newCondition];

		const sortedConditions = conditions.sort((a, b) => {
			if (a.type === "time" && b.type === "time") {
				return 0;
			} else if (a.type === "time") {
				return 1;
			} else {
				return -1;
			}
		});

		setProperty(sortedConditions);
	};

	const updateCondition = (updatedCondition, index) => {
		const conditions = value;
		conditions[index] = updatedCondition;

		setProperty(conditions);
	};

	const deleteCondition = index => {
		const conditions = [...value];
		conditions.splice(index, 1);

		setProperty(conditions);
	};


	return (
		// Conditions still uses old component and therefore already has a title and description
		// Once it's converted to a generic component, we can remove this and use it the same way
		// as other input types
		inputType === "conditions" ? (
			<ErrorBoundary>
				<Conditions
					styles={styles.conditions}
					conditions={value}
					inputOptions={inputOptions}
					addCondition={addCondition}
					deleteCondition={deleteCondition}
					updateCondition={updateCondition}
					dir={dir}
				/>
			</ErrorBoundary>
		) : (
			<div className="generic-attribute">
				<h4>{<Translate value={`createEditRule.genericAttribute.type.${type}`} />}</h4>
				<p>{description}</p>

				{inputType === "tab" && (
					<ErrorBoundary>
						<TabSelection
							inputOptions={inputOptions}
							tabValue={value}
							handleClick={handleTabClick}
							styles={styles.tabs}
						/>
					</ErrorBoundary>

				)}

				{inputType === "dropdown" && (
					<ErrorBoundary>
						<DropdownSelection
							inputOptions={inputOptions}
							dropdownValue={value}
							handleChange={handleDropdownChange}
							styles={styles.dropdown}
							dir={dir}
						/>
					</ErrorBoundary>
				)}

				{inputType === "single-selection" && (
					<ErrorBoundary>
						<SingleSelection
							inputOptions={inputOptions}
							singleSelectValue={value}
							handleSelect={handleSingleSelect}
							selectionType={selectionType}
							searchProperty={searchProperty}
							openDialog={openDialog}
						/>
					</ErrorBoundary>
				)}

				{inputType === "multi-selection" && (
					<ErrorBoundary>
						<MultiSelection
							inputOptions={inputOptions}
							multiSelectValues={value}
							handleSelect={handleMultiSelect}
							handleRemove={handleMultiRemove}
							selectionType={selectionType}
							searchProperty={searchProperty}
							openDialog={openDialog}
						/>
					</ErrorBoundary>
				)}
			</div>
		)
	);
};

export default GenericAttribute;