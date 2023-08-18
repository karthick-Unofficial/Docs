import * as t from "./actionTypes";
import { eventService, eventTypeService } from "client-app-core";

// Used by getAllEvents to set event to state by hash
export const eventReceived = event => {
	return {
		type: t.EVENT_RECEIVED,
		payload: event
	};
};

// Used by getAllEvents to set event comment count to state by hash (eventId)
const receivedCommentCount = (eventId, stats) => {
	return {
		type: t.RECEIVED_EVENT_COMMENT_COUNT,
		payload: {
			eventId,
			stats
		}
	};
};

export const eventRemoved = eventId => {
	return {
		type: t.EVENT_REMOVED,
		payload: {
			eventId
		}
	};
};

const eventUpdated = (eventId, event) => {
	return {
		type: t.EVENT_UPDATED,
		payload: {
			eventId,
			event
		}
	};
};

/*
 * Get all events
 * @param format: format of object to return (ex. intermediate)
 */
export const getAllEvents = (format = "full", status = [], type = []) => {
	return (dispatch, getState) => {
		// stream events
		eventService.subscribeEvents(format, status, type, (err, res) => {
			if (err) {
				console.log("Get all events error:", err);
			} else {
				res.forEach(change => {
					if (change.type === "add" || change.type === "initial") {
						const event = change.new_val;
	
						dispatch(eventReceived(event));
						dispatch(receivedCommentCount(event.id, {commentCount: event.commentCount}));
					} else if (change.type === "change") {
						const event = change.new_val;
	
						dispatch(eventUpdated(event.id, event));
						dispatch(receivedCommentCount(event.id, {commentCount: event.commentCount}));
					} else if (change.type === "remove") {
						const event = change.old_val;
	
						dispatch(eventRemoved(event.id));
					}
				});
			}
		});
	};
};

const eventTypesReceived = types => {
	return {
		type: t.EVENT_TYPES_RECEIVED,
		payload: { types }
	};
};

export const getEventTypes = () => {
	return dispatch => {
		eventTypeService.getEventTypes((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			dispatch(eventTypesReceived(response));
		});
	};
};

export const updateEvent = (eventId, event) => {
	return dispatch => {
		eventService.updateEvent(eventId, event, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};
};

export const eventTemplateReceived = event => {
	return {
		type: t.EVENT_TEMPLATE_RECEIVED,
		payload: event
	};
};

export const eventTemplateRemoved = eventId => {
	return {
		type: t.EVENT_TEMPLATE_REMOVED,
		payload: {
			eventId
		}
	};
};

const eventTemplateUpdated = (eventId, event) => {
	return {
		type: t.EVENT_TEMPLATE_UPDATED,
		payload: {
			eventId,
			event
		}
	};
};

export const getAllTemplates = (format = "full", status = [], type = []) => {
	return (dispatch, getState) => {
		// stream event templates
		eventService.subscribeTemplates(format, status, type, (err, res) => {
			if (err) {
				console.log("Get all event templates error:", err);
			} else {
				res.forEach(change => {
					if (change.type === "add" || change.type === "initial") {
						const event = change.new_val;
	
						dispatch(eventTemplateReceived(event));
					} else if (change.type === "change") {
						const event = change.new_val;
	
						dispatch(eventTemplateUpdated(event.id, event));
					} else if (change.type === "remove") {
						const event = change.old_val;
	
						dispatch(eventTemplateRemoved(event.id));
					}
				});
			}
		});
	};
};
