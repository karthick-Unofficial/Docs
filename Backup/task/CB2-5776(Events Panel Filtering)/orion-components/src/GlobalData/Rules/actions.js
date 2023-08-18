import * as t from "./actionTypes";
import { ruleService } from "client-app-core";

// const ruleBatchReceived = rules => {
// 	return {
// 		type: t.RULE_BATCH_RECEIVED,
// 		payload: {
// 			rules
// 		}
// 	};
// };

const ruleReceived = (rule) => {
	return {
		type: t.RULE_RECEIVED,
		payload: {
			rule
		}
	};
};

const ruleRemoved = (rule) => {
	return {
		type: t.RULE_REMOVED,
		payload: {
			rule
		}
	};
};

export const subscribeRules = (optionalEntityId = null) => {
	return (dispatch) => {
		ruleService.streamRules(optionalEntityId, (err, res) => {
			if (err) console.log(err);
			else if (!res) return;
			else {
				const rule = res.new_val;
				if (!rule || rule.deleted === true) {
					dispatch(ruleRemoved(!rule ? res.old_val : rule));
				} else {
					dispatch(ruleReceived(rule));
				}
			}
		});
	};
};
