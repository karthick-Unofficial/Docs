import React, { useEffect, useState } from "react";

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


const SystemHealth = ({
	rules,
	updateTitleErrorMessage,
	validateAudioSettings,
	updateRule,
	params,
	title,
	desc,
	assignments,
	dismissForOrg,
	audioSettings,
	addRule,
	user,
	editMode,
	removeContext,
	entityCollections,
	timeFormatPreference,
	dir,
	locale,
	isOpen,
	openDialog,
	closeDialog,
	systemHealthEvents
}) => {
	const [trigger, setTrigger] = useState(null);
	const [trackList, setTrackList] = useState(null);
	const [selectedEvents, setSelectedEvents] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(null);
	const [dialogAOpen, setDialogAOpen] = useState(null);
	const [triggerTabValue, setTriggerTabValue] = useState(null);
	const [targets, setTargets] = useState(0);
	const [shapeList, setShapeList] = useState(null);
	const [triggerSelections, setTriggerSelections] = useState(null);
	const [hoveredTarget, setHoveredTarget] = useState(null);
	const [hoveredCondition, setHoveredCondition] = useState(null);
	const [titleState, setTitleState] = useState(null);
	const [descState, setDescState] = useState(null);
	const [audioSettingsState, setAudioSettingsState] = useState(null);
	const [dismissForOrgState, setDismissForOrgState] = useState(null);
	const [conditions, setConditions] = useState(null);
	const [statement, setStatement] = useState(null);
	const [isPriority, setIsPriority] = useState(null);
	const [notifySystem, setNotifySystem] = useState(null);
	const [notifyPush, setNotifyPush] = useState(null);
	const [titleErrorText, setTitleErrorText] = useState(null);
	const [notifyEmail, setNotifyEmail] = useState(null);
	const [subject, setSubject] = useState(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if(!mounted) {
		if (editMode) {
			const ruleId = params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = _.cloneDeep(rules.find(rule => rule.id === ruleId));
			setTrigger(rule.trigger);
			setTrackList([]);
			setSelectedEvents([]);
			setDialogOpen(false);
			setDialogAOpen(false);
			setTriggerTabValue(rule.targets.length === 0 ? "b1" : "b2");
			setTargets(rule.targets);
			setShapeList([]);
			setTriggerSelections([]);
			setHoveredTarget("");
			setHoveredCondition("");
			setTitleState(rule.title);
			setDescState(rule.desc);
			setAudioSettingsState(rule.audioSettings);
			setDismissForOrgState(rule.dismissForOrg);
			setConditions(rule.conditions);
		} else {
			const endOfYear = new Date();
			endOfYear.setMonth(11);
			endOfYear.setDate(31);

			setTitleState("");
			setDescState("");
			setAudioSettingsState({
				speakAlertText: true,
				alertText: "Alert, Alert",
				speakAlertNotification: true
			});
			setDismissForOrgState(true);
			setStatement("");
			setIsPriority(false);
			setNotifySystem(false);
			setNotifyEmail(false);
			setNotifyPush(false);
			setTrigger("system-health-change");
			setTargets([]);
			setConditions([]);
			setTitleErrorText("");
			setTriggerTabValue("b1");
			setTrackList([]);
			setShapeList([]);
			setDialogOpen(false);
			setDialogAOpen(false);
			setTriggerSelections([]);
			setSelectedEvents([]);
			setHoveredTarget("");
			setHoveredCondition("");

		}
		setMounted(true);
	}

	const _addTargets = triggerSelections => {
		setTargets(targets.concat(triggerSelections));
		setTriggerSelections([]);
	};

	const _removeTarget = entity => {
		const triggerArray = targets;
		const index = triggerArray.indexOf(entity);
		triggerArray.splice(index, 1);
		setTargets(triggerArray);
	};

	const _addCondition = newCondition => {
		const conditions = [...conditions, newCondition];
		const sortedConditions = conditions.sort((a, b) => {
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
		const conditions = conditions;
		conditions[index] = updatedCondition;
		setConditions(conditions);
	};

	const _deleteCondition = index => {
		const conditions = [...conditions];
		conditions.splice(index, 1);
		setConditions(conditions);
	};

	const _toggleTriggerTab = value => {
		setTriggerTabValue(value);
	};

	const handleSaveClick = () => {
		if (editMode) {
			_updateRule();
		} else {
			_addRule();
		}
	};

	const _updateRule = () => {
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments(assignments);
			updateRule(
				params.id,
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				// If 'any polygon' or 'any track' is selected, defualt to empty arrays
				[], // --< subject
				trigger,
				triggerTabValue === "b1" ? [] : targets,
				conditions,
				filteredAssignments
			);
			removeContext(params.id);
			hashHistory.push("/");
		}
	};

	const _addRule = () => {
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments(assignments);
			addRule(
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				// If 'any polygon' or 'any track' is selected, default to empty arrays
				[], // < -- subject
				trigger,
				triggerTabValue === "b1" ? [] : targets,
				conditions,
				filteredAssignments,
				user.profile.id,
				user.profile.orgId,
				"system-health",
				user.profile.name
			);
			hashHistory.push("/");
		}
	};

	const _cancelAndHome = () => {
		if (editMode && params.id) {
			removeContext(params.id);
		}
		hashHistory.push("/");
	};

	const handleChangeTrigger = (event, index, value) => {
		setTrigger(value);
	};

	const handleTargetHover = index => {
		setHoveredTarget(index);
	};

	const handleConditionHover = index => {
		setHoveredCondition(index);
	};

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
		triggerTabValue === "b2" && targets.length === 0
			? true
			: false;
	return (
		<div>
			<SubmitControls
				cancelAndHome={_cancelAndHome}
				disabled={disableSave}
				handleSaveClick={handleSaveClick}
				dir={dir}
			/>

			<div className="mobile-content-divider" />

			<div className="row">
				<div className="row-item fullwidth">
					<div className="rule-states" style={dir == "rtl" ? { textAlign: "right" } : {}}>
						<span><Translate value="createEditRule.systemHealth.ruleStates" /></span>
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
								isOpen={isOpen}
								openDialog={openDialog}
								closeDialog={closeDialog}
								availableTargets={systemHealthEvents}
								replace="system"
								targetType="system-health"
								displayName="system"
								styles={styles}
								targets={targets}
								handleChangeTrigger={handleChangeTrigger}
								handleTargetHover={handleTargetHover}
								addTargets={_addTargets}
								entity={"shapes"}
								removeTarget={_removeTarget}
								tabValue={triggerTabValue}
								toggleTriggerTab={_toggleTriggerTab}
							/>
						</ErrorBoundary>
						<ErrorBoundary>
							<ConditionsAttributes
								isOpen={isOpen}
								openDialog={openDialog}
								closeDialog={closeDialog}
								styles={styles}
								conditions={conditions}
								availableConditions={["time"]}
								handleConditionHover={handleConditionHover}
								entityCollections={entityCollections}
								addCondition={_addCondition}
								deleteCondition={_deleteCondition}
								updateCondition={_updateCondition}
								timeFormatPreference={timeFormatPreference}
								dir={dir}
								locale={locale}
							/>
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SystemHealth;
