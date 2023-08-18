import React, { Component, Fragment } from "react";
import { default as Conditions } from "./components/conditions/ConditionContainer";
import TabSelection from "./components/tabs/TabSelection";
import DropdownSelection from "./components/dropdown/DropdownSelection";
import SingleSelection from "./components/single-selection/SingleSelection";
import MultiSelection from "./components/multi-selection/MultiSelection";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";


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
		buttonStyles:{
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

class GenericAttribute extends Component {

handleTabClick = (event) => {
	const { setProperty } = this.props;

	setProperty(event.props.value);
}

handleDropdownChange = (event, index, value) => {
	const { setProperty } = this.props;

	setProperty(value);
}

handleSingleSelect = (item) => {
	const { setProperty } = this.props;

	setProperty(item);
}

handleMultiSelect = (array) => {
	const { setProperty, value } = this.props;

	setProperty([...value, ...array]);
}

handleMultiRemove = (id) => {
	const { value } = this.props;
	const { setProperty } = this.props;

	const update = value.filter(item => item.id !== id);

	setProperty(update);
}

addCondition = newCondition => {
	const { setProperty, value } = this.props;

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
}

updateCondition = (updatedCondition, index) => {
	const { setProperty, value } = this.props;

	const conditions = value;
	conditions[index] = updatedCondition;

	setProperty(conditions);
};

deleteCondition = index => {
	const { setProperty, value } = this.props;

	const conditions = [...value];
	conditions.splice(index, 1);

	setProperty(conditions);
};

render () {
	const { 
		// General props
		type, 
		description, 
		inputType, 
		inputOptions, 
		value,

		// Single-selections specific props - Only needed if type is "single-selection"
		selectionType,
		searchProperty,
		openDialog
	} = this.props;

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
					addCondition={this.addCondition}
					deleteCondition={this.deleteCondition}
					updateCondition={this.updateCondition}
				/>
			</ErrorBoundary>
		) : (
			<div className="generic-attribute">
				<h4>{type.toUpperCase()}</h4>
				<p>{description}</p>

				{inputType === "tab" && (
					<ErrorBoundary>
						<TabSelection
							inputOptions={inputOptions}
							tabValue={value}
							handleClick={this.handleTabClick}
							styles={styles.tabs}
						/>
					</ErrorBoundary>

				)}

				{inputType === "dropdown" && (
					<ErrorBoundary>
						<DropdownSelection
							inputOptions={inputOptions}
							dropdownValue={value}
							handleChange={this.handleDropdownChange}
							styles={styles.dropdown}
						/>
					</ErrorBoundary>
				)}

				{inputType === "single-selection" && (
					<ErrorBoundary>
						<SingleSelection
							inputOptions={inputOptions}
							singleSelectValue={value}
							handleSelect={this.handleSingleSelect}
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
							handleSelect={this.handleMultiSelect}
							handleRemove={this.handleMultiRemove}
							selectionType={selectionType}
							searchProperty={searchProperty}
							openDialog={openDialog}
						/>
					</ErrorBoundary>
				)}
			</div>
		)
	);
}
}


export default GenericAttribute;