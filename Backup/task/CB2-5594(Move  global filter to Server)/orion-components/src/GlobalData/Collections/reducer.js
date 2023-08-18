const initialCollectionsState = {};

const collections = (state = initialCollectionsState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "COLLECTION_RECEIVED": {
			const { collection } = payload;
			return {
				...state,
				[collection.id]: collection
			};
		}

		case "COLLECTION_REMOVED": {
			const { collectionId } = payload;
			const newState = { ...state };

			delete newState[collectionId];

			return newState;
		}

		default:
			return state;
	}
};

export default collections;
