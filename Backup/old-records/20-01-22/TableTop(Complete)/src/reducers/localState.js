import * as actionTypes from "../actionTypes";
const initialState = {};

const localState = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SET_LOCAL_STATE: {
			const { component, key, value } = action;
			return {
				...state,
				[component]: {...(state[component] || {}), [key]: value}
			};
		}
		default:
			return state;
	}
};

export default localState;