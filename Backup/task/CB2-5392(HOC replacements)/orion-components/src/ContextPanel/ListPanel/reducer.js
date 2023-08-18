export const initialState = {
	searchValue: "",
	searchResult: [],
	mapFilters: {},
	eventSearch: "",
	eventTemplateSearch: ""
};

const listPanel = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "UPDATE_SEARCH_VALUE": {
			const { query } = payload;
			return {
				...state,
				searchValue: query
			};
		}

		case "UPDATE_SEARCH_RESULTS": {
			const { results } = payload;
			return {
				...state,
				searchResults: results
			};
		}

		case "CLEAR_SEARCH_RESULTS":
			return {
				...state,
				searchResults: []
			};

		case "ADD_TO_MAP_FILTERS": {
			const { collectionId, members } = payload;
			return {
				...state,
				mapFilters: {
					...state.mapFilters,
					[collectionId]: members
				}
			};
		}

		case "REMOVE_FROM_MAP_FILTERS": {
			const { collectionId } = payload;
			const newMapFilters = { ...state.mapFilters };

			delete newMapFilters[collectionId];

			return {
				...state,
				mapFilters: newMapFilters
			};
		}

		case "CLEAR_MAP_FILTERS":
			return {
				...state,
				mapFilters: {}
			};
	
		case "UPDATE_EVENT_SEARCH": {
			const { query } = payload;
			return {
				...state,
				eventSearch: query
			};
		}
		
		case "UPDATE_EVENT_TEMPLATE_SEARCH": {
			const { query } = payload;
			return {
				...state,
				eventTemplateSearch: query
			};
		}

		default:
			return state;
	}
};

export default listPanel;
