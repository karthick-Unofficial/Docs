// import { authService } from "client-app-core";

// const loggedInUser = authService.getLoggedInUser();

export const initialState = {
	isAuthenticated: false,
	isChecked: false,
	userId: null,
	email: null
};

const identity = (state = initialState, action) => {
	switch (action.type) {
		case "IDENTITY_INVALIDATED":
			return Object.assign({}, state, {
				isAuthenticated: false,
				userId: null,
				email: null
			});
		case "GET_IDENTITY_SUCCESS":
			return Object.assign({}, state, {
				isAuthenticated: true,
				isChecked: true,
				userId: action.user.userId,
				email: action.user.email
			});
		case "GET_IDENTITY_FAILURE":
			return Object.assign({}, state, {
				isAuthenticated: false,
				isChecked: true,
				userId: null,
				email: null,
				errMessage: action.errMsg
			});

		default:
			return state;
	}
};

export default identity;
