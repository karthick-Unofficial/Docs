import { eventService } from "client-app-core";

import * as t from "../../actionTypes.js";
import {
	closeSecondary,
	clearSelectedEntity
} from "orion-components/ContextPanel/Actions";

export const selectWidget = (widget) => {
	return {
		type: t.SELECT_WIDGET,
		payload: widget
	};
};

export const deleteEvent = (id) => {
	return (dispatch) => {
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
