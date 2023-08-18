const org = (state = {
	orgUsers: null
}, action) => {
	switch (action.type) {
		case "FETCH_ORG_USERS_SUCCESS":
			return Object.assign({}, state, {
				orgUsers: action.payload
			});
		default: return state;
	}
};

export default org;