import { createSelector } from "reselect";
const dock = (state) => state.appState.replayCamerasDock;

export const cameraDockSelector = createSelector(dock, (dock) => dock);

export const dockedCamerasSelector = createSelector(dock, (dock) => dock.dockedCameras);

export const userCamerasSelector = createSelector(dock, (dock) => dock.userCameras);
