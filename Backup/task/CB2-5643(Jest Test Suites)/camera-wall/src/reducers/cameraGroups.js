const initialState = {};

const cameraGroups = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "CAMERA_GROUP_RECEIVED": {
			const { group } = payload;
			const newState = { ...state };
			newState[group.id] = group;
			return newState;
		}
		case "CAMERA_GROUP_REMOVED": {
			const { groupId } = payload;
			const newState = { ...state };
			delete newState[groupId];
			return newState;
		}
		default:
			return state;
	}
};

export default cameraGroups;
