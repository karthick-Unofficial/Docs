import {
	createSelector
} from "reselect";
const dock = state => state.appState.dock;

export const cameraDockSelector =  createSelector(
	dock,
	dock => dock.cameraDock
);

export const dockDataSelector = createSelector(
	dock,
	dock => dock.dockData
);

export const dockOpenSelector = createSelector(
	dock,
	dock => dock.dockData.isOpen
);

export const dockedCamerasSelector = createSelector(
	dock,
	dock => dock.cameraDock.dockedCameras
);

export const userCamerasSelector = createSelector(
	dock,
	dock => dock.cameraDock.userCameras
);
