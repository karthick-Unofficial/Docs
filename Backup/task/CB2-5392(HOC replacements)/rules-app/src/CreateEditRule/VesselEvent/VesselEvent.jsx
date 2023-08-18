import React, { Fragment, useEffect, useState } from "react";

import _ from "lodash";
import ErrorBoundary from "orion-components/ErrorBoundary";

import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import GenericAttribute from "../GenericAttribute/GenericAttribute";
import EscalationAttributes from "../Escalations/EscalationAttributes";

import { default as filterAssignments } from "../utils/filterAssignments";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "./vesselEventActions";
import { getDir } from "orion-components/i18n/Config/selector";


const VesselEvent = ({ navigate, editMode, updateRule, removeContext, params, title, desc, audioSettings, dismissForOrg, user, addRule, updateTitleErrorMessage, validateAudioSettings, assignments, isOpen, closeDialog }) => {
	const dispatch = useDispatch();

	const { getAllBerths, openDialog } = actionCreators;
	const ruleSelector = useSelector(state => state.globalData.rules);
	const rules = Object.keys(ruleSelector).map(key => {
		return ruleSelector[key];
	});
	const berths = useSelector(state => state.globalData.berths);
	const entityCollections = useSelector(state => state.globalData.collections);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));

	const [trigger, setTrigger] = useState("berth-assignment-created");
	const [targets, setTargets] = useState([]);
	const [conditions, setConditions] = useState([]);
	const [escalationEvent, setEscalationEvent] = useState("");
	const [mounted, setMounted] = useState(false);

	const [state, setState] = useState();
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		dispatch(getAllBerths());

		if (editMode) {
			const ruleId = params.id;
			// -- make a copy of the rule to keep from updating existing global state rules
			const rule = _.cloneDeep(rules.find(rule => rule.id === ruleId));
			setTrigger(rule.trigger);
			setTargets(rule.targets);
			setConditions(rule.conditions);
			setEscalationEvent(rule.escalationEvent);
		}
		setMounted(true);
	}
	// Curried function to allow children (GenericAttribute components)
	// to set parent state. This lets you build your rule dynamically 
	// based on the trigger type selected
	const setProperty = (key) => (value) => {
		if (key === "trigger") {
			// Reset all state when trigger is changed
			setState({ [key]: value });
			setTargets([]);
			setConditions([]);
			setEscalationEvent("");
		}
		switch (key) {
			case "conditions":
				setConditions(value);
				break;
			case "trigger":
				setTrigger(value);
				break;
			case "targets":
				setTargets(value);
				break;
			default:
				setState({ [key]: value });
		}
	};

	const handleSaveClick = () => {

		if (editMode) {
			_updateRule();
		} else {
			_addRule();
		}
	};

	const _cancelAndHome = () => {

		if (editMode && params.id) {
			dispatch(removeContext(params.id));
		}

		navigate("/");
	};

	const _updateRule = () => {
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
			dispatch(updateRule(
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
			));
			dispatch(removeContext(params.id));
			navigate("/");
		}
	};

	const _addRule = () => {
		const filteredAssignments = filterAssignments(
			{},
			assignments
		);

		if (!title.length) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			dispatch(addRule(
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
			));
			navigate("/");
		}
	};

	const _addEscalation = selectedEvent => {
		setEscalationEvent(selectedEvent.id);
	};

	const _deleteEscalation = () => {
		setEscalationEvent("");
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

	const getAttributes = () => {
		switch (trigger) {
			case "berth-assignment-created": {
				return (
					<Fragment>
						<div className="rule-attribute-col last-col">
							<div className="rule-attribute-row">
								<ErrorBoundary>
									<GenericAttribute
										type={"conditions"}
										inputType={"conditions"}
										inputOptions={["time"]}
										setProperty={setProperty("conditions")}
										openDialog={openDialog}
										value={conditions}
										dir={dir}
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
										type={"conditions"}
										inputType={"conditions"}
										inputOptions={["time"]}
										setProperty={setProperty("conditions")}
										openDialog={openDialog}
										value={conditions}
										dir={dir}
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
										type={"berthSelection"}
										description={getTranslation("createEditRule.vesselEvents.selectBerth")}
										inputType={"multi-selection"}
										inputOptions={berths} // TODO: Pass real data
										selectionType={"berth"}
										setProperty={setProperty("targets")}
										searchProperty={"name"}
										openDialog={openDialog}
										value={targets}
										dir={dir}
									/>
								</ErrorBoundary>
							</div>
						</div>
						<div className="rule-attribute-col last-col">
							<div className="rule-attribute-row">
								<ErrorBoundary>
									<GenericAttribute
										type={"conditions"}
										inputType={"conditions"}
										inputOptions={["time"]}
										setProperty={setProperty("conditions")}
										openDialog={openDialog}
										value={conditions}
										dir={dir}
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
										type={"berthSelection"}
										description={getTranslation("createEditRule.vesselEvents.selectBerth")}
										inputType={"multi-selection"}
										inputOptions={berths} // TODO: Pass real data
										selectionType={"berth"}
										setProperty={setProperty("targets")}
										searchProperty={"name"}
										openDialog={openDialog}
										value={targets}
										dir={dir}
									/>
								</ErrorBoundary>
							</div>
						</div>
						<div className="rule-attribute-col last-col">
							<div className="rule-attribute-row">
								<ErrorBoundary>
									<GenericAttribute
										type={"conditions"}
										inputType={"conditions"}
										inputOptions={[
											"time",
											"in-collection",
											"not-in-collection"
										]}
										setProperty={setProperty("conditions")}
										openDialog={openDialog}
										value={conditions}
										dir={dir}
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
										type={"berthSelection"}
										description={getTranslation("createEditRule.vesselEvents.selectBerth")}
										inputType={"multi-selection"}
										inputOptions={berths} // TODO: Pass real data
										selectionType={"berth"}
										setProperty={setProperty("targets")}
										searchProperty={"name"}
										openDialog={openDialog}
										value={targets}
										dir={dir}
									/>
								</ErrorBoundary>
							</div>
						</div>
						<div className="rule-attribute-col last-col">
							<div className="rule-attribute-row">
								<ErrorBoundary>
									<GenericAttribute
										type={"conditions"}
										inputType={"conditions"}
										inputOptions={[
											"time",
											"in-collection",
											"not-in-collection"
										]}
										setProperty={setProperty("conditions")}
										openDialog={openDialog}
										value={conditions}
										dir={dir}
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
										type={"berthSelection"}
										description={getTranslation("createEditRule.vesselEvents.selectBerth")}
										inputType={"multi-selection"}
										inputOptions={berths} // TODO: Pass real data
										selectionType={"berth"}
										setProperty={setProperty("targets")}
										searchProperty={"name"}
										openDialog={openDialog}
										value={targets}
										dir={dir}
									/>
								</ErrorBoundary>
							</div>
						</div>
						<div className="rule-attribute-col last-col">
							<div className="rule-attribute-row">
								<ErrorBoundary>
									<GenericAttribute
										type={"conditions"}
										inputType={"conditions"}
										inputOptions={[
											"time",
											"in-collection",
											"not-in-collection"
										]}
										setProperty={setProperty("conditions")}
										openDialog={openDialog}
										value={conditions}
										dir={dir}
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
				cancelAndHome={_cancelAndHome}
				handleSaveClick={handleSaveClick}
				dir={dir}
			/>

			<div className="mobile-content-divider" />

			<div className="row">
				<div className="row-item fullwidth">
					<div className="rule-states" style={dir == "rtl" ? { textAlign: "right" } : {}}>
						<span><Translate value="createEditRule.vesselEvents.ruleStates" /></span>
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
										type={"type"}
										description={getTranslation("createEditRule.vesselEvents.selectRuleType")}
										inputType={"dropdown"}
										inputOptions={[
											{ value: "berth-assignment-created", label: getTranslation("createEditRule.vesselEvents.newReq") },
											{ value: "berth-assignment-approval", label: getTranslation("createEditRule.vesselEvents.requestApproval") },
											{ value: "berth-assignment-update", label: getTranslation("createEditRule.vesselEvents.berthUpdates") },
											{ value: "arrival", label: getTranslation("createEditRule.vesselEvents.arrivals") },
											{ value: "departure", label: getTranslation("createEditRule.vesselEvents.departures") },
											{ value: "berth-security-violation", label: getTranslation("createEditRule.vesselEvents.secViolation") }
										]}
										setProperty={setProperty("trigger")}
										value={trigger}
										dir={dir}
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
};

export default VesselEvent;
