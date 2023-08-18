import * as WebRTCPlayActions from "./actionTypes";

const initialState = [];

const webrtcPlayReducer = (state = initialState, action) => {
	switch (action.type) {
		case WebRTCPlayActions.SET_WEBRTC_PLAY_WEBSOCKET:			
		{	const streamName = action.data.streamName;
			const newState = [...state];
			const existingItemIndex = newState.findIndex((item) => item.streamName === streamName);

			if (existingItemIndex === -1) {
				const newItem = {
					streamName: streamName,
					websocket: action.data.websocket,
					peerConnection: undefined,
					audioTrack: undefined,
					videoTrack: undefined,
					connected: false
				};
				newState.push(newItem);
			} else {
				newState[existingItemIndex].websocket = action.data.websocket;
			}
			return newState;
		}
		case WebRTCPlayActions.SET_WEBRTC_PLAY_PEERCONNECTION:
			return state.map((item) => {
				if (item.streamName === action.data.streamName) {
					return { ...item, peerConnection: action.data.peerConnection };
				}
				return item;
			});
		case WebRTCPlayActions.SET_WEBRTC_PLAY_AUDIO_TRACK:
			return state.map((item) => {
				if (item.streamName === action.data.streamName) {
					return { ...item, audioTrack: action.data.audioTrack };
				}
				return item;
			});
		case WebRTCPlayActions.SET_WEBRTC_PLAY_VIDEO_TRACK:
			return state.map((item) => {
				if (item.streamName === action.data.streamName) {
					return { ...item, videoTrack: action.data.videoTrack };
				}
				return item;
			});
		case WebRTCPlayActions.SET_WEBRTC_PLAY_CONNECTED:
			return state.map((item) => {
				if (item.streamName === action.data.streamName) {
					return { ...item, connected: action.data.connected };
				}
				return item;
			});
		case WebRTCPlayActions.RESET_WEBRTC:			
			return state.filter((item) => item.streamName !== action.data.streamName);
		default:
			return state;
	}
};

export default webrtcPlayReducer;
