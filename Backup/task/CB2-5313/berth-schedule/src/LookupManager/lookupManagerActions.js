import * as t from "./actionTypes";

export const closeManager = () => {
	return {
		type: t.CLOSE_MANAGER
	};
};

export const selectManager = type => {
	return {
		type: t.SELECT_MANAGER,
		payload: { type }
	};
};
