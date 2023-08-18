import { eventService, attachmentService } from "client-app-core";

import * as t from "../../actionTypes.js";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import { updatePersistedState } from "orion-components/AppState/Actions";
import {
	closeSecondary,
	clearSelectedEntity
} from "orion-components/ContextPanel/Actions";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";

export {
	unsubscribeFromFeed,
	getContextListCategory
} from "orion-components/ContextualData/Actions";
export {
	startListStream,
	startEventActivityStream,
	startAttachmentStream,
	startEventPinnedItemsStream,
	startEventCameraStream
} from "orion-components/ContextualData/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export { ignoreEntity, getLookupValues } from "orion-components/GlobalData/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export {
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";

export const selectWidget = widget => {
	return {
		type: t.SELECT_WIDGET,
		payload: widget
	};
};

export const updateActivityFilters = keyVal => {
	return dispatch => {
		dispatch(updatePersistedState("map-app", "activityFilters", keyVal));
	};
};

export const setWidgetOrder = (profile, widgets) => {
	return dispatch => {
		const keyVal = { [profile]: widgets };
		dispatch(updatePersistedState("map-app", "profileWidgetOrder", keyVal));
	};
};

export const unpinEntity = (itemType, itemId) => {
	return (dispatch, getState) => {
		const state = getState();
		const eventId = primaryContextSelector(state);

		eventService.unpinEntity(eventId, itemType, itemId, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const attachFilesToEvent = (eventId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(eventId, "event", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const publishEvent = eventId => {
	return dispatch => {
		eventService.makeEventPublic(eventId, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const shareEvent = (eventId, orgId) => {
	return dispatch => {
		eventService.shareEvent(eventId, orgId, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const deleteEvent = id => {
	return dispatch => {
		eventService.deleteEvent(id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				dispatch(closeSecondary());
				dispatch(clearSelectedEntity());
			}
		});
	};
};

export const updateEventNotes = (event, notes, callback) => {
	if (callback) {
		return dispatch => {
			eventService.updateEventNotes(
				event.id,
				event.notes,
				notes,
				callback
			);
		};
	} else {
		return dispatch => {
			eventService.updateEventNotes(
				event.id,
				event.notes,
				notes,
				(err, result) => {
					if (err) {
						console.log(err);
					} else return result;
				}
			);
		};
	}
};

export const deleteEventNotes = (eventId, callback) => {
	if (callback) {
		return dispatch => {
			eventService.deleteEventNotes(
				eventId,
				callback
			);
		};
	} else {
		return dispatch => {
			eventService.deleteEventNotes(
				eventId,
				(err, result) => {
					if (err) {
						console.log(err);
					} else return result;
				}
			);
		};
	}
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};