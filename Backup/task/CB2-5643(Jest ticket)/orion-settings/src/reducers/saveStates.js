export const initialState = {
	permissionsSaveState: "",
	appsSaveState: "",
	integrationsSaveState: ""
};
const saveStates = (state = initialState, action) => {
	switch (action.type) {
		case "REFRESH_ECOSYSTEM_SUCCESS":
			return initialState;

		case "UPDATE_USER_PERMISSIONS":
		case "UPDATE_USER_ACTIVE":
			return {
				...state,
				permissionsSaveState: "saving"
			};

		case "UPDATE_USER_PERMISSIONS_COMPLETE":
		case "UPDATE_USER_ACTIVE_COMPLETE":
			return {
				...state,
				permissionsSaveState: "done"
			};

		case "UPDATE_USER_PERMISSIONS_FAILED":
		case "UPDATE_USER_ACTIVE_FAILED":
			return {
				...state,
				permissionsSaveState: "failed"
			};

		case "ASSIGN_APP":
		case "ADD_APPLICATION":
		case "REMOVE_APPLICATION":
			return {
				...state,
				appsSaveState: "saving"
			};

		case "ASSIGN_APP_COMPLETE":
		case "ADD_APPLICATION_COMPLETE":
		case "REMOVE_APPLICATION_COMPLETE":
			return {
				...state,
				appsSaveState: "done"
			};

		case "ASSIGN_APP_FAILED":
		case "ADD_APPLICATION_FAILED":
		case "REMOVE_APPLICATION_FAILED":
			return {
				...state,
				appsSaveState: "failed"
			};

		case "ASSIGN_INTEGRATION":
		case "ADD_INTEGRATION":
		case "REMOVE_INTEGRATION":
		case "UPDATE_INTEGRATION":
			return {
				...state,
				integrationsSaveState: "saving"
			};

		// case 'UPDATE_INTEGRATION_COMPLETE':
		case "ASSIGN_INTEGRATION_COMPLETE":
		case "ADD_INTEGRATION_COMPLETE":
		case "REMOVE_INTEGRATION_COMPLETE":
		case "UPDATE_INTEGRATION_COMPLETE":
			return {
				...state,
				integrationsSaveState: "done"
			};

		case "ADD_INTEGRATION_FAILED":
		case "REMOVE_INTEGRATION_FAILED":
		case "ASSIGN_INTEGRATION_FAILED":
		case "UPDATE_INTEGRATION_FAILED":
			return {
				...state,
				integrationsSaveState: "failed"
			};

		case "RESET_SAVE_STATE":
			return {
				...state,
				integrationsSaveState: "",
				appsSaveState: "",
				permissionsSaveState: ""
			};

		default:
			return state;
	}

};

export default saveStates;