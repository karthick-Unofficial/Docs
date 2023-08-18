import _ from "lodash";

const initialCamerasState = {};

const cameras = (state = initialCamerasState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "CAMERA_BATCH_RECEIVED": {
			const { cameras } = payload;

			const initialBatch = _.keyBy(cameras, "id");

			return {
				...state,
				...initialBatch
			};
		}

		case "CAMERA_RECEIVED": {
			const { camera } = payload;

			return {
				...state,
				[camera.id]: camera
			};
		}

		default:
			return state;
	}
};

export default cameras;
