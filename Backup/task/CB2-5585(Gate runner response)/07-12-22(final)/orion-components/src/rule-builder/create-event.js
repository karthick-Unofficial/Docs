import React from "react";
import _getConditions from "./condition-builder.js";
import { Translate, getTranslation } from "orion-components/i18n";

const VOWELS = ["a", "e", "i", "o", "u", "y"];

const createEventBuilder = (
	rule,
	collections
) => {
	return(
		<div id="rule-statement" className="cb-font-b9">
			{_getMain(rule)}
			{_getConditions(rule, collections)}
		</div>
	);
};

const _getMain = (rule) => {
	let eventTypeString = "an event";
	let templateString = "";

	if (rule.eventType) {
		// -- add event type if present
		let eventSubtypeString = "";
		const selectedEventType = rule.eventTypes.filter(et => et.eventTypeId === rule.eventType)[0];
		if (selectedEventType) {
			if (rule.eventSubtype) {
				// -- add event subtype if present
				const selectedEventSubtype = selectedEventType.subtypes.filter(st => st.id === rule.eventSubtype)[0];
				if (selectedEventSubtype) {
					eventSubtypeString = `${selectedEventSubtype.name} - `;
				}
			}

			eventTypeString = `${eventSubtypeString}${selectedEventType.name}`;
			if (!eventTypeString.toLowerCase().endsWith("event")) {
				eventTypeString += " event";
			}

			eventTypeString = `${VOWELS.includes(eventTypeString.toLowerCase().charAt(0)) ? "an" : "a"} ${eventTypeString}`;
		}
	}

	if (rule.template) {
		// -- add event template if present
		const selectedTemplate = rule.availableTemplates.filter(template => template.id === rule.template)[0];
		if (selectedTemplate) {
			templateString = getTranslation("global.ruleBuilder.createEvent.templateString", selectedTemplate.name);
		}
	}

	return <Translate value="global.ruleBuilder.createEvent.alertMe" primaryValue={eventTypeString} secondaryValue={templateString}/>;
};

export default createEventBuilder;