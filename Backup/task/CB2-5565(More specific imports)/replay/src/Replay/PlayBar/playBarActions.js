import * as t from "./playBarActionTypes";
export const clearPlayBarValue = () => {
	return {
		type: t.CLEAR_PLAYBAR_VALUE
	};
};

export const setPlayBarValue = (time) => {
	return {
		type: t.SET_PLAYBAR_VALUE,
		payload: {
			playBarValue: time
		}
	};
};

export const updatePlaying = (isPlaying) => {
	return {
		type: t.UPDATE_PLAYING,
		payload: {
			playing: isPlaying
		}
	};
};