// import _ from "lodash";

const initialRulesState = {};

const rules = (state = initialRulesState, action) => {
	const { type, payload } = action;

	switch (type) {
		// case "RULE_BATCH_RECEIVED": {
		// 	const { rules } = payload;

		// 	const initialBatch = _.keyBy(rules, "id");

		// 	return {
		// 		...state,
		// 		...initialBatch
		// 	};
		// }

		case "RULE_RECEIVED": {
			const { rule } = payload;
			return {
				...state,
				[rule.id]: rule
			};
		}

		case "RULE_REMOVED": {
			const { rule } = payload;
			const newState = { ...state };

			delete newState[rule.id];

			return {
				...newState
			};
		}

		default:
			return state;
	}
};

export default rules;
