export { setMapTools } from "orion-components/Map/Tools/Actions";
import { facilityService } from "client-app-core";

export const attachAccessPointToFloorPlan = (floorPlan, accessPoint) => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		facilityService.addAccessPointToFloorplan(floorPlan.facilityId, floorPlan.id, accessPoint.id, feature, (err, res) => {
			if (err) {
				console.log("ERROR: ", err);
			}else if (res) {
				console.log("attachAccessPointToFloorPlan", res);
			}
		});
	};
};