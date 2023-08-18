const initialState = {
	open: false,
	vessels: {},
	subscriptions: []
};

const map = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "OPEN_BERTH_MAP":
			return {
				...state,
				open: true
			};
		case "CLOSE_BERTH_MAP":
			return {
				...state,
				open: false
			};
		case "TRACK_RECEIVED": {
			const { data } = payload;
			const newVessels = { ...state.vessels };
			newVessels[data.id] = data;
			return {
				...state,
				vessels: newVessels
			};
		}
		case "ADD_SUBSCRIPTION": {
			const { sub } = payload;
			const newSubscriptions = [ ...state.subscriptions, sub];
			return {
				...state,
				subscriptions: newSubscriptions
			};
		}
		case "REMOVE_SUBSCRIPTIONS":
			return {
				...state,
				subscriptions: []
			};
		case "BERTH_ASSIGNMENT_REMOVED": {
			const { id } = payload;
			const newVessels = { ...state.vessels };
			Object.keys(newVessels).forEach(key => {
				if (newVessels[key].entityData.properties.assignment === id) {
					delete newVessels[key];
				}
			});
			return {
				...state,
				vessels: newVessels
			};
		}
		default:
			return state;
	}
};

export default map;
