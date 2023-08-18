const usersDialog = (
	state = {
		users: [],
		app: null,
		mode: null
	},
	action
) => {
	switch (action.type) {
		case "OPEN_USERS_DIALOG":
			return Object.assign({}, state, {
				app: action.app,
				users: [],
				mode: action.mode
			});

		case "CLOSE_USERS_DIALOG":
			return Object.assign({}, state, {
				app: null,
				users: []
			});

		case "USERS_DIALOG_LOAD_SUCCESS":
			return Object.assign({}, state, {
				users: action.users
			});

		default:
			return state;
	}
};

const shareDialog = (
	state = {
		isSubmitting: false,
		isPopulating: false
	},
	action
) => {
	switch (action.type) {
		case "OPEN_SHARE_DIALOG":
			return Object.assign({}, state, {
				intId: action.intId
			});

		case "CLOSE_SHARE_DIALOG":
			return Object.assign({}, state, {
				intId: null
			});

		// case "GET_SHARE_PROFILE_SUCCESS":
		// 	return Object.assign({}, state, {
		// 		isSharedTo: action.result,
		// 		isPopulating: false
		// 	});

		// case "SHARE_INT_SUCCESS":
		// 	return Object.assign({}, state, {
		// 		isSharedTo: null
		// 	});

		default:
			return state;
	}
};

export const initialState = {
	usersDialog: {
		users: [],
		app: null
	},
	shareDialog: {
		intId: null
	},
	permissionsDialog: {
		hasError: false
	}
};

const dialogData = (state = initialState, action) => {
	switch (action.type) {
		case "OPEN_USERS_DIALOG":
		case "CLOSE_USERS_DIALOG":
		case "USERS_DIALOG_LOAD_SUCCESS":
			return Object.assign({}, state, {
				usersDialog: usersDialog(state.usersDialog, action)
			});

		case "OPEN_SHARE_DIALOG":
		case "SHARE_DIALOG_ERROR":
		case "CLOSE_SHARE_DIALOG":
		case "IS_SUBMITTING_SHARE_DIALOG":
		case "SHARE_INT_SUCCESS":
			return Object.assign({}, state, {
				shareDialog: shareDialog(state.shareDialog, action)
			});

		// ================

		case "PERMISSIONS_DIALOG_ERROR":
			return {
				...state,
				permissionsDialog: {
					...state.permissionsDialog
				}
			};

		case "REFRESH_ECOSYSTEM_SUCCESS":
			return initialState;

		default:
			return state;
	}
};

export default dialogData;