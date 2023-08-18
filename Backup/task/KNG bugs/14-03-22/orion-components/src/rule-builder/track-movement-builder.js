import React from "react";
import _getConditions from "./condition-builder.js";
import { Translate } from "orion-components/i18n/I18nContainer";

const trackMovementBuilder = (rule, collections, targetAction, hasLinks) => {
	// No linking/targeting
	if (!hasLinks) {
		targetAction = () => {};
	}
	return (
		<div id="rule-statement" className="cb-font-b9">
			<Translate value="global.ruleBuilder.trackMovementBuilder.alertMe"/>{_getSubjects(rule, collections, targetAction, hasLinks)}
			<span>
				{" " + rule.trigger}
				{rule.trigger === "cross" ? "es " : "s "}
			</span>
			{_getTargets(rule, collections, targetAction, hasLinks)}
			{_getConditions(rule, collections, targetAction, hasLinks)}
		</div>
	);
};

const _getSubjects = (rule, collections, targetAction, hasLinks) => {
	if (rule.subject.length === 0) {
		return <Translate value="global.ruleBuilder.trackMovementBuilder.anyTrack"/>;
	} else {
		// Render the subject portion of the rule statement
		if (rule.subject[0].entityType === "feed") {
			// -- any tracks within 1 or more feeds
			let subjectStrings = ["any track in "];
			rule.subject.forEach((feed, index) => {
				subjectStrings.push(<span key={index}>{index > 0 && <Translate value="global.ruleBuilder.trackMovementBuilder.or"/>}{feed.name}</span>);
			});

			return subjectStrings;
		} else {
			// -- specific tracks
			return rule.subject.map((track, index) => {
				return (
					<span key={track.id} className="rule-statement-container">
						{index > 0 && <span><Translate value="global.ruleBuilder.trackMovementBuilder.or"/></span>}
						<span
							className={`${hasLinks ? "cb-font-link" : ""}`}
							onClick={() => {
								targetAction(
									track.id,
									track.name || track.id,
									"track",
									"profile",
									"secondary"
								);
							}}
						>
							{track.name}
						</span>
					</span>
				);
			});
		}
	}
};

const _getTargets = (rule, collections, targetAction, hasLinks) => {
	if (rule.targets.length === 0) {
		return rule.trigger == "cross" ? <Translate value="global.ruleBuilder.trackMovementBuilder.anyLine"/> : <Translate value="global.ruleBuilder.trackMovementBuilder.anyPolygon"/>;
	} else {
		// Render the trigger portion of the rule statement

		return rule.targets.map((poly, index) => {
			return (
				<span key={poly.id} className="rule-statement-container">
					{index > 0 && <span><Translate value="global.ruleBuilder.trackMovementBuilder.or"/></span>}
					<span
						className={`${hasLinks ? "cb-font-link" : ""}`}
						onClick={() =>
							targetAction(
								poly.id,
								poly.entityData.properties.name,
								poly.entityType,
								"profile",
								"secondary"
							)
						}
					>
						{poly.entityData.properties.name}
					</span>
				</span>
			);
		});
	}
};

export default trackMovementBuilder;
