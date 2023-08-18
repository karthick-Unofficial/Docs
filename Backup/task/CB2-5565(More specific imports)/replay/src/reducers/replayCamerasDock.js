const initialState = {
	dockState: null,
	dockedCameras: [null, null, null],
	cameraPriority: { dockOpen: false, modalOpen: false },
	findNearestMode: [false, false, false],
	findNearestPosition: null,
	cameraReplaceMode: { camera: null, replaceMode: false },
	currentMedia: []
};

const replayCamerasDock = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "SET_DOCK_STATE": {
			return {
				...state,
				dockState: payload.dockState
			};
		}

		case "CAMERA_DOCKED": {
			const dockedCameras = [...state.dockedCameras];
			dockedCameras[payload.cameraPosition] = payload.response;

			return {
				...state,
				dockedCameras
			};
		}

		case "REMOVE_DOCKED_CAMERA": {
			const dockedCameras = [...state.dockedCameras];
			dockedCameras[payload.cameraPosition] = null;

			return {
				...state,
				dockedCameras
			};
		}

		case "CAMERA_PRIORITY_SET": {
			const dockOpen = payload.dockOpen;
			const modalOpen = payload.modalOpen;

			// If null is passed for either dockOpen or modalOpen, default to whatever is in state already
			// This allows the you to update whether the dock or modal is open without having to know the state of the other
			return {
				...state,
				cameraPriority: {
					dockOpen: dockOpen !== null ? dockOpen : state.cameraPriority.dockOpen,
					modalOpen: modalOpen !== null ? modalOpen : state.cameraPriority.modalOpen
				}
			};
		}

		case "TOGGLE_FIND_NEAREST": {
			// reset other "find nearest" buttons
			const resetFindNearest = [false, false, false];

			// if specific find nearest is off, turn specific find nearest on, otherwise the above will turn it off
			if (state.findNearestMode[payload.cameraPosition] === false) {
				resetFindNearest[payload.cameraPosition] = true;
			}

			return {
				...state,
				findNearestMode: resetFindNearest,
				findNearestPosition: payload.cameraPosition
			};
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

		case "ADD_MEDIA": {
			const newMedia = [...state.currentMedia];
			if (!newMedia.includes(payload.newMedia)) {
				newMedia.push(payload.newMedia);
			}
			return {
				...state,
				currentMedia: newMedia
			};
		}

		case "SET_MEDIA": {
			return {
				...state,
				currentMedia: payload.newMedia
			};
		}

		case "REMOVE_MEDIA": {
			const newCurrentMedia = [...state.currentMedia];
			const oldMediaIndex = newCurrentMedia.indexOf(payload.oldMedia);
			newCurrentMedia.splice(oldMediaIndex, 1);
			return {
				...state,
				currentMedia: newCurrentMedia
			};
		}

		default:
			return state;
	}
};

export default replayCamerasDock;
