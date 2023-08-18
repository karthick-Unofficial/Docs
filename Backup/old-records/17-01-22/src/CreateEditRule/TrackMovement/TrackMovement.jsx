import React, { Component } from "react";
import { feedService, shapeService } from "client-app-core";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import ConditionsAttributes from "../Conditions/ConditionsAttributes";
import EscalationAttributes from "../Escalations/EscalationAttributes";
import SubjectContainer from "../Subject/SubjectContainer";
import TriggerContainer from "../Trigger/TriggerContainer";
import CircularProgress from "material-ui/CircularProgress";
import { hashHistory } from "react-router";

// misc
import _ from "lodash";
import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import { default as filterAssignments } from "../utils/filterAssignments";

class TrackMovement extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	UNSAFE_componentWillMount() {
		let loadingSubject = false;
		let loadingTarget = false;

		// If there are query params used to pre-fill state
		if (location.hash.split("?")[1]) {
			const params = location.hash.split("?")[1].split("&");
			const parsed = params.reduce((a, b) => {
				return { ...a, [b.split("=")[0]]: b.split("=")[1] };
			}, {});

			const queryTargetIds = parsed.createTargets
				? parsed.createTargets.split(",")
				: [];
			const querySubjectIds = parsed.createSubjects
				? parsed.createSubjects.split(",")
				: [];

			if (querySubjectIds.length) {
				loadingSubject = true;

				feedService.getFeedEntitiesByIds(querySubjectIds, (err, result) => {
					if (err) {
						console.log("Error retrieving subjects for rule:", err);
						this.setState({
							subject: [],
							loading: loadingTarget || false
						});
					} else {
						const namedSubjects = result.map(track => {
							track.name = track.entityData.properties.name;
							return track;
						});

						loadingSubject = false;

						this.setState({
							subject: [...namedSubjects],
							subjectTabValue: namedSubjects[0] ? "a2" : "a1",
							loading: loadingSubject || loadingTarget
						});
					}
				});
			} else if (queryTargetIds.length) {
				loadingTarget = true;

				shapeService.getMultipleById(queryTargetIds, (err, result) => {
					if (err) {
						console.log("Error retrieving targets for rule:", err);
						this.setState({
							targets: [],
							loading: loadingSubject || false
						});
					} else {
						loadingTarget = false;
						let type = "";
						if (result[0] && result[0].entityData.type) {
							type = result[0].entityData.type;
						}
						this.setState({
							targets: [...result],
							triggerTabValue: result[0] ? "b2" : "b1",
							loading: loadingTarget || loadingSubject,
							trigger: type === "LineString" ? "cross" : "enter"
						});
					}
				});
			}
		}

