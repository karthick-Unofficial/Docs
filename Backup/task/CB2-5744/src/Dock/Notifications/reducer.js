const activeItems = (state = [], action) => {
	switch (action.type) {
		case "INITIAL_NOTIFICATIONS_RECEIVED": {
			const ids = [];
			action.notifications.forEach((item) => {
				if (item) {
					ids.push(item.id);
				}
			});
			const newState = [...ids];
			return newState;
		}

		case "NOTIFICATION_BATCH_RECEIVED": {
			const ids = [];
			action.notifications.forEach((item) => {
				if (item) {
					ids.push(item.id);
				}
			});
			const newState = [...state, ...ids];
			return newState;
		}

		case "CLOSE_NOTIFICATION": {
			let newState = state.slice();
			newState = newState.filter((id) => id !== action.notificationId);
			return newState;
		}

		case "CLOSE_NOTIFICATIONS": {
			let newState = state.slice();
			newState = newState.filter(
				(id) => !action.notificationIds.includes(id)
			);
			return newState;
		}

		default:
			return state;
	}
};

const activeItemsById = (state = {}, action) => {
	switch (action.type) {
		case "INITIAL_NOTIFICATIONS_RECEIVED": {
			return action.notifications.reduce((acc, not) => {
				if (not) {
					return { ...acc, [not.id]: not };
				} else {
					return { ...acc };
				}
			}, {});
		}

		case "NOTIFICATION_BATCH_RECEIVED": {
			const not = action.notifications.reduce((acc, not) => {
				if (not) {
					return { ...acc, [not.id]: not };
				} else {
					return { ...acc };
				}
			}, {});

			return { ...state, ...not };
		}

		case "CLOSE_NOTIFICATION": {
			const newState = { ...state };
			const { [action.notificationId]: omit, ...remainder } = newState;
			return remainder;
		}

		case "CLOSE_NOTIFICATIONS": {
			let newState = { ...state };

			// omit all removed ids from itemsById
			newState = action.notificationIds.reduce((acc, notId) => {
				const { [notId]: omit, ...newAcc } = acc;
				return newAcc;
			}, newState);

			return newState;
		}

		default:
			return state;
	}
};

const archiveItems = (state = [], action) => {
	switch (action.type) {
		case "GET_ARCHIVE_SUCCESS": {
			const ids = action.notifications.map((item) => item.id);
			return ids;
		}
		case "REOPEN_NOTIFICATION": {
			const { notificationId } = action;
			const newState = state.filter((id) => id !== notificationId);
			return newState;
		}
		case "DUMP_ARCHIVE": {
			const newState = [];
			return newState;
		}

		default:
			return state;
	}
};

const archiveItemsById = (state = {}, action) => {
	switch (action.type) {
		case "GET_ARCHIVE_SUCCESS": {
			const reducedNotifications = action.notifications.reduce((a, b) => {
				return Object.assign(a, { [b.id]: b });
			}, {});

			return reducedNotifications;
		}
		case "REOPEN_NOTIFICATION": {
			const { notificationId } = action;
			const newState = { ...state };
			delete newState[notificationId];
			return newState;
		}
		case "DUMP_ARCHIVE": {
			const newState = {};
			return newState;
		}

		default:
			return state;
	}
};

export const initialState = {
	initial: false,
	activeItems: [],
	activeItemsById: {},
	archiveItems: [],
	archiveItemsById: {}
};

const notifications = (state = initialState, action) => {
	switch (action.type) {
		case "INITIAL_NOTIFICATIONS_RECEIVED":
			return {
				...state,
				initial: true,
				activeItems: activeItems(state.activeItems, action),
				activeItemsById: activeItemsById(state.activeItemsById, action)
			};
		case "NOTIFICATION_BATCH_RECEIVED":
		case "CLOSE_NOTIFICATION":
		case "CLOSE_NOTIFICATIONS":
			return {
				...state,
				initial: false,
				activeItems: activeItems(state.activeItems, action),
				activeItemsById: activeItemsById(state.activeItemsById, action)
			};
		case "DUMP_ARCHIVE":
		case "GET_ARCHIVE_SUCCESS":
		case "REOPEN_NOTIFICATION":
			return {
				...state,
				archiveItems: archiveItems(state.archiveItems, action),
				archiveItemsById: archiveItemsById(
					state.archiveItemsById,
					action
				)
			};
		default:
			return state;
	}
};

export default notifications;
