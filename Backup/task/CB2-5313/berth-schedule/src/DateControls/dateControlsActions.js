import * as t from "./actionTypes";

export const setNextDay = () => {
	return {
		type: t.SET_NEXT_DAY
	};
};

export const setPreviousDay = () => {
	return {
		type: t.SET_PREVIOUS_DAY
	};
};

export const setToday = () => {
	return {
		type: t.SET_TODAY
	};
};

export const setDay = date => {
	return {
		type: t.SET_DAY,
		payload: { date }
	};
};
