import { selectFloorPlan } from "../EventsListPanel/FacilityProfile/facilityProfileActions";

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};
