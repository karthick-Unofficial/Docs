import { cameraService } from "client-app-core";
import {
	dataBatchReceived,
	dataReceived,
	removeData,
	setDataSubscription,
	unsubscribeGlobalFeed
} from "../Actions";

import size from "lodash/size";
import each from "lodash/each";

/*
 * Subscribe to camera FOVs
 * @param cameraIds: array of camera ids to grab FOVs for
 */
export const subscribeFOVs = (cameraIds) => {
	return (dispatch, getState) => {
		const fovs = getState().globalData.fovs;
		if (fovs && fovs.subscription) {
			dispatch(unsubscribeGlobalFeed("fovs", fovs.subscription));
		}

		cameraService
			.streamFOVs(cameraIds, (err, response) => {
				if (err) console.log(err);
				if (!response) return;
				switch (response.type) {
					case "initial-batch":
						{
							const data = response.changes;
							dispatch(
								dataBatchReceived(
									data,
									"fovs",
									"all",
									"parentEntity"
								)
							);
						}
						break;

					case "add":
					case "change":
						dispatch(
							dataReceived(
								response.new_val,
								"fovs",
								"all",
								"parentEntity"
							)
						);
						break;

					case "remove":
						dispatch(
							removeData(
								response.old_val.parentEntity,
								"fovs",
								"all"
							)
						);
						break;
					default:
						break;
				}
			})
			.then((subscription) => {
				dispatch(
					setDataSubscription(subscription.channel, "fovs", "all")
				);
			});
	};
};

/*
 * Unsubscribe (remove data) from camera FOVs
 * @param cameraIds: array of camera ids to clear data for
 * @param subscription: subscription channel for FOV stream
 */
export const unsubscribeFOVs = (cameraIds, subscription) => {
	return (dispatch, getState) => {
		const fovCount = size(getState().globalData.fovs.data);
		if (cameraIds) {
			// Passing false for deleting arg to prevent context state clearing and profile closing
			each(cameraIds, (id) =>
				dispatch(removeData(id, "fovs", "all", false))
			);
			// If there are no more FOVs in the data, unsubscribe
			if (cameraIds.length >= fovCount) {
				dispatch(unsubscribeGlobalFeed("fovs", subscription));
			}
		}
	};
};
