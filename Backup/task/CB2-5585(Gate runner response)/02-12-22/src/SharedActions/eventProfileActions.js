import { eventService, attachmentService } from "client-app-core";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";

export { setWidgetOrder, updateActivityFilters } from "./commonActions";

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