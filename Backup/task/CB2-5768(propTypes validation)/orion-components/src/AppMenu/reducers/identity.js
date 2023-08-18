import { authService } from "client-app-core";

const loggedInUser = authService.getLoggedInUser();

export const initialState = {
	isAuthenticated: loggedInUser !== null ? true : false,
	userId: loggedInUser ? loggedInUser.userId : null,
	email: loggedInUser ? loggedInUser.email : null,
	errorMessage: ""
};

const identity = (state = initialState, action) => {
	switch (action.type) {
		case "IDENTITY_INVALIDATED":
			return Object.assign({}, state, {
				isAuthenticated: false,
				userId: null,
				email: null
			});

		case "LOGIN_REQUEST":
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false,
				errorMessage: ""
			});
		case "LOGIN_SUCCESS":
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: true,
				errorMessage: ""
			});
		case "LOGIN_FAILURE":
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false,
				errorMessage: action.errorMessage
			});

		default:
			return state;
	}
};

export default identity;
