import { eventService } from "client-app-core";

import * as t from "../actionTypes";

// New
import {
	closeSecondary,
	clearSelectedEntity
} from "orion-components/ContextPanel/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";

export { openDialog, setMapOffset } from "orion-components/AppState/Actions";
export {
	openPrimary,
	closePrimary,
	closeSecondary,
	updateEventSearch,
	updateEventTemplateSearch,
	viewPrevious,
	loadProfile
} from "orion-components/ContextPanel/Actions";
import { setWidgetLaunchData } from "../appActions";
export { selectWidget } from "../appActions";
export { closeDialog } from "orion-components/AppState/Actions";


export const updateEventFilters = filters => {
	return dispatch => {
		dispatch(
			updatePersistedState("events-app", "eventFilters", {
				eventFilters: filters
			})
		);
	};
};

export const updateTemplateFilters = filters => {
	return dispatch => {
		dispatch(
			updatePersistedState("events-app", "eventTemplateFilters", {
				eventTemplateFilters: filters
			})
		);
	};
};

export const hideEventProfile = selectedId => {
	return dispatch => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};

export const closePublishDialog = () => {
	return {
		type: t.CLOSE_PUBLISH_DIALOG
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
				console.log(response);
				dispatch(hideEventProfile());
				dispatch(closeSecondary());
			}
		});
	};
};

export const updateWidgetLaunchData = (data) => {
	return dispatch => {
		dispatch(setWidgetLaunchData({ widgetLaunchData: data }));
	};
};