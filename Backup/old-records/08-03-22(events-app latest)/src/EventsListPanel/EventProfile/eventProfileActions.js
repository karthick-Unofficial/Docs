import { eventService, attachmentService } from "client-app-core";

export { updateViewingHistory } from "../EntityProfile/entityProfileActions";

export {
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";

export { loadProfile } from "orion-components/ContextPanel/Actions";

import * as t from "../../actionTypes";
import { updatePersistedState } from "orion-components/AppState/Actions";
export { ignoreEntity, getLookupValues } from "orion-components/GlobalData/Actions";
export { deleteEvent } from "../eventsListPanelActions";
export {
	updateList,
	updateListCheckbox,
	deleteList,
	createListsFromTemplates,
	selectWidget
} from "../../appActions";
export {
	startEventCameraStream,
	getContextListCategory
} from "orion-components/ContextualData/Actions";

export const attachmentDataReceived = attachment => {
	return {
		type: t.EVENT_ATTACHMENT_DATA_RECEIVED,
		attachment
	};
};

export const clearEventAttachments = () => {
	return {
		type: t.EVENT_ATTACHMENT_CLEAR_DATA
	};
};

export const updateActivityFilters = filters => {
	return dispatch => {
		dispatch(updatePersistedState("events-app", "activityFilters", filters));
	};
};

export function setWidgetOrder(profile, widgets) {
	return function(dispatch) {
		const keyVal = { [profile]: widgets };
		dispatch(updatePersistedState("events-app", "profileWidgetOrder", keyVal));
	};
}

export const attachFilesToEvent = (eventId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(eventId, "event", files, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const updateEventNotes = (event, notes, callback) => {
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
};

export const downloadEventNotes = handle => {
	return dispatch => {};
};

export const deleteEventNotes = (eventId, callback) => {
	if(callback) {
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