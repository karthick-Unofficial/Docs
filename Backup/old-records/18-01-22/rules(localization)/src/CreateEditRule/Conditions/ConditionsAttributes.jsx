import React, { Component } from "react";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";

// components
import ConditionDialog from "./components/ConditionDialog";

// misc
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

class ConditionsAttributes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			editingIndex: null
		};
	}

	handleClick = () => {
		this.props.openDialog("condition-dialog");
	};

	handleCancelClick = () => {
		this.props.closeDialog("condition-dialog");
		this.setState({
			editing: false,
			editingIndex: null
		});
	};

	handleDeleteClick = (e, index) => {
		e.stopPropagation();
		this.props.deleteCondition(index);
	};

	handleConditionClick = index => {
		this.props.openDialog("condition-dialog");
		this.setState({
			editing: true,
			editingIndex: index
		});
	};

	_addCondition = newCondition => {
		this.props.addCondition(newCondition);
		this.props.closeDialog("condition-dialog");
	};

	_updateCondition = updatedCondition => {
		this.props.updateCondition(updatedCondition, this.state.editingIndex);
		this.props.closeDialog("condition-dialog");
		this.setState({
			editing: false,
			editingIndex: null
		});
	};

	_capitalize = string => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	render() {
		const {
			entityCollections,
			styles,
			conditions,
			landUnitSystem,
			timeFormatPreference
		} = this.props;

		const conditionsAddActions = [
			<FlatButton
				style={styles.buttonStyles}
				label={<Translate value="createEditRule.conditions.main.cancel"/>}
				onClick={this.handleConditionDialogClose}
				primary={true}
			/>,
			<FlatButton
				style={styles.buttonStyles}
				label={<Translate value="createEditRule.conditions.main.addCondition"/>}
				onClick={() => this.handleAddCondition()}
				primary={true}
			/>
		];

		return (
			<div className="generic-attribute">
				<h4><Translate value="createEditRule.conditions.main.title"/></h4>
				<List className="rule-attributes-list">
					{conditions.map((condition, index) => (
						<ListItem
							key={index}
							onClick={() => this.handleConditionClick(index)}
							primaryText={
								condition.type === "in-collection"
									? <Translate value="createEditRule.conditions.main.inCollection" count={entityCollections[condition.id].name}/> 
									: condition.type === "not-in-collection"
										? <Translate value="createEditRule.conditions.main.notInCollection" count={entityCollections[condition.id].name}/> 
										: <Translate value="createEditRule.conditions.main.condition" count={this._capitalize(condition.type)}/>
							}
							leftIcon={
								condition.type === "duration" ? (
									<i className="material-icons" style={{ color: "tomato" }} />
								) : (
									<i
										className="material-icons"
										style={{ color: "tomato" }}
										onClick={e => this.handleDeleteClick(e, index)}
									>
										clear
									</i>
								)
							}
						/>
					))}
					{conditions.length > 0 ? (
						<ListItem
							className="add-rule-attribute"
							primaryText={<Translate value="createEditRule.conditions.main.addAnother"/>}
							onClick={this.handleClick}
							leftIcon={
								<i className="material-icons" style={{ color: "#35b7f3" }}>
									add
								</i>
							}
						/>
					) : (
						<ListItem
							className="add-rule-attribute"
							primaryText={<Translate value="createEditRule.conditions.main.addACondition"/>}
							onClick={this.handleClick}
							leftIcon={
								<i className="material-icons" style={{ color: "#35b7f3" }}>
									add
								</i>
							}
						/>
					)}
				</List>

				<ConditionDialog
					modal={true}
					conditions={conditions}
					availableConditions={this.props.availableConditions}
					contentStyle={styles.dialogStyles}
					isOpen={this.props.isOpen === "condition-dialog"}
					closeDialog={this.handleCancelClick}
					addCondition={this._addCondition}
					updateCondition={this._updateCondition}
					editing={this.state.editing}
					editingIndex={this.state.editingIndex}
					entityCollections={entityCollections}
					autoScrollBodyContent={true}
					actions={conditionsAddActions}
					landUnitSystem={landUnitSystem}
					timeFormatPreference={timeFormatPreference}
				/>
			</div>
		);
	}
}

export default ConditionsAttributes;
