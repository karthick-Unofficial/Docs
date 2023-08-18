import cloneDeep from "lodash/cloneDeep";

const initialState = [];

const systemNotifications = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "SYSTEM_NOTIFICATIONS_RECEIVED": {
			const newState = cloneDeep(state);

			payload.forEach(newNotification => {
				if (!newState.some(oldNotification => oldNotification.id === newNotification.id)) {
					newState.push(newNotification);
				}
			});

			// return newState.concat(payload);
			return newState;
		}
		case "SYSTEM_NOTIFICATION_ACKNOWLEDGED": {
			const { notificationId } = payload;

			if (notificationId) {
				// -- update notification as acknowledged
				const newState = cloneDeep(state);
				const index = newState.findIndex(notification => notification.id === notificationId);
				newState[index].ack = true;

				return newState;
			}
			else {
				return state;
			}
		}
		case "SYSTEM_NOTIFICATIONS_CLEARED": {
			return [];
		}
		default:
			return state;
	}
};

export default systemNotifications;