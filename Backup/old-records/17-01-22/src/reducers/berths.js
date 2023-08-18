const initialBerthsState = [];

const berths = (state = initialBerthsState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "BERTHS_RECEIVED": {
			const { berths } = payload;
			return berths;
		}
		default:
			return state;
	}
};

export default berths;
