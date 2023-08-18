import { facilityService } from "client-app-core";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";

export const setFloorOrder = floorPlans => {
	return (dispatch, getState) => {
		const { entity } = selectedContextSelector(getState());
		facilityService.reorderFloorplans(entity.id, floorPlans, err => {
			if (err) {
				console.log("ERROR:", err);
			}
		});
	};
};