		if (this.props.editMode) {
			const ruleId = this.props.params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = _.cloneDeep(this.props.rules.find(rule => rule.id === ruleId));

			// -- subject tab is "a1" if no subject (ie. Any track) or subject contains a feed entity (ie. Any track of a certain feed)
			const subjectTabValue = rule.subject.length === 0 || (rule.subject.some(item => item.entityType === "feed")) ? "a1" : "a2";

			this.setState({
				trigger: rule.trigger,
				subject: rule.subject,
				selectedTracks: [],
				dialogOpen: false,
				dialogAOpen: false,
				subjectTabValue,
				triggerTabValue: rule.targets.length === 0 ? "b1" : "b2",
				targets: rule.targets,
				shapeList: [],
				selectedPolygons: [],
				escalationEvent: rule.escalationEvent,
				hoveredSubject: "",
				hoveredTarget: "",
				hoveredCondition: "",
				title: rule.title,
				desc: rule.desc,
				audioSettings: rule.audioSettings,
				dismissForOrg: rule.dismissForOrg,
				conditions: rule.conditions
			});
		} else {
			this.setState({
				title: this.state.title || "",
				desc: this.state.title || "",
				audioSettings: this.state.audioSettings || {
					speakAlertText: true,
					alertText: "Alert, Alert",
					speakAlertNotification: true
				},
				dismissForOrg: this.state.dismissForOrg || true,
				statement: "",
				isPriority: false,
				notifySystem: false,
				notifyEmail: false,
				notifyPush: false,
				subject: [],
				trigger: "enter",
				targets: [],
				conditions: [],
				titleErrorText: "",
				subjectTabValue: "a1",
				triggerTabValue: "b1",
				shapeList: [],
				dialogOpen: false,
				dialogAOpen: false,
				selectedPolygons: [],
				selectedTracks: [],
				escalationEvent: "",
				eventSelected: false,
				hoveredSubject: "",
				hoveredTarget: "",
				hoveredCondition: "",
				loading: loadingSubject || loadingTarget
			});
		}
		// Clear query params from url
		window.location = location.hash.split("?")[0];
	}

	_addTargets = selectedPolygons => {
		this.setState({
			targets: this.state.targets.concat(selectedPolygons),
			selectedPolygons: []
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

	_addSubjects = tracks => {
		this.setState({
			subject: this.state.subject.concat(tracks),
			selectedTracks: []
		});
	};

	_removeSubject = entity => {
		const subjectArray = this.state.subject;
		const tIndex = subjectArray.indexOf(entity);
		subjectArray.splice(tIndex, 1);
		this.setState({
			subject: subjectArray
		});
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

	_toggleSubjectTab = value => {
		// -- reset the subject when the tab is changed
		this.setState({
			subjectTabValue: value,
			subject: []
		});
	};

	_toggleTriggerTab = value => {
		this.setState({
			triggerTabValue: value,
			targets: []
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
		const { assignments, rules, params } = this.props;
		const { assignments: oldAssignments } = rules.find(
			rule => rule.id === params.id
		);
		if (_.isEmpty(this.props.title)) {
			this.props.updateTitleErrorMessage("This field is Required");
		} else if (this.props.validateAudioSettings()) {
			const filteredAssignments = filterAssignments(
				oldAssignments,
				assignments
			);
			this.props.updateRule(
				this.props.params.id,
				this.props.title,
				this.props.desc,
				this.props.audioSettings,
				this.props.dismissForOrg,
				document.getElementById("rule-string").textContent,
				this.state.subject,
				this.state.trigger,
				// If 'any polygon' is selected, defualt to empty arrays
				this.state.triggerTabValue === "b1" ? [] : this.state.targets,
				this.state.conditions,
				this.state.escalationEvent,
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
			const filteredAssignments = filterAssignments({}, assignments);
			this.props.addRule(
				this.props.title,
				this.props.desc,
				this.props.audioSettings,
				this.props.dismissForOrg,
				document.getElementById("rule-string").textContent,
				this.state.subject,
				this.state.trigger,
				// If 'any polygon' is selected, defualt to empty arrays
				this.state.triggerTabValue === "b1" ? [] : this.state.targets,
				this.state.conditions,
				this.state.escalationEvent,
				filteredAssignments,
				this.props.user.profile.id,
				this.props.user.profile.orgId,
				"track-movement",
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

	handleChangeTrigger = (event, index, value) => {
		let conditions = [];
		if (value === "loiter") {
			let newCondition = {
				type: "duration",
				duration: 60
			};
			for (const condition of this.state.conditions) {
				if (condition.type === "duration") {
					newCondition = "";
					break;
				}
			}
			conditions = this.clearConditions(this.state.conditions, [
				"time",
				"duration"
			]);

			if (newCondition) {
				conditions.push(newCondition);
			}
		} else {
			conditions = this.clearConditions(this.state.conditions, [
				"time",
				"speed",
				"in-collection",
				"not-in-collection"
			]);
		}

		this.setState({ conditions: conditions, trigger: value });
	};

	clearConditions = (conditions, types) => {
		const newConditions = [];

		conditions.forEach((condition, index) => {
			if (types.includes(condition.type)) {
				newConditions.push(condition);
			}
		});
		return newConditions;
	};

	handleSubjectHover = index => {
		this.setState({
			hoveredSubject: index
		});
	};

	handleTargetHover = index => {
		this.setState({
			hoveredTarget: index
		});
	};

	render() {
		const { landUnitSystem, entityCollections, timeFormatPreference } = this.props;
		const { targets, subject, conditions, trigger, escalationEvent } = this.state;
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

		const disableSave = !targets.length && !subject.length;

		return (
			<div>
				<SubmitControls
					cancelAndHome={this._cancelAndHome}
					disabled={disableSave}
					handleSaveClick={this.handleSaveClick}
				/>

				<div className="mobile-content-divider" />

				<div style={{ position: "relative" }}>
					{this.state.loading && (
						<div className="blur-overlay-body">
							<CircularProgress size={150} thickness={10} />
						</div>
					)}

					<div className={this.state.loading ? "blur-overlay" : null}>
						<div className="row">
							<div className="row-item fullwidth">
								<div className="rule-states">
									<span>The rule states...</span>
									<h2 id="rule-string">
										{ruleBuilder(
											{
												targets,
												subject,
												conditions,
												trigger,
												escalationEvent,
												type: "track-movement",
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
								<div className="rule-attributes-section">
									<div className="rule-attribute-col">
										<div className="rule-attribute-row last-row">
											<ErrorBoundary>
												<SubjectContainer
													isOpen={this.props.isOpen}
													openDialog={this.props.openDialog}
													closeDialog={this.props.closeDialog}
													styles={styles}
													subject={subject}
													handleSubjectHover={this.handleSubjectHover}
													addSubjects={this._addSubjects}
													removeSubject={this._removeSubject}
													tabValue={this.state.subjectTabValue}
													toggleSubjectTab={this._toggleSubjectTab}
												/>
											</ErrorBoundary>
										</div>
									</div>
									<div className="rule-attribute-col">
										<div className="rule-attribute-row last-row">
											<ErrorBoundary>
												<TriggerContainer
													isOpen={this.props.isOpen}
													openDialog={this.props.openDialog}
													closeDialog={this.props.closeDialog}
													styles={styles}
													targets={targets}
													displayName="polygon"
													targetType="shape"
													trigger={this.state.trigger}
													triggers={["enter", "exit", "cross", "loiter"]}
													handleChangeTrigger={this.handleChangeTrigger}
													handleTargetHover={this.handleTargetHover}
													addTargets={this._addTargets}
													removeTarget={this._removeTarget}
													tabValue={this.state.triggerTabValue}
													toggleTriggerTab={this._toggleTriggerTab}
												/>
											</ErrorBoundary>
										</div>
									</div>
									<div className="rule-attribute-col last-col">
										<div className="rule-attribute-row">
											<ErrorBoundary>
												<ConditionsAttributes
													isOpen={this.props.isOpen}
													openDialog={this.props.openDialog}
													closeDialog={this.props.closeDialog}
													styles={styles}
													conditions={this.state.conditions}
													availableConditions={
														this.state.trigger === "loiter"
															? ["time", "duration"]
															: [
																"time",
																"speed",
																"in-collection",
																"not-in-collection"
															]
													}
													entityCollections={this.props.entityCollections}
													addCondition={this._addCondition}
													deleteCondition={this._deleteCondition}
													updateCondition={this._updateCondition}
													landUnitSystem={landUnitSystem}
													timeFormatPreference={timeFormatPreference}
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default TrackMovement;
