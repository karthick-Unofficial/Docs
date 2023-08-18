const initialState = { page: "agenda" };	// schedule | agenda

const view = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "UPDATE_VIEW": {
			const { page } = payload;
			return {
				...state,
				page
			};
		}
		default:
			return state;
	}
};

export default view;
