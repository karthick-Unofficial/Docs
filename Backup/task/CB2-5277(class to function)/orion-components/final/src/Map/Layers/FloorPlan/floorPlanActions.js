import * as t from "./actionTypes";

export const setCoordinates = coordinates => {
	return {
		type: t.COORDINATES_SET,
		payload: { coordinates }
	};
};
