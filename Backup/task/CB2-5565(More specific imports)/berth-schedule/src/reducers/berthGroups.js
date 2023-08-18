const initialState = [];

const berthGroups = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "BERTH_GROUPS_RECEIVED": {
			const { data } = payload;
			return data;
		}
		case "BERTH_GROUP_RECEIVED": {
			const { data } = payload;
			return [...state, data];
		}
		case "BERTH_GROUP_REMOVED": {
			const { id } = payload;
			return state.filter(group => group.id !== id);
		}
		case "BERTH_GROUP_UPDATED": {
			const { id, data } = payload;
			const newState = [...state];
			const index = newState.findIndex(group => group.id === id);
			newState[index] = data;
			return newState;
		}
		default:
			return state;
	}
};

export default berthGroups;
