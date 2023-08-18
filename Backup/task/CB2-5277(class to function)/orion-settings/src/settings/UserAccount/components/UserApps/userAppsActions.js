import * as t from "../../../actionTypes";

// Also being used in UserIntegrations and UserApps
export function resetSaveState() {
	return {
		type: t.RESET_SAVE_STATE
	};
}

export const addApplication = (userId, appId, config) => {
	return {
		userId,
		appId,
		config,
		type: t.ADD_APPLICATION
	};
};

export const removeApplication = (userId, appId) => {
	return {
		userId,
		appId,
		type: t.REMOVE_APPLICATION
	};
};
