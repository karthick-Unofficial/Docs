const initialState = {
	selectedEntity: {
		type: null,
		id: null
	}
};

const viewing = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case "FETCH_PROFILE_SUCCESS":
			return {
				selectedEntity: {
					type: "user",
					id: action.user.id
				}
				// user: action.user,
				// org: null
			};

		case "FETCH_ORG_SUCCESS":
			return {
				selectedEntity: {
					type: "org",
					id: action.id
				}
				// user: null,
				// org: action.org
			};

		default:
			return state;
	}
};

export default viewing;