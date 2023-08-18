import * as t from "./actionTypes";
export { setMapTools } from "orion-components/Map/Tools/Actions";
export { startFloorPlanCameraStream, startFloorPlanAccessPointsStream, startActivityStream, unsubscribeFromFeed, removeFeed, startAttachmentStream, startCamerasInRangeStream } from "orion-components/ContextualData/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { clearFloorPlan } from "../../DrawingPanel/FloorPlanForm/floorPlanFormActions";
import { clearFloorPlan } from "../../DrawingPanel/FloorPlanForm/floorPlanFormActions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
import { removeFeed } from "orion-components/ContextualData/Actions";
import { ignoreEntity } from "orion-components/GlobalData/Actions";
import { attachmentService, eventService, entityCollection, facilityService } from "client-app-core";
export {
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";

export const selectFloorPlan = floorPlan => {
	return {
		type: t.FLOOR_PLAN_SELECT,
		payload: { floorPlan }
	};
};

export const setFloorPlans = floorPlans => {
	return {
		type: t.FLOOR_PLANS_SET,
		payload: { floorPlans }
	};
};

// export const _selectWidget = widget => {
// 	return {
// 		type: t.SELECT_WIDGET,
// 		payload: widget
// 	};
// };

export const ignoreFacility = (facility, appData) => {
	return dispatch => {
		dispatch(ignoreEntity(facility.id, "facility", facility.feedId, appData));
		dispatch(clearFloorPlan());
	};

};

export const deleteFacility = (facilityId) => {
	facilityService.delete(facilityId);
};

export const addRemoveFromCollections = (entityId, added, removed, entityName, entityType, feedId, undoing) => {
	return dispatch => {
		const addedIds = added.map(collection => collection.id);
		const removedIds = removed.map(collection => collection.id);
		entityCollection.addRemoveMemberToMulti(
			entityId,
			entityName,
			entityType,
			feedId,
			addedIds,
			removedIds,
			(err, response) => {
				if (err) {
					console.log(err);
				} else {
					if (!undoing) {
						const undo = true;
						const undoFunc = () => {
							dispatch(
								// We pass null for entityName, entityType, and feedId to prevent activities 
								// from generating when we undo a collection update
								addRemoveFromCollections(entityId, removed, added, null, null, null, undo)
							);
						};
						let addedMessage = "";
						let removedMessage = "";
						if (added[0]) {
							added.forEach((collection, index) => {
								addedMessage += index !== added.length - 1 ? `${collection.name}, ` : `${collection.name}`;
							});
						}
						if (removed[0]) {
							removed.forEach((collection, index) => {
								removedMessage += index !== removed.length - 1 ? `${collection.name}, ` : `${collection.name}`;
							});
						}
						let completeMessage = addedMessage ? entityName + " added to " + addedMessage + "." : "";
						completeMessage += removedMessage ? entityName + " removed from " + removedMessage + "." : "";
						dispatch(
							createUserFeedback(
								completeMessage,
								undoFunc
							)
						);
					}

				}
			}
		);
	};
};

export const addRemoveFromEvents = (
	entityId,
	entityType,
	feedId,
	added,
	removed
) => {
	return dispatch => {
		eventService.updatePinnedEntities(
			entityId,
			entityType,
			feedId,
			added,
			removed,
			(err, response) => {
				if (err) {
					console.log(err);
				}
			}
		);
	};
};

export const createCollection = (name, members) => {
	return dispatch => {
		entityCollection.createCollection(name, members, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export function removeFloorPlanCameraSub(contextId, subscriptionId) {
	return dispatch => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}
export function removeFloorPlanAccessPointsSub(contextId, subscriptionId) {
	return dispatch => {
		dispatch(removeFeed(contextId, subscriptionId));
	};
}
export function setWidgetOrder(profile, widgets) {
	return function (dispatch) {
		const keyVal = {
			[profile]: widgets
		};
		dispatch(updatePersistedState("facilities-app", "profileWidgetOrder", keyVal));
	};
}

// export const selectWidget = widget => {
// 	return (dispatch, getState) => {
// 		dispatch(_selectWidget(widget));
// 	};
// };

export const updateActivityFilters = filters => {
	return dispatch => {
		dispatch(updatePersistedState("facilities-app", "activityFilters", filters));
	};
};

export const attachFilesToFacility = (facilityId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(facilityId, "facility", files, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
};