import * as t from "./actionTypes.js";

export const setDockState = (dockState) => {
	return {
		type: t.SET_DOCK_STATE,
		payload: {
			dockState
		}
	};
};