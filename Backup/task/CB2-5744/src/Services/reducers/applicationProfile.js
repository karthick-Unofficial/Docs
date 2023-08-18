const initialState = {};

const applicationProfile = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "APPLICATION_PROFILE_RECEIVED": {
			return payload;
		}
		default:
			return state;
	}
};

export default applicationProfile;
