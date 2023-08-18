export const initialState = {
	newUserErrorMessage: null,
	passwordChangeError: null,
	shareDialogError: null,
	createOrgError: null
};

const errors = (state = initialState, action) => {
	switch (action.type) {
		case "CREATE_USER_SUCCESS":
		case "CREATE_ORG_SUCCESS":
			return Object.assign({}, state, {
				newUserErrorMessage: null,
				createOrgError: null
			});

		case "CREATE_ORG_ERROR":
			return {
				...state,
				createOrgError: action.message
			};

		case "CREATE_USER_ERROR":
			return Object.assign({}, state, {
				newUserErrorMessage: action.message
			});
			
		case "IS_SUBMITTING_PASSWORD":
			return {
				...state,
				passwordChangeError: ""
			};

		case "PASSWORD_CHANGE_SUCCESS":
			return {
				...state,
				passwordChangeError: ""
			};

		case "PASSWORD_CHANGE_ERROR":
			return {
				...state,
				passwordChangeError: action.message
			};

		case "CLEAR_ORG_ERROR": 
			return {
				...state,
				createOrgError: null
			};

		case "CLEAR_PASSWORD_STATE":
			return {
				...state,
				passwordChangeError: ""
			};

		case "CLOSE_SHARE_DIALOG":
			return Object.assign({}, state, {
				shareDialogError: null
			});

		case "SHARE_DIALOG_ERROR":
			return Object.assign({}, state, {
				error: action.error

			});

		case "SHARE_INT_SUCCESS":
			return Object.assign({}, state, {
				error: null
			});

		case "REFRESH_ECOSYSTEM_SUCCESS":
			return initialState;

		default:
			return state;
	}
};

export default errors;