import React, { Component, Fragment } from "react";
import { hashHistory } from "react-router";

import _ from "lodash";
import ErrorBoundary from "orion-components/ErrorBoundary";

import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import GenericAttribute from "../GenericAttribute/GenericAttribute";
import EscalationAttributes from "../Escalations/EscalationAttributes";

import { default as filterAssignments } from "../utils/filterAssignments";
import { Translate } from "orion-components/i18n/I18nContainer";


class VesselEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trigger: "berth-assignment-created",
			targets: [],
			conditions: [],
			escalationEvent: ""
		};
	}

	UNSAFE_componentWillMount() {
		const { editMode, params, rules, getAllBerths } = this.props;

		getAllBerths();

		if (editMode) {
			const ruleId = params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = _.cloneDeep(rules.find(rule => rule.id === ruleId));

			this.setState({
				trigger: rule.trigger,
				targets: rule.targets,
				conditions: rule.conditions,
				escalationEvent: rule.escalationEvent
			});
		}
	}
	
	// Curried function to allow children (GenericAttribute components)
	// to set parent state. This lets you build your rule dynamically 
	// based on the trigger type selected
	setProperty = (key) => (value) => {

		if (key === "trigger") {
			// Reset all state when trigger is changed
			return this.setState({
				[key]: value,
				targets: [],
				conditions: [],
				escalationEvent: ""
			});
		}
		
		this.setState({[key]: value});
	}
	
	handleSaveClick = () => {
		const { editMode } = this.props;

		if (editMode) {
			this._updateRule();
		} else {
			this._addRule();
		}
	};

	_cancelAndHome = () => {
		const { editMode, params, removeContext } = this.props;

		if (editMode && params.id) {
			removeContext(params.id);
		}
		
		hashHistory.push("/");
	};

	_updateRule = () => {
		const { 
			title,
			params,
			desc,
			audioSettings,
			dismissForOrg,
			updateTitleErrorMessage,
			validateAudioSettings,
			updateRule,
			removeContext,
			assignments,
			rules
		} = this.props;
		const {targets, trigger, conditions, escalationEvent} = this.state;
		const { assignments: oldAssignments } = rules.find(
			rule => rule.id === params.id
		);
		const filteredAssignments = filterAssignments(
			oldAssignments,
			assignments
		);
		
		if (!title.length) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			updateRule(
				params.id,
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				[], // subject
				trigger,
				targets,
				conditions,
				escalationEvent,
				filteredAssignments
			);
			removeContext(this.props.params.id);
			hashHistory.push("/");
		}
	};

	_addRule = () => {
		const {
			title,
			desc,
			audioSettings,
			dismissForOrg,
			user,
			addRule,
			updateTitleErrorMessage,
			validateAudioSettings,
			assignments
		} = this.props;
		const { targets, trigger, conditions, escalationEvent } = this.state;

		const filteredAssignments = filterAssignments(
			{},
			assignments
		);

		if (!title.length) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			addRule(
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				[], // subject
				trigger,
				targets,
				conditions,
				escalationEvent,
				filteredAssignments,
				user.profile.id,
				user.profile.orgId,
				"vessel-event",
				user.profile.name
			);
			hashHistory.push("/");
		}
	};

	_addEscalation = selectedEvent => {
		this.setState({
			escalationEvent: selectedEvent.id
		});
	};

	_deleteEscalation = () => {
		this.setState({
			escalationEvent: ""
		});
	};

	render() {
		const { trigger, targets, conditions } = this.state;
		const { 
			openDialog,
			berths,
			entityCollections,
			timeFormatPreference
		} = this.props;
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

		const getAttributes = () => {
			switch (trigger) {
				case "berth-assignment-created": {
					return (
						<Fragment>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Conditions"}
											inputType={"conditions"}
											inputOptions={["time"]}
											setProperty={this.setProperty("conditions")}
											openDialog={openDialog}
											value={conditions}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationAttributes
											isOpen={this.props.isOpen}
											openDialog={this.props.openDialog}
											closeDialog={this.props.closeDialog}
											styles={styles}
											addEscalation={this._addEscalation}
											escalationEvent={this.state.escalationEvent}
											deleteEscalation={this._deleteEscalation}
											updateEscalation={this._updateEscalation}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</Fragment>
						
					);
				}
				case "berth-assignment-approval": {
					return (
						<Fragment>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Conditions"}
											inputType={"conditions"}
											inputOptions={["time"]}
											setProperty={this.setProperty("conditions")}
											openDialog={openDialog}
											value={conditions}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationAttributes
											isOpen={this.props.isOpen}
											openDialog={this.props.openDialog}
											closeDialog={this.props.closeDialog}
											styles={styles}
											addEscalation={this._addEscalation}
											escalationEvent={this.state.escalationEvent}
											deleteEscalation={this._deleteEscalation}
											updateEscalation={this._updateEscalation}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</Fragment>
					);
				}
				case "berth-assignment-update": {
					return (
						<Fragment>
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Berth Selection"}
											description={<Translate value="createEditRule.vesselEvents.selectBerth"/>}
											inputType={"multi-selection"}
											inputOptions={berths} // TODO: Pass real data
											selectionType={"berth"}
											setProperty={this.setProperty("targets")}
											searchProperty={"name"}
											openDialog={openDialog}
											value={targets}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Conditions"}
											inputType={"conditions"}
											inputOptions={["time"]}
											setProperty={this.setProperty("conditions")}
											openDialog={openDialog}
											value={conditions}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationAttributes
											isOpen={this.props.isOpen}
											openDialog={this.props.openDialog}
											closeDialog={this.props.closeDialog}
											styles={styles}
											addEscalation={this._addEscalation}
											escalationEvent={this.state.escalationEvent}
											deleteEscalation={this._deleteEscalation}
											updateEscalation={this._updateEscalation}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</Fragment>
					);
				}
				case "arrival": {
					return (
						<Fragment>
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Berth Selection"}
											description={<Translate value="createEditRule.vesselEvents.selectBerth"/>}
											inputType={"multi-selection"}
											inputOptions={berths} // TODO: Pass real data
											selectionType={"berth"}
											setProperty={this.setProperty("targets")}
											searchProperty={"name"}
											openDialog={openDialog}
											value={targets}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Conditions"}
											inputType={"conditions"}
											inputOptions={[
												"time",
												"in-collection",
												"not-in-collection"
											]}
											setProperty={this.setProperty("conditions")}
											openDialog={openDialog}
											value={conditions}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationAttributes
											isOpen={this.props.isOpen}
											openDialog={this.props.openDialog}
											closeDialog={this.props.closeDialog}
											styles={styles}
											addEscalation={this._addEscalation}
											escalationEvent={this.state.escalationEvent}
											deleteEscalation={this._deleteEscalation}
											updateEscalation={this._updateEscalation}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</Fragment>
					);
				}
				case "departure": {
					return (
						<Fragment>
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Berth Selection"}
											description={<Translate value="createEditRule.vesselEvents.selectBerth"/>}
											inputType={"multi-selection"}
											inputOptions={berths} // TODO: Pass real data
											selectionType={"berth"}
											setProperty={this.setProperty("targets")}
											searchProperty={"name"}
											openDialog={openDialog}
											value={targets}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Conditions"}
											inputType={"conditions"}
											inputOptions={[
												"time",
												"in-collection",
												"not-in-collection"
											]}
											setProperty={this.setProperty("conditions")}
											openDialog={openDialog}
											value={conditions}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationAttributes
											isOpen={this.props.isOpen}
											openDialog={this.props.openDialog}
											closeDialog={this.props.closeDialog}
											styles={styles}
											addEscalation={this._addEscalation}
											escalationEvent={this.state.escalationEvent}
											deleteEscalation={this._deleteEscalation}
											updateEscalation={this._updateEscalation}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</Fragment>
					);
				}
				case "berth-security-violation": {
					return (
						<Fragment>
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Berth Selection"}
											description={<Translate value="createEditRule.vesselEvents.selectBerth"/>}
											inputType={"multi-selection"}
											inputOptions={berths} // TODO: Pass real data
											selectionType={"berth"}
											setProperty={this.setProperty("targets")}
											searchProperty={"name"}
											openDialog={openDialog}
											value={targets}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<GenericAttribute
											type={"Conditions"}
											inputType={"conditions"}
											inputOptions={[
												"time",
												"in-collection",
												"not-in-collection"
											]}
											setProperty={this.setProperty("conditions")}
											openDialog={openDialog}
											value={conditions}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationAttributes
											isOpen={this.props.isOpen}
											openDialog={this.props.openDialog}
											closeDialog={this.props.closeDialog}
											styles={styles}
											addEscalation={this._addEscalation}
											escalationEvent={this.state.escalationEvent}
											deleteEscalation={this._deleteEscalation}
											updateEscalation={this._updateEscalation}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</Fragment>
					);
				}
				default:
					break;
			}
		};

		return (
			<div>
				<SubmitControls
					cancelAndHome={this._cancelAndHome}
					handleSaveClick={this.handleSaveClick}
				/>

				<div className="mobile-content-divider" />

				<div className="row">
					<div className="row-item fullwidth">
						<div className="rule-states">
							<span><Translate value="createEditRule.vesselEvents.ruleStates"/></span>
							<h2 id="rule-string">
								{ruleBuilder(
									{
										targets,
										subject: [],
										conditions,
										trigger,
										type: "vessel-event",
										timeFormatPreference
									},
									Object.values(entityCollections),
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
						<div className="rule-attributes-section">
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									{/* All Vessel Event rules have a type that determines what other attributes they'll have */}
									<ErrorBoundary>
										<GenericAttribute
											type={"Type"}
											description={<Translate value="createEditRule.vesselEvents.selectRuleType"/>}
											inputType={"dropdown"}
											inputOptions={[
												{value: "berth-assignment-created", label: "New Request"},
												{value: "berth-assignment-approval", label: "Request Approval"},
												{value: "berth-assignment-update", label: "Berth Updates"},
												{value: "arrival", label: "Arrivals"},
												{value: "departure", label: "Departures"},
												{value: "berth-security-violation", label: "Security Violations"}
											]}
											setProperty={this.setProperty("trigger")}
											value={trigger}
										/>
									</ErrorBoundary>
								</div>
							</div>

							{/* Get specific rule attributes based on trigger type */}
							{getAttributes()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default VesselEvent;
