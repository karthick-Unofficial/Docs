import React, { useEffect, useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

import ConditionsAttributes from "../Conditions/ConditionsAttributes";
import TriggerAttributes from "../Trigger/TriggerAttributes";

// misc
import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import { default as filterAssignments } from "../utils/filterAssignments";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";

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
	isOpen,
	openDialog,
	closeDialog,
	navigate
}) => {
	const dispatch = useDispatch();

	const healthSystems = useSelector(state => state.globalData.healthSystems);
	const systemHealthEvents = healthSystems.items.map((id) => {
		return {
			id: healthSystems.itemsById[id].system,
			name: healthSystems.itemsById[id].name
		};
	});
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	const [trigger, setTrigger] = useState([]);
	const [trackList, setTrackList] = useState();
	const [selectedEvents, setSelectedEvents] = useState();
	const [dialogOpen, setDialogOpen] = useState();
	const [dialogAOpen, setDialogAOpen] = useState();
	const [triggerTabValue, setTriggerTabValue] = useState([]);
	const [targets, setTargets] = useState([]);
	const [shapeList, setShapeList] = useState();
	const [triggerSelections, setTriggerSelections] = useState();
	const [hoveredTarget, setHoveredTarget] = useState();
	const [hoveredCondition, setHoveredCondition] = useState();
	const [titleState, setTitleState] = useState();
	const [descState, setDescState] = useState();
	const [audioSettingsState, setAudioSettingsState] = useState();
	const [dismissForOrgState, setDismissForOrgState] = useState();
	const [conditions, setConditions] = useState([]);
	const [statement, setStatement] = useState();
	const [isPriority, setIsPriority] = useState();
	const [notifySystem, setNotifySystem] = useState();
	const [notifyPush, setNotifyPush] = useState();
	const [titleErrorText, setTitleErrorText] = useState();
	const [notifyEmail, setNotifyEmail] = useState();
	const [subject, setSubject] = useState([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		if (editMode) {
			const ruleId = params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = cloneDeep(rules.find(rule => rule.id === ruleId));
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
		if (isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments(assignments);
			dispatch(updateRule(
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
			));
			dispatch(removeContext(params.id));
			navigate("/");
		}
	};

	const _addRule = () => {
		if (isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments(assignments);
			dispatch(addRule(
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
		setTrigger(event.target.value);
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
		},
		ruleStates: {
			...(dir == "rtl" && { textAlign: "right" })
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
					<div className="rule-states" style={styles.ruleStates}>
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
							<TriggerAttributes
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
