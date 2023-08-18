
export const initialState = {
	reports: [],
	page: null,
	pagesLoaded: null,
	isPaginating: false,
	isGeneratingFile: false,
	error: null,
	pages: []
};

const reportViewer = (state = initialState, action) => {
	switch (action.type) {
		case "TOGGLE_GENERATING_PDF": {
			return {
				...state,
				isGeneratingFile: !state.isGeneratingFile
			};
		}
		
		case "SUBMITTING_REPORT": {
			return {
				...state,
				error: null
			};
		}

		case "REPORT_DATA_RECEIVED": {
			const data = action.payload.map(report => {
				return report;
			});

			return {
				...state,
				reports: data,
				pages: data,
				page: 1,
				pagesLoaded: 1,
				error: null
			};

		}

		case "BUILDER_ERROR":
			return {
				...state,
				error: action.error,
				isPaginating: false
			};

		case "WIPE_REPORTS": {
			return {
				...state,
				page: null,
				pagesLoaded: null,
				error: null,
				reports: [],
				pages: []
			};
		}

		case "REQUESTING_NEXT_PAGE": {
			return {
				...state,
				isPaginating: true,
				error: null
			};
		}

		case "PAGE_RECEIVED": {
			const pages = JSON.parse(JSON.stringify(state.pages));
			const newIndex = pages.length;
			pages[newIndex] = action.payload[0];
			return {
				...state,
				isPaginating: false,
				page: state.page + 1,
				pagesLoaded: state.pagesLoaded + 1,
				error: null,
				pages
			};
		}

		case "NEXT_PAGE": {
			return {
				...state,
				page: state.page + 1,
				error: null
			};
		}

		case "PREVIOUS_PAGE": {
			const newPage = state.page - 1;
			return {
				...state,
				page: newPage,
				error: null
			};
		}

		default:
			return state;
	}
};

export default reportViewer;