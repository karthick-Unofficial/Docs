import { authService } from "client-app-core";

const loggedInUser = authService.getLoggedInUser();

export const initialState = {
	isAuthenticated: loggedInUser !== null ? true : false,
	userId: loggedInUser ? loggedInUser.userId : null,
	email: loggedInUser ? loggedInUser.email : null
};

const identity = (state = initialState, action) => {
	switch (action.type) {
		case "IDENTITY_INVALIDATED":
			return Object.assign({}, state, {
				isAuthenticated: false,
				userId: null,
				email: null
			});

		default:
			return state;
	}
};

export default identity;
