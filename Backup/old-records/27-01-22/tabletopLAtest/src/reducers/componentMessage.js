import * as actionTypes from "../actionTypes";
const initialState = {
	message: null
};

const componentMessage = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SEND_COMPONENT_MESSAGE:
			return {
				message: action.message
			};
		case actionTypes.CLEAR_COMPONENT_MESSAGE:
			return {
				message: null
			};
		default:
			return state;
	}
};

export default componentMessage;