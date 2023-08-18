export const initialState = {
	userCameras: [],
	dockedCameras: [null, null, null],
	cameraPriority: { dockOpen: false, modalOpen: false },
	findNearestMode: [false, false, false],
	findNearestPosition: null,
	cameraReplaceMode: { camera: null, replaceMode: false },
	wavcam_pano: { showLabels: true }
};

const cameraDock = (state = initialState, action) => {
	switch (action.type) {
		case "DOCK_APP_STATE_RECEIVED":
			return {
				...state,
				...action.payload
			};

		case "CAMERAS_RECEIVED": {
			const newState = {
				...state,
				userCameras: action.payload
			};

			return newState;
		}

		case "CAMERA_DOCKED": {
			const dockedCameras = [...state.dockedCameras];
			dockedCameras[action.payload.cameraPosition] = action.payload.response;

			return Object.assign({}, state, {
				dockedCameras: dockedCameras
			});
		}
		case "REMOVE_DOCKED_CAMERA": {
			const dockedCameras = [...state.dockedCameras];
			dockedCameras[action.payload.cameraPosition] = null;

			return Object.assign({}, state, {
				dockedCameras: dockedCameras
			});
		}

		case "CAMERA_PRIORITY_SET": {
			const dockOpen = action.payload.dockOpen;
			const modalOpen = action.payload.modalOpen;

			// If null is passed for either dockOpen or modalOpen, default to whatever is in state already
			// This allows the you to update whether the dock or modal is open without having to know the state of the other
			const newState = {
				...state,
				cameraPriority: {
					dockOpen: dockOpen !== null ? dockOpen : state.cameraPriority.dockOpen,
					modalOpen: modalOpen !== null ? modalOpen : state.cameraPriority.modalOpen
				}
			};

			return newState;
		}

		case "TOGGLE_FIND_NEAREST": {
			// reset other "find nearest" buttons
			const resetFindNearest = [false, false, false];

			// if specific find nearest is off, turn specific find nearest on, otherwise the above will turn it off
			if (state.findNearestMode[action.payload.cameraPosition] === false) {
				resetFindNearest[action.payload.cameraPosition] = true;
			}

			const newState = {
				...state,
				findNearestMode: resetFindNearest,
				findNearestPosition: action.payload.cameraPosition
			};

			return newState;
		}

		case "CLEAR_FIND_NEAREST": {
			return {
				...state,
				findNearestMode: [false, false, false],
				findNearestPosition: null
			};
		}

		case "CLEAR_CAMERA_REPLACE_MODE": {
			return {
				...state,
				cameraReplaceMode: { camera: null, replaceMode: false }
			};
		}

		case "CAMERA_TO_DOCK_MODE": {
			// -- handle if camera already present in dock
			if (state.dockedCameras.includes(action.payload.camera.id)) {
				return { ...state };
			} else {
				return {
					...state,
					cameraReplaceMode: {
						camera: action.payload.camera,
						replaceMode: action.payload.replaceMode
					}
				};
			}
		}

		default:
			return state;
	}
};

export default cameraDock;
