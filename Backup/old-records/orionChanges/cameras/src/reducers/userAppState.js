export const initialState = {
	viewingHistory: [],
	cameraView: "Map Location and FOV"
};

const userAppState = (state = initialState, action) => {
	switch (action.type) {
		case "UPDATE_VIEWING_HISTORY": {
			return {
				...state,
				viewingHistory: [...state.viewingHistory, action.payload]
			};
		}

		case "VIEW_LAST_PROFILE": {
			const previous = action.payload;
			const history = [...state.viewingHistory];

			let update;

			switch (previous.type) {
				case "camera":
					update = {
						selectedCamera: previous.item,
						profileMode: "camera",
						selectedFOV: null
					};
					break;
				case "entity":
					update = {
						selectedEntity: previous.item,
						profileMode: "entity",
						selectedFOV: null
					};
					break;
				default:
					break;
			}

			history.pop();

			return {
				...state,
				...update,
				viewingHistory: history
			};
		}

		case "SELECT_WIDGET":
			return {
				...state,
				cameraView: action.payload
			};

		case "SET_WIDGET_LAUNCH_DATA":
			return {
				...state,
				...action.payload
			};

		default:
			return state;
	}
};

export default userAppState;
