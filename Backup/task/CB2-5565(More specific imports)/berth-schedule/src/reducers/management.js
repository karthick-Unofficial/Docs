const initialState = { open: false, type: null, data: null };

const management = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "OPEN_MANAGER":
			return {
				...state,
				open: true
			};
		case "CLOSE_MANAGER":
			return {
				...state,
				open: false,
				type: null
			};
		case "SELECT_MANAGER": {
			const { type } = payload;
			return {
				...state,
				type
			};
		}
		default:
			return state;
	}
};

export default management;
