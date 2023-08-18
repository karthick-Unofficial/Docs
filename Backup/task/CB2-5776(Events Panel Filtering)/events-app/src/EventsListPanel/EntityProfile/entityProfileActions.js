import { entityCollection } from "client-app-core";
import * as t from "../../actionTypes.js";
import { createUserFeedback } from "orion-components/Dock/actions";
import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";
import { deleteCollection } from "orion-components/SharedActions/commonActions.js";

// Update Viewing History
export const updateViewingHistory = (history) => {
	return {
		type: t.UPDATE_VIEWING_HISTORY,
		history,
		payload: {
			// FOR NEW REDUCER
			id: history.id,
			name: history.name,
			type: history.type
		}
	};
};

export const createCollection = (name, members) => {
	return (dispatch) => {
		entityCollection.createCollection(name, members, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const id = response.generated_keys[0];

				const undo = true;

				const undoFunc = () => {
					dispatch(deleteCollection(id, name, undo));
				};
				dispatch(createUserFeedback(name + " has been created.", undoFunc));
			}
		});
	};
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};
