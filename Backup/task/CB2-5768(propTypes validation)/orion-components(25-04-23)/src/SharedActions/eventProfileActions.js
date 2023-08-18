import { eventService, attachmentService } from "client-app-core";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";

export { updateActivityFilters } from "./commonActions";

export const unpinEntity = (itemType, itemId) => {
	return (dispatch, getState) => {
		const state = getState();
		const eventId = primaryContextSelector(state);

		eventService.unpinEntity(eventId, itemType, itemId, (err, response) => {
			if (err) {
				console.log(err, response);
			}
		});
	};
};

export const attachFilesToEvent = (eventId, entityType, files) => {
	return () => {
		attachmentService.uploadFiles(eventId, "event", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const publishEvent = (eventId) => {
	return () => {
		eventService.makeEventPublic(eventId, (err, response) => {
			if (err) {
				console.log(err, response);
			}
		});
	};
};

export const shareEvent = (eventId, orgId) => {
	return () => {
		eventService.shareEvent(eventId, orgId, (err, response) => {
			if (err) {
				console.log(err, response);
			}
		});
	};
};

export const updateEventNotes = (event, notes, callback) => {
	if (callback) {
		return () => {
			eventService.updateEventNotes(event.id, event.notes, notes, callback);
		};
	} else {
		return () => {
			eventService.updateEventNotes(event.id, event.notes, notes, (err, result) => {
				if (err) {
					console.log(err);
				} else return result;
			});
		};
	}
};

export const deleteEventNotes = (eventId, callback) => {
	if (callback) {
		return () => {
			eventService.deleteEventNotes(eventId, callback);
		};
	} else {
		return () => {
			eventService.deleteEventNotes(eventId, (err, result) => {
				if (err) {
					console.log(err);
				} else return result;
			});
		};
	}
};
