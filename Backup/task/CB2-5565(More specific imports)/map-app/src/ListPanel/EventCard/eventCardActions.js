import { selectFloorPlan } from "../FacilityProfile/facilityProfileActions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};
