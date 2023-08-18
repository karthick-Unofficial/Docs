import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

import ConditionsAttributes from "../Conditions/ConditionsAttributes";
import TriggerContainer from "../Trigger/TriggerContainer";

import { hashHistory } from "react-router";

// misc
import _ from "lodash";
import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import { default as filterAssignments } from "../utils/filterAssignments";
import { Translate } from "orion-components/i18n/I18nContainer";


class SystemHealth extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	UNSAFE_componentWillMount() {
		if (this.props.editMode) {
			const ruleId = this.props.params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = _.cloneDeep(this.props.rules.find(rule => rule.id === ruleId));

			this.setState({
				trigger: rule.trigger,
				trackList: [],
				selectedEvents: [],
				dialogOpen: false,
				dialogAOpen: false,
				triggerTabValue: rule.targets.length === 0 ? "b1" : "b2",
				targets: rule.targets,
				shapeList: [],
				triggerSelections: [],
				hoveredTarget: "",
				hoveredCondition: "",
				title: rule.title,
				desc: rule.desc,
				audioSettings: rule.audioSettings,
				dismissForOrg: rule.dismissForOrg,
				conditions: rule.conditions
			});
		} else {
			const endOfYear = new Date();
			endOfYear.setMonth(11);
			endOfYear.setDate(31);

			this.setState({
				title: "",
				desc: "",
				audioSettings: {
					speakAlertText: true,
					alertText: "Alert, Alert",
					speakAlertNotification: true
				},
				dismissForOrg: true,
				statement: "",
				isPriority: false,
				notifySystem: false,
				notifyEmail: false,
				notifyPush: false,
				trigger: "system-health-change",
				targets: [],
				conditions: [],
				titleErrorText: "",
				triggerTabValue: "b1",
				trackList: [],
				shapeList: [],
				dialogOpen: false,
				dialogAOpen: false,
				triggerSelections: [],
				selectedEvents: [],
				hoveredTarget: "",
				hoveredCondition: ""
			});
		}
	}

	_addTargets = triggerSelections => {
		this.setState({
			targets: this.state.targets.concat(triggerSelections),
			triggerSelections: []
		});
	};

	_removeTarget = entity => {
		const triggerArray = this.state.targets;
		const index = triggerArray.indexOf(entity);
		triggerArray.splice(index, 1);
		this.setState({
			targets: triggerArray
		});
	};

	_addCondition = newCondition => {
		const conditions = [...this.state.conditions, newCondition];
		const sortedConditions = conditions.sort((a, b) => {
			if (a.type === "time" && b.type === "time") {
				return 0;
			} else if (a.type === "time") {
				return 1;
			} else {
				return -1;
			}
		});
		this.setState({
			conditions: sortedConditions
		});
	};

	_updateCondition = (updatedCondition, index) => {
		const conditions = this.state.conditions;
		conditions[index] = updatedCondition;
		this.setState({
			conditions
		});
	};

	_deleteCondition = index => {
		const conditions = [...this.state.conditions];
		conditions.splice(index, 1);
		this.setState({
			conditions
		});
	};

	_toggleTriggerTab = value => {
		this.setState({
			triggerTabValue: value
		});
	};

	handleSaveClick = () => {
		if (this.props.editMode) {
			this._updateRule();
		} else {
			this._addRule();
		}
	};

	_updateRule = () => {
		const { assignments } = this.props;

		if (_.isEmpty(this.props.title)) {
			this.props.updateTitleErrorMessage("This field is Required");
		} else if (this.props.validateAudioSettings()) {
			const filteredAssignments = filterAssignments(assignments);
			this.props.updateRule(
				this.props.params.id,
				this.props.title,
				this.props.desc,
				this.props.audioSettings,
				this.props.dismissForOrg,
				document.getElementById("rule-string").textContent,
				// If 'any polygon' or 'any track' is selected, defualt to empty arrays
				[], // --< subject
				this.state.trigger,
				this.state.triggerTabValue === "b1" ? [] : this.state.targets,
				this.state.conditions,
				filteredAssignments
			);
			this.props.removeContext(this.props.params.id);
			hashHistory.push("/");
		}
	};

	_addRule = () => {
		const { assignments } = this.props;

		if (_.isEmpty(this.props.title)) {
			this.props.updateTitleErrorMessage("This field is Required");
		} else if (this.props.validateAudioSettings()) {
			const filteredAssignments = filterAssignments(assignments);
			this.props.addRule(
				this.props.title,
				this.props.desc,
				this.props.audioSettings,
				this.props.dismissForOrg,
				document.getElementById("rule-string").textContent,
				// If 'any polygon' or 'any track' is selected, default to empty arrays
				[], // < -- subject
				this.state.trigger,
				this.state.triggerTabValue === "b1" ? [] : this.state.targets,
				this.state.conditions,
				filteredAssignments,
				this.props.user.profile.id,
				this.props.user.profile.orgId,
				"system-health",
				this.props.user.profile.name
			);
			hashHistory.push("/");
		}
	};

	_cancelAndHome = () => {
		if (this.props.editMode && this.props.params.id) {
			this.props.removeContext(this.props.params.id);
		}
		hashHistory.push("/");
	};

	handleChangeTrigger = (event, index, value) =>
		this.setState({ trigger: value });

	handleTargetHover = index => {
		this.setState({
			hoveredTarget: index
		});
	};

	handleConditionHover = index => {
		this.setState({
			hoveredCondition: index
		});
	};

	render() {
		const { entityCollections, timeFormatPreference } = this.props;
		const { targets, subject, conditions, trigger } = this.state;
		const isMobile = window.matchMedia("(max-width: 600px)").matches;

		const styles = {
			contentContainerStyle: {
				marginBottom: "6px"
			},
			tabButton: {
				textTransform: "normal"
			},
			inkBar: {
				height: 0
			},
			dialogStyles: {
				border: "none",
				maxHeight: "500px",
				maxWidth: "500px"
			},
			buttonStyles: isMobile
				? {
					fontSize: "13px"
				  }
				: {},
			listItemStyles: {
				backgroundColor: "#41454A"
			}
		};
		const disableSave =
			this.state.triggerTabValue === "b2" && this.state.targets.length === 0
				? true
				: false;
		return (
			<div>
				<SubmitControls
					cancelAndHome={this._cancelAndHome}
					disabled={disableSave}
					handleSaveClick={this.handleSaveClick}
				/>

				<div className="mobile-content-divider" />

				<div className="row">
					<div className="row-item fullwidth">
						<div className="rule-states">
							<span><Translate value="createEditRule.systemHealth.ruleStates"/></span>
							<h2 id="rule-string">
								{ruleBuilder(
									{
										targets,
										subject,
										conditions,
										trigger,
										type: "system-health",
										timeFormatPreference
									},
									entityCollections,
									null,
									false
								)}
							</h2>
						</div>
					</div>
				</div>

				<div className="mobile-content-divider" />

				<div className="row">
					<div className="row-item fullwidth">
						<div className="rule-sections-edit">
							<ErrorBoundary>
								<TriggerContainer
									isOpen={this.props.isOpen}
									openDialog={this.props.openDialog}
									closeDialog={this.props.closeDialog}
									availableTargets={this.props.systemHealthEvents}
									replace="system"
									targetType="system-health"
									displayName="system"
									styles={styles}
									targets={this.state.targets}
									handleChangeTrigger={this.handleChangeTrigger}
									handleTargetHover={this.handleTargetHover}
									addTargets={this._addTargets}
									entity={"shapes"}
									removeTarget={this._removeTarget}
									tabValue={this.state.triggerTabValue}
									toggleTriggerTab={this._toggleTriggerTab}
								/>
							</ErrorBoundary>
							<ErrorBoundary>
								<ConditionsAttributes
									isOpen={this.props.isOpen}
									openDialog={this.props.openDialog}
									closeDialog={this.props.closeDialog}
									styles={styles}
									conditions={this.state.conditions}
									availableConditions={["time"]}
									handleConditionHover={this.handleConditionHover}
									entityCollections={this.props.entityCollections}
									addCondition={this._addCondition}
									deleteCondition={this._deleteCondition}
									updateCondition={this._updateCondition}
									timeFormatPreference={timeFormatPreference}
								/>
							</ErrorBoundary>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SystemHealth;
