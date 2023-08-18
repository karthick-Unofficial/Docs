import { setSelectedGroup } from "../../../ListPanel/CameraGroup/cameraGroupActions";
import { cameraGroupService } from "client-app-core";
export { closeDialog } from "orion-components/AppState/Actions";

export const createGroup = (name) => {
	return (dispatch, getState) => {
		const { appState, cameraWall, camerasByContext } = getState();
		const { selectedPinnedItem } = appState.persisted;
		const { cameras, stagedItem } = cameraWall;
		let cameraData = {};
		if (stagedItem || selectedPinnedItem) {
			const id = stagedItem ? stagedItem.id : selectedPinnedItem.id;
			if (camerasByContext[id]) {
				camerasByContext[id].forEach((id, index) => {
					cameraData[index] = id;
				});
			}
		} else {
			cameraData = cameras;
		}
		const group = { name, cameras: cameraData };
		cameraGroupService.create(group, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { id, name } = response;
				if (id) {
					dispatch(setSelectedGroup({ id, name }, cameraData));
				}
			}
		});
	};
};
