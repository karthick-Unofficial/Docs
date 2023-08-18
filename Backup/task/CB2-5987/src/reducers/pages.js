const initialState = [];

const pages = (state = initialState, action) => {
	switch (action.type) {
		case "REPORT_DATA_RECEIVED": {
			const data = action.payload.map((report) => {
				return report;
			});

			return data;
		}

		case "PAGE_RECEIVED": {
			const pages = JSON.parse(JSON.stringify(state));
			const newIndex = pages.length;
			pages[newIndex] = action.payload[0];

			return pages;
		}

		case "WIPE_REPORTS": {
			return initialState;
		}

		default:
			return state;
	}
};

export default pages;
