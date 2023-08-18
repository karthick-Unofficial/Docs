import React from "react";
import _getConditions from "./condition-builder.js";
import { Translate } from "orion-components/i18n";

const systemHealthBuilder = (rule, collections, targetAction, hasLinks, dispatch) => {
	// No linking/targeting
	if (!hasLinks) {
		targetAction = () => { };
	}
	return (
		<div id="rule-statement" className="cb-font-b9">
			<Translate value="global.ruleBuilder.systemHealthBuilder.alertMe" />{_getTargets(rule, collections, targetAction, hasLinks, dispatch)}
			{_getConditions(rule, collections, targetAction, hasLinks)}
		</div>
	);
};


const _getTargets = (rule, collections, targetAction, hasLinks, dispatch) => {
	if (rule.targets.length === 0) {
		return <Translate value="global.ruleBuilder.systemHealthBuilder.anySystem" />;
	} else {

		// Render the trigger portion of the rule statement

		return rule.targets.map((system, index) => {
			return (
				<span key={system.id} className='rule-statement-container'>
					{index > 0 &&
						<span><Translate value="global.ruleBuilder.systemHealthBuilder.or" /></span>
					}
					<span className={`${hasLinks ? "cb-font-link" : ""}`} onClick={() => dispatch(targetAction(system))} >
						{system.name}
					</span>
				</span>
			);
		});
	}
};


export default systemHealthBuilder;