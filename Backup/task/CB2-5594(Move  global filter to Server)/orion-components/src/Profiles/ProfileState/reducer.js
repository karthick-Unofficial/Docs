const initialState = {
	selectedEntity: null
};

const profile = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "SET_SELECTED_ENTITY": {
			const entity = payload;
			return {
				...state,
				selectedEntity: entity
			};
		}

		case "CLEAR_SELECTED_ENTITY": {
			return {
				...state,
				selectedEntity: null
			};
		}

		default:
			return state;
	}
};

export default profile;
