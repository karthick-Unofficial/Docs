export const initialState = {
	isHydrated: false,
	profile: {},
	externalSystems: []
};

const organization = (state = initialState, action) => {
	const { type } = action;
	switch (type) {
		case "HYDRATE_USER_SUCCESS":
			return Object.assign({}, state, {
				isHydrated: true,
				profile: action.org,
				externalSystems: action.externalSystems
			});
		default:
			return state;
	}
};

export default organization;
