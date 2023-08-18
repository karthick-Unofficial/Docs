const initialFeedState = {};

const userFeeds = (state = initialFeedState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FEED_PERMISSION_RECEIVED": {
			const { feedId, name, canView, source, entityType, ownerOrg, mapIconTemplate, profileIconTemplate, renderSilhouette, marineTrafficVisible } = payload;
			return {
				...state,
				[feedId]: { feedId, name, canView, source, entityType, ownerOrg, mapIconTemplate, profileIconTemplate, renderSilhouette, marineTrafficVisible }
			};
		}

		default:
			return state;
	}
};

export default userFeeds;
