const initialState = [];
const sort = berths => {
	const sorted = berths.sort((a, b) => {
		if (a.beginningFootmark < b.beginningFootmark) {
			return -1;
		}
		if (a.beginningFootmark > b.beginningFootmark) {
			return 1;
		}
		return 0;
	});
	return sorted;
};
const berths = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "BERTHS_RECEIVED": {
			const { data } = payload;
			return sort(data);
		}
		case "BERTH_RECEIVED": {
			const { data } = payload;
			return sort([...state, data]);
		}
		case "BERTH_REMOVED": {
			const { id } = payload;
			return sort(state.filter(berth => berth.id !== id));
		}
		case "BERTH_UPDATED": {
			const { id, data } = payload;
			const newState = [...state];
			const index = newState.findIndex(berth => berth.id === id);
			newState[index] = data;
			return newState;
		}
		default:
			return state;
	}
};

export default berths;
