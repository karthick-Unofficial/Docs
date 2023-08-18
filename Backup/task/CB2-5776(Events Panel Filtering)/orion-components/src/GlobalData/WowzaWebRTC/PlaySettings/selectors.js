const playSettings = (state) => state?.playSettings || [];

export const getPlaySettings = (state, streamName) => {
	const settings = playSettings(state);
	return settings ? settings.find((item) => item.streamName === streamName) : undefined;
};
