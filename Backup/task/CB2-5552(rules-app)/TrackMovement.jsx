import React, { useEffect, useState } from "react";
import { feedService, shapeService } from "client-app-core";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import ConditionsAttributes from "../Conditions/ConditionsAttributes";
import EscalationAttributes from "../Escalations/EscalationAttributes";
import SubjectAttributes from "../Subject/SubjectAttributes";
import TriggerAttributes from "../Trigger/TriggerAttributes";
import { CircularProgress } from "@mui/material";

// misc
import _ from "lodash";
import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import { default as filterAssignments } from "../utils/filterAssignments";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

const TrackMovement = ({ location, navigate, editMode, rules, params, title, updateRule, desc, audioSettings, dismissForOrg, removeContext, assignments, updateTitleErrorMessage, validateAudioSettings, user, landUnitSystem, timeFormatPreference, dir, locale, isOpen, openDialog, closeDialog, entityCollections, addRule }) => {
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();

	const [subject, setSubject] = useState([]);
	const [loading, setLoading] = useState();
	const [subjectTabValue, setSubjectTabValue] = useState([]);
	const [targets, setTargets] = useState([]);
	const [triggerTabValue, setTriggerTabValue] = useState([]);
	const [trigger, setTrigger] = useState([]);
	const [selectedTracks, setSelectedTracks] = useState();
	const [dialogOpen, setDialogOpen] = useState();
	const [dialogAOpen, setDialogAOpen] = useState();
	const [shapeList, setShapeList] = useState();
	const [hoveredTarget, setHoveredTarget] = useState();
	const [hoveredCondition, setHoveredCondition] = useState();
	const [audioSettingsState, setAudioSettingsState] = useState([]);
	const [dismissForOrgState, setDismissForOrgState] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [statement, setStatement] = useState();
	const [isPriority, setIsPriority] = useState();
	const [notifySystem, setNotifySystem] = useState();
	const [notifyPush, setNotifyPush] = useState();
	const [titleErrorText, setTitleErrorText] = useState();
	const [notifyEmail, setNotifyEmail] = useState();
	const [selectedPolygons, setSelectedPolygons] = useState();
	const [escalationEvent, setEscalationEvent] = useState([]);
	const [hoveredSubject, setHoveredSubject] = useState();
	const [descState, setDescState] = useState();
	const [eventSelected, setEventSelected] = useState();
	const [titleState, setTitleState] = useState();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		let loadingSubject = false;
		let loadingTarget = false;

		// If there are query params used to pre-fill state
		if (location.search) {
			const createTargets = searchParams.get("createTargets");
			const createSubjects = searchParams.get("createSubjects");

			const queryTargetIds = createTargets
				? createTargets.split(",")
				: [];
			const querySubjectIds = createSubjects
				? createSubjects.split(",")
				: [];

			if (querySubjectIds.length) {
				loadingSubject = true;

				feedService.getFeedEntitiesByIds(querySubjectIds, (err, result) => {
					if (err) {
						console.log("Error retrieving subjects for rule:", err);

						setSubject([]);
						setLoading(loadingTarget || false);
					} else {
						const namedSubjects = result.map(track => {
							track.name = track.entityData.properties.name;
							return track;
						});

						loadingSubject = false;

						setSubject([...namedSubjects]);
						setSubjectTabValue(namedSubjects[0] ? "a2" : "a1");
						setLoading(loadingSubject || loadingTarget);
					}
				});
			} else if (queryTargetIds.length) {
				loadingTarget = true;

				shapeService.getMultipleById(queryTargetIds, (err, result) => {
					if (err) {
						console.log("Error retrieving targets for rule:", err);
						setTargets([]);
						setLoading(loadingSubject || false);
					} else {
						loadingTarget = false;
						let type = "";
						if (result[0] && result[0].entityData.type) {
							type = result[0].entityData.type;
						}

						setTargets([...result]);
						setTriggerTabValue(result[0] ? "b2" : "b1");
						setLoading(loadingTarget || loadingSubject);
						setTrigger(type === "LineString" ? "cross" : "enter");
					}
				});
			}
		}

		if (editMode) {
			const ruleId = params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = _.cloneDeep(rules.find(rule => rule.id === ruleId));

			// -- subject tab is "a1" if no subject (ie. Any track) or subject contains a feed entity (ie. Any track of a certain feed)
			const subjectTabValue = rule.subject.length === 0 || (rule.subject.some(item => item.entityType === "feed")) ? "a1" : "a2";

			setTrigger(rule.trigger);
			setSubject(rule.subject);
			setSelectedTracks([]);
			setDialogOpen(false);
			setDialogAOpen(false);
			setSubjectTabValue(subjectTabValue);
			setTriggerTabValue(rule.targets.length === 0 ? "b1" : "b2");
			setTargets(rule.targets);
			setShapeList([]);
			setSelectedPolygons([]);
			setEscalationEvent(rule.escalationEvent);
			setHoveredSubject("");
			setHoveredTarget("");
			setHoveredCondition("");
			setTitleState(rule.title);
			setDescState(rule.desc);
			setAudioSettingsState(rule.audioSettings);
			setDismissForOrgState(rule.dismissForOrg);
			setConditions(rule.conditions);
		} else {
			setTitleState(titleState || "");
			setDescState(titleState || "");
			setAudioSettingsState(audioSettingsState || {
				speakAlertText: true,
				alertText: "Alert, Alert",
				speakAlertNotification: true
			});
			setDismissForOrgState(dismissForOrgState || true);
			setStatement("");
			setIsPriority(false);
			setNotifySystem(false);
			setNotifyEmail(false);
			setNotifyPush(false);
			setSubject([]);
			setTrigger("enter");
			setTargets([]);
			setConditions([]);
			setTitleErrorText("");
			setSubjectTabValue("a1");
			setTriggerTabValue("b1");
			setShapeList([]);
			setDialogOpen(false);
			setDialogAOpen(false);
			setSelectedPolygons([]);
			setSelectedTracks([]);
			setEscalationEvent("");
			setEventSelected(false);
			setHoveredSubject("");
			setHoveredTarget("");
			setHoveredCondition("");
			setLoading(loadingSubject || loadingTarget);
		}
		setMounted(true);
	}

	const _addTargets = selectedPolygons => {
		setTargets(targets.concat(selectedPolygons));
		setSelectedPolygons([]);
	};

	const _removeTarget = entity => {
		const triggerArray = targets;
		const index = triggerArray.indexOf(entity);
		triggerArray.splice(index, 1);

		setTargets(triggerArray);
	};

	const _addSubjects = tracks => {

		setSubject(subject.concat(tracks));
		setSelectedTracks([]);
	};

	const _removeSubject = entity => {
		const subjectArray = subject;
		const tIndex = subjectArray.indexOf(entity);
		subjectArray.splice(tIndex, 1);
		setSubject(subjectArray);
	};

	const _addEscalation = selectedEvent => {
		setEscalationEvent(selectedEvent.id);
	};

	const _deleteEscalation = () => {
		setEscalationEvent("");
	};

	const _addCondition = newCondition => {
		const condition = [...conditions, newCondition];
		const sortedConditions = condition.sort((a, b) => {
			if (a.type === "time" && b.type === "time") {
				return 0;
			} else if (a.type === "time") {
				return 1;
			} else {
				return -1;
			}
		});
		setConditions(sortedConditions);
	};

	const _updateCondition = (updatedCondition, index) => {
		const condition = conditions;
		condition[index] = updatedCondition;
		setConditions(condition);
	};

	const _deleteCondition = index => {
		const condition = [...conditions];
		condition.splice(index, 1);
		setConditions(condition);
	};

	const _toggleSubjectTab = value => {
		// -- reset the subject when the tab is changed
		setSubjectTabValue(value);
		if (subjectTabValue != value) {
			setSubject([]);
		}
	};

	const _toggleTriggerTab = value => {
		setTriggerTabValue(value);
		setTargets([]);
	};

	const handleSaveClick = () => {
		if (editMode) {
			_updateRule();
		} else {
			_addRule();
		}
	};

	const _updateRule = () => {
		const { assignments: oldAssignments } = rules.find(
			rule => rule.id === params.id
		);
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments(
				oldAssignments,
				assignments
			);
			dispatch(updateRule(
				params.id,
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				subject,
				trigger,
				// If 'any polygon' is selected, defualt to empty arrays
				triggerTabValue === "b1" ? [] : targets,
				conditions,
				escalationEvent,
				filteredAssignments
			));
			dispatch(removeContext(params.id));
			navigate("/");
		}
	};

	const _addRule = () => {
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments({}, assignments);
			dispatch(addRule(
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				subject,
				trigger,
				// If 'any polygon' is selected, defualt to empty arrays
				triggerTabValue === "b1" ? [] : targets,
				conditions,
				escalationEvent,
				filteredAssignments,
				user.profile.id,
				user.profile.orgId,
				"track-movement",
				user.profile.name
			));
			navigate("/");
		}
	};

	const _cancelAndHome = () => {
		if (editMode && params.id) {
			dispatch(removeContext(params.id));
		}
		navigate("/");
	};

	const handleChangeTrigger = (event) => {
		let conditions = [];
		if (event.target.value === "loiter") {
			let newCondition = {
				type: "duration",
				duration: 60
			};
			for (const condition of conditions) {
				if (condition.type === "duration") {
					newCondition = "";
					break;
				}
			}
			conditions = clearConditions(conditions, [
				"time",
				"duration"
			]);

			if (newCondition) {
				conditions.push(newCondition);
			}
		} else {
			conditions = clearConditions(conditions, [
				"time",
				"speed",
				"in-collection",
				"not-in-collection"
			]);
		}

		setConditions(conditions);
		setTrigger(event.target.value);
	};

	const clearConditions = (conditions, types) => {
		const newConditions = [];

		conditions.forEach((condition, index) => {
			if (types.includes(condition.type)) {
				newConditions.push(condition);
			}
		});
		return newConditions;
	};

	const handleSubjectHover = index => {
		setHoveredSubject(index);
	};

	const handleTargetHover = index => {
		setHoveredTarget(index);
	};

	const isMobile = window.matchMedia("(max-width: 600px)").matches;
	const styles = {
		contentContainerStyle: {
			marginBottom: "6px"
		},
		tabButton: {
			textTransform: "normal",
			width: "50%"
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
				cancelAndHome={_cancelAndHome}
				disabled={disableSave}
				handleSaveClick={handleSaveClick}
				dir={dir}
			/>

			<div className="mobile-content-divider" />

			<div style={{ position: "relative" }}>
				{loading && (
					<div className="blur-overlay-body" style={{ color: "rgb(0, 188, 212)" }}>
						<CircularProgress size={150} thickness={4} color="inherit" />
					</div>
				)}

				<div className={loading ? "blur-overlay" : null}>
					<div className="row">
						<div className="row-item fullwidth">
							<div className="rule-states" style={dir == "rtl" ? { textAlign: "right" } : {}}>
								<span><Translate value="createEditRule.trackMovement.ruleStates" /></span>
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
											<SubjectAttributes
												isOpen={isOpen}
												openDialog={openDialog}
												closeDialog={closeDialog}
												styles={styles}
												subject={subject}
												handleSubjectHover={handleSubjectHover}
												addSubjects={_addSubjects}
												removeSubject={_removeSubject}
												tabValue={subjectTabValue}
												toggleSubjectTab={_toggleSubjectTab}
											/>
										</ErrorBoundary>
									</div>
								</div>
								<div className="rule-attribute-col">
									<div className="rule-attribute-row last-row">
										<ErrorBoundary>
											<TriggerAttributes
												isOpen={isOpen}
												openDialog={openDialog}
												closeDialog={closeDialog}
												styles={styles}
												targets={targets}
												displayName="polygon"
												targetType="shape"
												trigger={trigger}
												triggers={["enter", "exit", "cross", "loiter"]}
												handleChangeTrigger={handleChangeTrigger}
												handleTargetHover={handleTargetHover}
												addTargets={_addTargets}
												removeTarget={_removeTarget}
												tabValue={triggerTabValue}
												toggleTriggerTab={_toggleTriggerTab}
											/>
										</ErrorBoundary>
									</div>
								</div>
								<div className="rule-attribute-col last-col">
									<div className="rule-attribute-row">
										<ErrorBoundary>
											<ConditionsAttributes
												isOpen={isOpen}
												openDialog={openDialog}
												closeDialog={closeDialog}
												styles={styles}
												conditions={conditions}
												availableConditions={
													trigger === "loiter"
														? ["time", "duration"]
														: [
															"time",
															"speed",
															"in-collection",
															"not-in-collection"
														]
												}
												entityCollections={entityCollections}
												addCondition={_addCondition}
												deleteCondition={_deleteCondition}
												updateCondition={_updateCondition}
												landUnitSystem={landUnitSystem}
												timeFormatPreference={timeFormatPreference}
												dir={dir}
												locale={locale}
											/>
										</ErrorBoundary>
									</div>
									<div className="rule-attribute-row last-row">
										<ErrorBoundary>
											<EscalationAttributes
												isOpen={isOpen}
												openDialog={openDialog}
												closeDialog={closeDialog}
												styles={styles}
												addEscalation={_addEscalation}
												escalationEvent={escalationEvent}
												deleteEscalation={_deleteEscalation}
											// updateEscalation={_updateEscalation}
											// Seems like _updateEscalation method is'nt used anymore in EscalationDialog.
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
};

export default TrackMovement;
