import * as t from "./actionTypes";

export const startPlay = (streamName) => {
	return {
		type: t.SET_PLAY_FLAGS,
		playStart: true,
		streamName:streamName
	};
};

export const stopPlay = (streamName) => {
	return {
		type: t.SET_PLAY_FLAGS,
		playStop: true,
		streamName:streamName
	};
};

export const setPlayFlags = (playStart, playStarting, streamName) => {
	return {
		type: t.SET_PLAY_FLAGS,
		playStart,
		playStarting,
		streamName:streamName
	};
};