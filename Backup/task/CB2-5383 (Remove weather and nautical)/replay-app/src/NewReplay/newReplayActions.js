import * as t from "./actionTypes";
export const loadReplay = (coordinates) => {
	return {
		type: t.LOAD_REPLAY,
		payload: { coordinates }
	};
};