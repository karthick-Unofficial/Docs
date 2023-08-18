export const initialState = {
	isHydrated: false,
	profile: {},
	sessionEnded: false,
	firstUseText: "",
	loggedOutManually: false
};

const user = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "HYDRATE_USER_SUCCESS":
			return Object.assign({}, state, {
				isHydrated: true,
				profile: action.user
			});
		case "SESSION_ENDED": {
			return {
				...state,
				sessionEnded: true
			};
		}
		case "FIRST_USE_TEXT_RECEIVED": {
			const { text } = payload;
			return {
				...state,
				firstUseText: text
			};
		}
		case "FIRST_USE_CONFIRMED": {
			const newProfile = { ...state.profile };
			newProfile["firstUseAck"] = true;
			return {
				...state,
				profile: newProfile
			};
		}
		case "MANUAL_LOGOUT": {
			return {
				...state,
				sessionEnded: true,
				loggedOutManually: true
			};
		}

		default:
			return state;
	}
};

export default user;
