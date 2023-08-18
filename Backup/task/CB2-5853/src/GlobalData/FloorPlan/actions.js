import * as t from "./actionTypes";
import { facilityService } from "client-app-core";

const setFloorPlan = (floorPlan) => {
	return {
		type: t.GET_ALL_FLOORPLANS,
		payload: floorPlan
	};
};
/*
* Subscribe to FloorPlans with facility feedId

*/
export const subscribeFloorPlansWithFacilityFeedId = () => {
	return (dispatch) => {
		facilityService.getFloorPlanWithFacilityFeedId((err, response) => {
			if (err) console.log(err);
			else {
				const { floorPlans } = response;
				dispatch(setFloorPlan(floorPlans));
			}
		});
	};
};
