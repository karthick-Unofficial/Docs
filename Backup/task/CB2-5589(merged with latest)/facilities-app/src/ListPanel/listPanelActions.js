export { setMapTools } from "orion-components/Map/Tools/Actions";
import * as t from "../actionTypes";
export { setWidgetLaunchData } from "../appActions";
export { closeProfile } from "orion-components/SharedActions/commonActions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { selectFloorPlan } from "./FacilityProfile/facilityProfileActions";
export { clearFloorPlan } from "../DrawingPanel/FloorPlanForm/floorPlanFormActions";

export const setPreLoaded = () => {
	return {
		type: t.SET_PRELOADED
	};
};
