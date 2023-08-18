import * as actionTypes from "../actionTypes";
const initialState = {
	errorMessage: null
};

const error = (state = initialState, action) => {
	const { error } = action;

	if (error) {
		return {
			errorMessage: error
		};
	} else if (action.type === actionTypes.CLEAR_ERROR) {
		return {
			errorMessage: null
		};
	}

	return state;
};

export default error;