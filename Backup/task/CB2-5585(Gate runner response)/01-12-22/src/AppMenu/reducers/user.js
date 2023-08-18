export const initialState = {
	isHydrated: false,
	profile: {}
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case "HYDRATE_USER_SUCCESS":
			return Object.assign({}, state, {
				isHydrated: true,
				profile: action.user
			});

		case "REFRESH_USER_SUCCESS":
			return Object.assign({}, state, {
				profile: action.user
			});

		default: 
			return state;
	}
};

export default user;