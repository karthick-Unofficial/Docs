export const initialState = {
	eventView: "map-view",
	// MAP STATE,
	dockItems: []
};

const userAppState = (state = initialState, action) => {
	switch (action.type) {
		case "MAP_APP_STATE_RECEIVED":
			return {
				...state,
				dockItems: action.payload ? action.payload.dockItems : []
			};

		case "ADDED_TO_MY_ITEMS": {
			// Get copy
			const dockItems = state.dockItems.slice();

			// Add if not present
			action.ids.forEach((id) => {
				if (!dockItems.includes(id)) {
					dockItems.push(id);
				}
			});

			// return new state
			return {
				...state,
				dockItems: [...dockItems]
			};
		}
		case "REMOVED_FROM_MY_ITEMS": {
			let newDockItems = state.dockItems.slice();
			newDockItems = newDockItems.filter((item) => !action.ids.includes(item));
			return {
				...state,
				dockItems: newDockItems
			};
		}

		case "VIEW_LAST_PROFILE": {
			const previous = action.payload;
			const history = [...state.viewingHistory];

			let update;

			switch (previous.type) {
				case "event":
					update = {
						selectedEvent: previous.item,
						profileMode: "event"
					};
					break;
				case "entity":
					update = {
						selectedEntity: previous.item,
						profileMode: "entity"
					};
					break;
				case "camera":
					update = {
						selectedCamera: previous.item,
						profileMode: "camera",
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
				eventView: action.payload
			};

		case "SET_MAP_POSITION_SUCCESS":
			return {
				...state,
				...action.payload
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
