import { removeFeed } from "orion-components/ContextualData/Actions";
import { attachmentService, facilityService } from "client-app-core";

export function removeFloorPlanCameraSub(contextId, subscriptionId) {
	return (dispatch) => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}

export function removeFloorPlanAccessPointsSub(contextId, subscriptionId) {
	return (dispatch) => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}

export const attachFilesToFacility = (facilityId, entityType, files) => {
	return () => {
		attachmentService.uploadFiles(facilityId, "facility", files, (err, result) => {
			if (err) {
				console.log(err, result);
			}
		});
	};
};

export const deleteFacility = (facilityId) => {
	facilityService.delete(facilityId);
};
