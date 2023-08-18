import React from "react";
import _getConditions from "./condition-builder.js";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const vesselEventBuilder = (
	rule,
	collections
) => {
	return(
		<div id="rule-statement" className="cb-font-b9">
			<Translate value="global.ruleBuilder.vesselEvent.alertMe" count={_getMain(rule, collections)}/>
			{_getTargets(rule, collections)}
			{_getConditions(rule, collections)}
		</div>
	);
};

const _getMain = (rule, collections) => {
	let main = "";
	switch (rule.trigger) {
		case "berth-assignment-created":
			main = getTranslation("global.ruleBuilder.vesselEvent.newBerthCreated");
			break;
		case "berth-assignment-approval":
			main = getTranslation("global.ruleBuilder.vesselEvent.berthApproved");
			break;
		case "berth-assignment-update":
			main = getTranslation("global.ruleBuilder.vesselEvent.assigmentUpdated");
			break;
		case "arrival":
			main = getTranslation("global.ruleBuilder.vesselEvent.arrival");
			break;
		case "departure":
			main = getTranslation("global.ruleBuilder.vesselEvent.departure");
			break;
		case "berth-security-violation":
			main = getTranslation("global.ruleBuilder.vesselEvent.securityViolation");
			break;
		default:
			break;
	}

	return main;
};

const _getTargets = (rule, collections) => {
	if (rule.targets.length === 0) {
		return "";
	} else {
		return rule.targets.map((berth, index) => {
			return (
				<span key={berth.id} className="rule-statement-container">
					{index === 0 && <span>{rule.trigger === "berth-assignment-update" ? <Translate value="global.ruleBuilder.vesselEvent.for"/> : <Translate value="global.ruleBuilder.vesselEvent.at"/>}</span>}
					{index > 0 && <span><Translate value="global.ruleBuilder.vesselEvent.or"/></span>}
					<span>
						{berth.name}
					</span>
				</span>
			);
		});
	}
};

export default vesselEventBuilder;