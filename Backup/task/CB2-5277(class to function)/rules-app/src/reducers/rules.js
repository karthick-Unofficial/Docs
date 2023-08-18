const rules = (state = [], action) => {
	switch (action.type) {
    
		case "ADD_RULE_SUCCESS": {
			const addState = state.slice();

			const ruleBody = JSON.parse(action.body);

			ruleBody.id = action.id;
			
			const addUpdate = [...addState, ruleBody];	

			return addUpdate;
		}
		case "DELETE_RULE_SUCCESS": {
			return state.filter(rule => rule.id !== action.id);
		}
	    case "FETCH_RULES_SUCCESS":
			return action.rules;
		case "UPDATE_RULE_SUCCESS": {
			// Replace updated rule with new info
			const newState = state.slice();

			const index = newState.findIndex((rule) => {
				return rule.id === action.id;
			});

			const body = JSON.parse(action.body);

			const update = {
				...newState[index],
				...body
			};

			newState[index] = update;

			return newState;
		}
	  default:
			return state;
	}
};

export default rules;