import { combineReducers } from "redux";

function auth(
	state = {
		isFetching: false,
		isAuthenticated: localStorage.getItem("id_token") ? true : false,
		errorMessage: ""
	},
	action
) {
	switch (action.type) {
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
		case "LOGOUT_SUCCESS":
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false
			});
		case "RESET_ERROR":
			return Object.assign({}, state, {
				errorMessage: ""
			});
		default:
			return state;
	}
}

// We combine the reducers here so that they
// can be left split apart above
const AuthApp = combineReducers({
	auth
	// quotes
});

export default AuthApp;
