export const initialState = {
	isQuerying: false,
	queryDialogError: null,
	querySearchValue: "",
	searchResults: [],
	queryId: 0,
	ruleToEdit: {}
};

const profilePage = (state = initialState, action) => {
	switch (action.type) {

		case "UPDATE_TRACK_SEARCH":
			return {
				...state,
				querySearchValue: action.payload,
				queryDialogError: null,
				isQuerying: true,
				queryId: state.queryId + 1
			};

		case "TOGGLE_QUERYING":
			return {
				...state,
				isQuerying: !state.isQuerying
			};

		case "CLOSE_SUBJECT_DIALOG":
			return {
				...state,
				pinDialogOpen: false,
				queryDialogError: null,
				searchResults: []
			};

		case "SHOW_SEARCH_RESULTS":
			return {
				...state,
				searchResults: action.payload,
				queryDialogError: null,
				isQuerying: false
			};

		case "QUERY_DIALOG_ERROR":
			return {
				...state,
				queryDialogError: action.err,
				isQuerying: false
			};

		case "CLEAR_SEARCH_RESULTS":
			return {
				...state,
				queryDialogError: null,
				isQuerying: false,
				searchResults: []
			};

		default:
			return state;
	}	
};

export default profilePage;
