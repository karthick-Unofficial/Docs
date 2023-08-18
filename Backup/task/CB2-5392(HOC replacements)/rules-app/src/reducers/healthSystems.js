const items = (state = [], action) => {
	switch (action.type) {
		case "FETCH_HEALTH_SYSTEMS_SUCCESS":
			return action.payload.systems.map((item) => item.id);

		default: return state;
	}
};

const itemsById = (state = {}, action) => {
	switch (action.type) {
		case "FETCH_HEALTH_SYSTEMS_SUCCESS":
			return Object.assign({}, action.payload.systems.reduce((total, current) => {
				total[current.id] = current;
				return total;
			}, {}));

		default: return state;
	}
};



const healthSystems = (state = {
	items: [],
	itemsById: {}
}, action) => {
	switch (action.type) {
		case "FETCH_HEALTH_SYSTEMS_SUCCESS":
			return Object.assign({}, state, {
				items: items(state.items, action),
				itemsById: itemsById(state, action)
			});




		default: return state;
	}
};

export default healthSystems;