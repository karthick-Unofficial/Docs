import * as t from "./actionTypes";

/*
 * Enter or exit drawing mode
 * @params active: boolean
 * @params editing: boolean
 * @params type: type of shape to be drawn
 */
export const setDrawingMode = (active = false, editing = false, type = null) => {
	return {
		type: t.SET_DRAWING_MODE,
		payload: {
			active,
			editing,
			type
		}
	};
};
