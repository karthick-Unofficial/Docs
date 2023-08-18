const initialState = {
	cameras: {},
	stagedItem: null
};

const cameraWall = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "ADD_CAMERA_BATCH": {
			const { cameras } = payload;
			return {
				...state,
				cameras: { ...state.cameras, ...cameras }
			};
		}
		case "ADD_CAMERA": {
			const { id, index } = payload;
			return {
				...state,
				cameras: { ...state.cameras, [index]: id }
			};
		}
		case "REMOVE_CAMERA": {
			const { index } = payload;
			const newCameras = { ...state.cameras };
			delete newCameras[index];
			return {
				...state,
				cameras: newCameras
			};
		}
		case "CLEAR_CAMERAS":
			return {
				...state,
				cameras: {}
			};

		case "SET_STAGED_ITEM": {
			const { item } = payload;
			return { ...state, stagedItem: item };
		}

		case "SET_WIDGET_LAUNCH_DATA":
			return {
				...state,
				...action.payload
			};

		default:
			return state;
	}
};

export default cameraWall;
