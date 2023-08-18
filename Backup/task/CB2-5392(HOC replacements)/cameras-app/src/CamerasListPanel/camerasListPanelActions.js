export { setWidgetLaunchData } from "../appActions";
export { selectWidget } from "./CameraProfile/cameraProfileActions";
export {
	updateSearchValue,
	openPrimary,
	closePrimary,
	clearMapFilters,
	viewPrevious,
	loadProfile
} from "orion-components/ContextPanel/Actions";
export { setMapOffset } from "orion-components/AppState/Actions";
import { closeSecondary } from "orion-components/ContextPanel/Actions";
import { clearSelectedEntity } from "orion-components/AppState/Actions";

export const closeProfile = () => {
	return dispatch => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};
