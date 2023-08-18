import * as t from "./actionTypes";

/*
 * Update the search value in state
 * @param query: user input string
 */
export const updateSearchValue = (query) => {
	return {
		meta: {
			debounce: "search"
		},
		type: t.UPDATE_SEARCH_VALUE,
		payload: { query }
	};
};

/*
 * Update the search results in state
 * @param results: an array of result objects
 */
export const updateSearchResults = (results) => {
	return {
		type: t.SHOW_SEARCH_RESULTS,
		payload: { results }
	};
};

/*
 * Clear the search results from state
 */
export const clearSearchResults = () => {
	return {
		type: t.SHOW_SEARCH_RESULTS
	};
};

/*
 * Add a collection's members to filter entities on map by
 * @param collectionId: collection's ID
 * @param members: array of collection's member entity IDs
 */
export const addToMapFilters = (collectionId, members) => {
	return {
		type: t.ADD_TO_MAP_FILTERS,
		payload: {
			collectionId,
			members
		}
	};
};

/*
 * Remove a collection's entities from filters
 * @param collectionId: collection's ID
 */
export const removeFromMapFilters = (collectionId) => {
	return {
		type: t.REMOVE_FROM_MAP_FILTERS,
		payload: { collectionId }
	};
};

/*
 * Clear all collections from filters
 */
export const clearMapFilters = () => {
	return {
		type: t.CLEAR_MAP_FILTERS
	};
};

/*
 * Update the event search value in state
 * @param query: user input string
 */
export const updateEventSearch = (query) => {
	return {
		meta: {
			debounce: "search"
		},
		type: t.UPDATE_EVENT_SEARCH,
		payload: { query }
	};
};

/*
 * Update the event template search value in state
 * @param query: user input string
 */
export const updateEventTemplateSearch = (query) => {
	return {
		meta: {
			debounce: "search"
		},
		type: t.UPDATE_EVENT_TEMPLATE_SEARCH,
		payload: { query }
	};
};
