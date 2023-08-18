import React, { useEffect, useState } from "react";
import { hashHistory } from "react-router";

import _ from "lodash";
import CircularProgress from "material-ui/CircularProgress";
import { eventService, eventTypeService } from "client-app-core";

import GenericAttribute from "../GenericAttribute/GenericAttribute";
import SubmitControls from "../components/SubmitControls";
import { default as filterAssignments } from "../utils/filterAssignments";
import ErrorBoundary from "orion-components/ErrorBoundary";
import ruleBuilder from "orion-components/rule-builder";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const CreateEvent = ({
	params,
	openDialog,
	removeContext,
	rules,
	addRule,
	updateRule,
	user,
	title,
	desc,
	audioSettings,
	dismissForOrg,
	updateTitleErrorMessage,
	assignments,
	editMode,
	entityCollections,
	timeFormatPreference,
	dir
}) => {

	const [availableTemplates, setAvailableTemplates] = useState([]);
	const [template, setTemplate] = useState(null);
	const [eventTypes, setEventTypes] = useState([]);
	const [eventType, setEventType] = useState(null);
	const [eventSubtype, setEventSubtype] = useState(null);
	const [conditions, setConditions] = useState([]);
	const [loading, setLoading] = useState(false);

	// -- will run on first render
	useEffect(() => {
		setLoading(true);
		// -- retrieve event templates
		eventService.getAllTemplates((err, result) => {
			if(result){
				setAvailableTemplates(result);

				// -- retrieve event types
				eventTypeService.getEventTypes((err, result) => {
					if (result) {
						setEventTypes(result);

						// -- assign values if loading existing rule
						if (editMode) {
							// -- make a copy of the rule to keep from updating existing global state rules
							const rule = _.cloneDeep(rules.find(rule => rule.id === params.id));

							const templateSubject = rule.subject.find(sub => sub.template);
							const eventTypeSubject = rule.subject.find(sub => sub.eventType);
							setTemplate(templateSubject ? templateSubject.template : null);
							setEventType(eventTypeSubject ? eventTypeSubject.eventType : null);
							setEventSubtype(eventTypeSubject ? eventTypeSubject.eventSubtype : null);
							setConditions(rule.conditions);
						}
					} else {
						console.log(err);
					}

					setLoading(false);
				});
			} else {
				console.log(err);
			}
		});
	}, []);

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
		} else {
			const filteredAssignments = filterAssignments(
				oldAssignments,
				assignments
			);

			const subjects = [];
			if (template) {
				const selectedTemplate = availableTemplates.filter(temp => temp.id === template)[0];
				const { ownerOrg, sharedWith } = selectedTemplate;
				subjects.push({
					template,
					ownerOrg,
					sharedWith
				});
			}
			if (eventType) {
				subjects.push({
					eventType,
					eventSubtype
				});
			}

			updateRule(
				params.id,
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				subjects, // subject
				"create-event", // trigger
				[], // targets
				conditions,
				"", // escalation event
				filteredAssignments
			);
			removeContext(params.id);
			hashHistory.push("/");
		}
	};

	const _addRule = () => {
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else {
			const filteredAssignments = filterAssignments({}, assignments);

			const subjects = [];
			if (template) {
				const selectedTemplate = availableTemplates.filter(temp => temp.id === template)[0];
				const { ownerOrg, sharedWith } = selectedTemplate;
				subjects.push({
					template,
					ownerOrg,
					sharedWith
				});
			}
			if (eventType) {
				const eventTypeSubject = { eventType };
				if (eventSubtype) {
					eventTypeSubject["eventSubtype"] = eventSubtype;
				}
				subjects.push(eventTypeSubject);
			}

			addRule(
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				subjects, // subject
				"create-event", // trigger
				[], // targets
				conditions,
				"", // escalation event
				filteredAssignments,
				user.profile.id,
				user.profile.orgId,
				"create-event",
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

	const setProperty = (key) => (value) => {
		if (key === "template") {
			setTemplate(value);
		}
		else if (key === "type") {
			setEventType(value);
			setEventSubtype(null);
		}
		else if (key === "subtype") {
			setEventSubtype(value);
		}
		else if (key === "conditions") {
			setConditions(value);
		}
	};

	const placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	const templateOptions = [{value: null, label: placeholderConverter("createEditRule.genericAttribute.type.none")}];
	availableTemplates.forEach((template) => {
		const templateOption = {
			value: template.id,
			label: template.name
		};
		templateOptions.push(templateOption);
	});

	const typeOptions = [{value: null, label: placeholderConverter("createEditRule.genericAttribute.type.none")}], subtypeOptions = [{value: null, label: placeholderConverter("createEditRule.genericAttribute.type.none")}];
	eventTypes.forEach((et) => {
		const eventTypeOption = {
			value: et.eventTypeId,
			label: et.name
		};
		typeOptions.push(eventTypeOption);

		if (eventType === et.eventTypeId) {
			et.subtypes.forEach((st) => {
				const subtypeOption = {
					value: st.id,
					label: st.name
				};
				subtypeOptions.push(subtypeOption);
			});
		}
	});

	const selectedEventType = eventTypes.filter(et => et.eventTypeId === eventType)[0];
	const disableSave = !template && (!eventType || (selectedEventType.subtypeRequired && !eventSubtype));
	const disableSubtype = !eventType;

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
					<div className="blur-overlay-body">
						<CircularProgress size={150} thickness={10} />
					</div>
				)}

				<div className={loading ? "blur-overlay" : null}>
					<div>
						<div className="row">
							<div className="row-item fullwidth">
								<div className="rule-states" style={dir == "rtl" ? {textAlign: "right"} : {}}>
									<span><Translate value="createEditRule.createEvent.ruleStates"/></span>
									<h2 id="rule-string">
										{ruleBuilder(
											{
												availableTemplates,
												eventTypes,
												template,
												eventType,
												eventSubtype,
												conditions,
												type: "create-event",
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
										<div className="rule-attribute-row">
											<ErrorBoundary>
												<GenericAttribute
													type={"template"}
													description={<Translate value="createEditRule.createEvent.eventTemplate"/>}
													inputType={"dropdown"}
													inputOptions={templateOptions}
													setProperty={setProperty("template")}
													value={template}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
										<div className="rule-attribute-row">
											<ErrorBoundary>
												<GenericAttribute
													type={"type"}
													description={<Translate value="createEditRule.createEvent.eventType"/>}
													inputType={"dropdown"}
													inputOptions={typeOptions}
													setProperty={setProperty("type")}
													value={eventType}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
										<div className={"rule-attribute-row last-row" + (disableSubtype && " disabled")}>
											<ErrorBoundary>
												<GenericAttribute
													type={"subType"}
													description={<Translate value="createEditRule.createEvent.eventSubType"/>}
													inputType={"dropdown"}
													inputOptions={subtypeOptions}
													setProperty={setProperty("subtype")}
													value={eventSubtype}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
									</div>
									<div className="rule-attribute-col last-col">
										<div className="rule-attribute-row last-row">
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

export default CreateEvent;
