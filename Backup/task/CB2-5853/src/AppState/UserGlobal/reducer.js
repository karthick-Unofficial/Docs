export const initialState = {};

const userGlobal = (state = initialState, action) => {
	switch (action.type) {
		case "GET_FAV_EVENT_TEMPLATE":
			return {
				...state,
				eventTemplateFavorites: action?.payload?.eventTemplateFavorites || []
			};
		default:
			return state;
	}
};

export default userGlobal;
