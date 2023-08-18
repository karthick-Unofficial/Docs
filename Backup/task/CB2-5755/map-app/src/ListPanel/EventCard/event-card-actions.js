import {
	eventService,
	attachmentService,
	activityService
} from "client-app-core";

import * as t from "../../actionTypes";
import { getEntityActivities } from "../EntityProfile/WidgetActions/activityWidgetActions";
export { loadCameraDetail } from "../CameraProfile/cameraProfileActions";

export const showEventProfile = (event) => {
	return {
		type: t.SHOW_EVENT_PROFILE,
		payload: event
	};
};

export const pinnedItemReceived = (eventId, item) => {
	return {
		type: t.PINNED_ITEM_RECEIVED,
		payload: {
			eventId: eventId,
			item: item
		}
	};
};

export const updateViewingHistory = (history) => {
	return {
		type: t.UPDATE_VIEWING_HISTORY,
		history
	};
};

export const loadEventData = (event) => {
	return (dispatch, getState) => {
		const state = getState();
		const history = state.appState.viewingHistory;
		eventService.subscribeEventPinnedItems(event.id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				response.changes.forEach((update) => {
					const item = update.new_val;
					if (item) {
						dispatch(pinnedItemReceived(event.id, item));
					}
				});
			}
		});

		if (history.length < 1 || history[history.length - 1].id !== event.id) {
			dispatch(
				updateViewingHistory({
					id: event.id,
					item: event,
					type: "event",
					name: event.name
				})
			);
		}

		dispatch(showEventProfile(event));
	};
};

// Show entity info - DOES NOT PERSIST
export function showEntityInfo(obj) {
	return {
		type: t.SHOW_EVENT_ENTITY_INFO,
		obj
	};
}

export function activityDataReceived(activity) {
	return {
		type: t.ACTIVITY_DATA_RECEIVED,
		activity
	};
}

export function attachmentDataReceived(attachment) {
	return {
		type: t.ATTACHMENT_DATA_RECEIVED,
		attachment
	};
}

/*  This action will be cleaned up in the orion-components component redesign.
	Components will export actions as well, reducing the need for duplicate actions.
	This was not done originally due to the need for reducers and unit testing.
*/
export function loadEntityDetail(obj) {
	return function (dispatch, getState) {
		const state = getState();
		const history = state.appState.viewingHistory;
		// Ignore if already selected
		if (state.appState.selectedEntityId === obj.id) {
			return;
		}
		dispatch(showEntityInfo(obj));
		dispatch(getEntityActivities(1, obj.entityType, obj.id));

		if (history.length < 1 || history[history.length - 1].id !== obj.id) {
			dispatch(
				updateViewingHistory({
					id: obj.id,
					item: obj,
					type: "entity",
					name: obj.entityData.properties.name
				})
			);
		}

		activityService.subscribeByTarget(
			obj.id,
			obj.entityType,
			function (err, response) {
				if (err) {
					console.log(err);
				}
				if (!response) return;
				switch (response.type) {
					case "initial":
						break;
					case "add": {
						const activity = response.new_val;
						dispatch(activityDataReceived(activity));
						break;
					}
					default:
						break;
				}
			}
		);

		attachmentService.subscribeByTarget(obj.id, function (err, response) {
			if (err) {
				console.log(err);
			}
			if (!response) return;
			switch (response.type) {
				case "initial":
				case "add": {
					const attachment = response.new_val;
					dispatch(attachmentDataReceived(attachment));
					break;
				}
				default:
					break;
			}
		});
	};
}
