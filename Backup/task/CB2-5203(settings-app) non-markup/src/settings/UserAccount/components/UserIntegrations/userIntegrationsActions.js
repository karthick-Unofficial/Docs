import * as t from "../../../actionTypes";

// Also being used in UserIntegrations and UserApps
export function resetSaveState() {
	return {
		type: t.RESET_SAVE_STATE
	};
}

export const addIntegration = (userId, integration, config) => {
	return {
		userId,
		integration,
		config,
		type: t.ADD_INTEGRATION
	};
};

export const removeIntegration = (userId, feedId) => {
	return {
		userId,
		feedId,
		type: t.REMOVE_INTEGRATION
	};
};

export const updateIntegration = (userId, feedId, config, orgIntId) => {
	return {
		userId,
		feedId,
		config,
		orgIntId,
		type: t.UPDATE_INTEGRATION
	};
};
