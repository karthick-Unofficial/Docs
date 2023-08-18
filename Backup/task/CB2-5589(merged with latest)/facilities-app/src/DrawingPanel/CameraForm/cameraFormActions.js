export { setMapTools } from "orion-components/Map/Tools/Actions";
import { facilityService } from "client-app-core";

export const attachCameraToFloorPlan = (floorPlan, camera) => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		facilityService.addCameraToFloorplan(
			floorPlan.facilityId,
			floorPlan.id,
			camera.id,
			feature,
			// eslint-disable-next-line no-unused-vars
			(err, res) => {
				if (err) {
					console.log("ERROR: ", err);
				}
			}
		);
	};
};
