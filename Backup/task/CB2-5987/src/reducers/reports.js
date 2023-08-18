export const initialState = [];

const reports = (state = initialState, action) => {
	switch (action.type) {
		case "REPORT_DATA_RECEIVED": {
			const data = action.payload.map((report) => {
				return report;
			});

			return data;
		}

		case "WIPE_REPORTS": {
			return initialState;
		}

		default:
			return state;
	}
};

export default reports;
