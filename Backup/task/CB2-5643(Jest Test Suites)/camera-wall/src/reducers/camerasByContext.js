const _ = require("lodash");
const initialState = {};

const camerasByContext = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "CONTEXTUAL_CAMERA_RECEIVED": {
			const { id, cameras } = payload;
			const newCameras = state[id] ? _.union(state[id], cameras) : cameras;
			return {
				...state,
				[id]: newCameras
			};
		}

		case "CONTEXTUAL_CAMERA_REMOVED": {
			const { id, cameras } = payload;
			const newCameras = state[id].filter((id) => !cameras.includes(id));
			return {
				...state,
				[id]: newCameras
			};
		}

		case "CONTEXTUAL_CAMERA_BATCH_RECEIVED": {
			const { id, cameras } = payload;
			return {
				...state,
				[id]: cameras
			};
		}

		default:
			return state;
	}
};

export default camerasByContext;
