export const initialState = {
	tab: "Notifications",
	isOpen: false,
	hasError: false,
	rejectedNots: [],
	newAlerts: [],
	WavCam: false,
	expandedAlert: null,
	showWavCamLabels: true
};

const Dock = (state = initialState, action) => {
	const { payload } = action;
	switch (action.type) {
		case "SET_ALERTS_TAB":
			return Object.assign({}, state, {
				tab: action.tab,
				newAlerts: []
			});

		case "TOGGLE_CLOSE":
			return Object.assign({}, state, {
				newAlerts: []
			});

		case "TOGGLE_OPEN":
			return Object.assign({}, state, {
				isOpen: !state.isOpen
			});
		case "TOGGLE_WAV_CAM":
			return {
				...state,
				WavCam: !state.WavCam
			};

		case "TOGGLE_WAV_CAM_LABELS":
			return {
				...state,
				showWavCamLabels: !state.showWavCamLabels
			};
		// specific open functionality for the 'add camera to dock' button
		case "CAMERA_TO_DOCK_MODE":
			return Object.assign({}, state, {
				tab: "Cameras",
				isOpen: true
			});
		case "CLOSE_NOTIFICATION_FAILED":
			return Object.assign({}, state, {
				hasError: true,
				rejectedNots: [action.notificationId, ...state.rejectedNots]
			});
		case "CLOSE_NOTIFICATIONS_FAILED":
			return Object.assign({}, state, {
				hasError: true,
				rejectedNots: [...action.notificationIds, ...state.rejectedNots]
			});
		case "REOPEN_NOTIFICATION_FAILED":
			return Object.assign({}, state, {
				hasError: true,
				rejectedNots: [action.notificationId, ...state.rejectedNots]
			});
		case "REOPEN_NOTIFICATIONS_FAILED":
			return Object.assign({}, state, {
				hasError: true,
				rejectedNots: [...action.notificationIds, ...state.rejectedNots]
			});
		case "GET_ARCHIVE_FAILED":
			return Object.assign({}, state, {
				hasError: true,
				rejectedNots: []
			});
		case "GET_ARCHIVE_SUCCESS":
			return Object.assign({}, state, {
				hasError: false,
				rejectedNots: []
			});
		case "CLOSE_NOTIFICATION_COMPLETE":
			return Object.assign({}, state, {
				hasError: false,
				rejectedNots: []
			});
		case "CLOSE_NOTIFICATIONS_COMPLETE":
			return Object.assign({}, state, {
				hasError: false,
				rejectedNots: []
			});
		case "SHOW_ALERT":
			return Object.assign({}, state, {
				newAlerts: [...state.newAlerts, action.notification]
			});
		case "HIDE_ALERT": {
			const newState = state.newAlerts.filter(
				(notification) => notification.id !== action.notificationId
			);
			return Object.assign({}, state, {
				newAlerts: newState
			});
		}
		case "OPEN_ALERT_PROFILE": {
			const { id } = payload;
			return {
				...state,
				expandedAlert: id
			};
		}
		case "CLOSE_ALERT_PROFILE":
			return {
				...state,
				expandedAlert: null
			};

		default:
			return state;
	}
};

export default Dock;
