import { eventService } from "client-app-core";

import * as t from "../actionTypes";

// New
import { closeSecondary, clearSelectedEntity } from "orion-components/ContextPanel/Actions";
import { updatePersistedState } from "orion-components/AppState/Actions";
import { setWidgetLaunchData } from "../appActions";

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
export { selectWidget } from "../appActions";
export { closeDialog } from "orion-components/AppState/Actions";

export const updateEventFilters = (filters) => {
	return (dispatch) => {
		dispatch(
			updatePersistedState("events-app", "eventFilters", {
				eventFilters: filters
			})
		);
	};
};

export const updateTemplateFilters = (filters) => {
	return (dispatch) => {
		dispatch(
			updatePersistedState("events-app", "eventTemplateFilters", {
				eventTemplateFilters: filters
			})
		);
	};
};

export const hideEventProfile = () => {
	return (dispatch) => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};

export const closePublishDialog = () => {
	return {
		type: t.CLOSE_PUBLISH_DIALOG
	};
};

export const publishEvent = (eventId) => {
	return () => {
		eventService.makeEventPublic(eventId, (err) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const shareEvent = (eventId, orgId) => {
	return () => {
		eventService.shareEvent(eventId, orgId, (err) => {
			if (err) {
				console.log(err);
			}
		});
	};
};

export const updateWidgetLaunchData = (data) => {
	return (dispatch) => {
		dispatch(setWidgetLaunchData({ widgetLaunchData: data }));
	};
};
