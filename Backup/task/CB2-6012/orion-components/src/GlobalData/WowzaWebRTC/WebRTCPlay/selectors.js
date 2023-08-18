const webrtcPlay = (state) => state?.webrtcPlay || [];

export const getWebrtcPlay = (state, streamName) => {
	const settings = webrtcPlay(state);
	return settings ? settings.find((item) => item.streamName === streamName) : undefined;
};
