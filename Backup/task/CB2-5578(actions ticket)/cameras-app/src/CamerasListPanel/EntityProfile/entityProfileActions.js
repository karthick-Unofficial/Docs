import * as t from "../../actionTypes.js";

// Update Viewing History
export const updateViewingHistory = ({ id, name, type, item }) => {
	return {
		type: t.UPDATE_VIEWING_HISTORY,
		payload: {
			id,
			name,
			type,
			item
		}
	};
};

// Cam In Range
export const cameraInRangeVideoReceived = (stream, cameraId) => {
	return {
		type: t.CAMERA_IN_RANGE_VIDEO_STREAM_RECEIVED,
		payload: {
			cameraId,
			stream
		}
	};
};

export const cameraInRangeStreamReceived = sub => {
	return {
		type: t.CAMERA_IN_RANGE_SUBSCRIPTION_RECEIVED,
		payload: {
			sub
		}
	};
};

export const camerasInRangeReceived = cameras => {
	return {
		type: t.CAMERAS_IN_RANGE_RECEIVED,
		payload: cameras
	};
};

export const camerasInRangeRemoved = cameraIds => {
	return {
		type: t.CAMERAS_IN_RANGE_REMOVED,
		payload: cameraIds
	};
};

export const setCamerasInRangeSubscription = sub => {
	return {
		type: t.SET_CAMERAS_IN_RANGE_SUBSCRIPTION,
		payload: sub
	};
};