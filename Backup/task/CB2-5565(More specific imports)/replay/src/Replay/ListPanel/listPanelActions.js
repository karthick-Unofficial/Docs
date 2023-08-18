export {
	openPrimary,
	closePrimary,
	clearMapFilters,
	loadProfile,
	viewPrevious
} from "orion-components/ContextPanel/Actions";
export { setMapOffset } from "../../ReplayMapBase/replayMapActions";
import { closeSecondary } from "orion-components/ContextPanel/Actions";
import { clearSelectedEntity } from "orion-components/AppState/Actions";

export const closeProfile = () => {
	return dispatch => {
		dispatch(closeSecondary());
		dispatch(clearSelectedEntity());
	};
};
