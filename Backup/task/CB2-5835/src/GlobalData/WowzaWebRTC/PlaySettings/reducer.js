import * as PlaySettingsActions from "./actionTypes";

const initialState = [];

const webRTCPlaySettingsReducer = (state = initialState, action) => {
	switch (action.type) {
		case PlaySettingsActions.SET_PLAY_SETTINGS: {
			const streamName = action.streamName;
			const newState = [...state];
			const existingItemIndex = newState.findIndex((item) => item.streamName === streamName);

			if (existingItemIndex === -1) {
				const newItem = {
					signalingURL: action.signalingURL,
					applicationName: action.applicationName,
					streamName: action.streamName,
					playStart: false,
					playStarting: false,
					playStop: false,
					playStopping: false
				};
				newState.push(newItem);
			} else {
				newState[existingItemIndex].signalingURL = action.signalingURL;
				newState[existingItemIndex].applicationName = action.applicationName;
				newState[existingItemIndex].streamName = action.streamName;
			}
			return newState;
		}
		case PlaySettingsActions.SET_PLAY_FLAGS:
			return state.map((playFlagsState) => {
				if (playFlagsState.streamName !== action.streamName) {
					return playFlagsState;
				}
				return {
					...playFlagsState,
					playStart: action.playStart ?? playFlagsState.playStart,
					playStarting: action.playStarting ?? playFlagsState.playStarting,
					playStop: action.playStop ?? playFlagsState.playStop,
					playStopping: action.playStopping ?? playFlagsState.playStopping
				};
			});

		case PlaySettingsActions.RESET_PLAY_SETTINGS:
			return state.filter((item) => item.streamName !== action.data.streamName);
		default:
			return state;
	}
};

export default webRTCPlaySettingsReducer;
