export const initialState = [];

const reportCategories = (state = initialState, action) => {
	switch (action.type) {
		case "REPORT_TYPES_RECEIVED": {
			let newState = state.slice();

			Object.values(action.payload).forEach((report) => {
				newState = newState.includes(report.category) ? newState : [...newState, report.category];
			});

			return newState;
		}

		default:
			return state;
	}
};

export default reportCategories;
