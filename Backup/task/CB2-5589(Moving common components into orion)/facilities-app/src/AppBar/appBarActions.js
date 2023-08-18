import * as t from "./actionTypes";
export { logOut } from "orion-components/AppMenu";
import { selectFloorPlan } from "../ListPanel/FacilityProfile/facilityProfileActions";

export const openSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_OPEN
	};
};


export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};

export const closeSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_CLOSE
	};
};
