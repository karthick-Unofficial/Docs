export { setMapTools } from "orion-components/Map/Tools/Actions";
import * as t from "../actionTypes";
export { setWidgetLaunchData } from "../appActions";
import { closeSecondary } from "orion-components/ContextPanel/Actions";
import { clearSelectedEntity } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { selectFloorPlan } from "./FacilityProfile/facilityProfileActions";
export { clearFloorPlan } from "./FacilityProfile/facilityProfileActions";

export const setPreLoaded = () => {
	return {
		type: t.SET_PRELOADED
	};
};

export const closeProfile = () => {
	return dispatch => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};
