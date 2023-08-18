import * as t from "./actionTypes";
import { feedService } from "client-app-core";

/*
* Add an initial batch of cameras to state
* @param cameras: an array of camera objects
*/
const cameraBatchReceived = cameras => {
	return {
		type: t.CAMERA_BATCH_RECEIVED,
		payload: { cameras }
	};
};

/*
* Add or update a camera in state
* @param camera: a camera object
*/
const cameraReceived = camera => {
	return {
		type: t.CAMERA_RECEIVED,
		payload: { camera }
	};
};

/*
* Subscribe to camera feed
* @param userId: logged in user's ID
*/
export const subscribeCameras = (expandedRefs = false) => {
	return (dispatch, getState) => {
		feedService.subscribeFilteredFeed(
			"system",
			"cameras",
			{ expandedRefs: expandedRefs },
			(err, response) => {
				if (err) console.log(err);
				if (!response) return;
				switch (response.type) {
					case "initial-batch":
					case "change-batch":
						{
							const cameras = response.changes.map(
								response => response.new_val
							);
							dispatch(cameraBatchReceived(cameras));
						}
						break;

					case "add":
					case "change":
						dispatch(cameraReceived(response.new_val));
						break;

					default:
						break;
				}
			}
		);
	};
};
