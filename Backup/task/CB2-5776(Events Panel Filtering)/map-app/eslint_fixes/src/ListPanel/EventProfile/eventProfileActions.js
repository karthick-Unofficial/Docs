import { eventService } from "client-app-core";
import * as t from "../../actionTypes.js";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";
import { closeSecondary, clearSelectedEntity } from "orion-components/ContextPanel/Actions";

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
				console.log(err, response);
			} else {
				dispatch(closeSecondary());
				dispatch(clearSelectedEntity());
			}
		});
	};
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};
