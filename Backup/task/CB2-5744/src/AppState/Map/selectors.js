import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from "reselect";

import isEqual from "lodash/isEqual";

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const mapState = (state) => state.appState.mapRef;
export const mapObject = (state) => state.appState.mapRef.mapObject;
export const inEditGeo = (state) => state.appState.mapRef.inEditGeo;

export const replayMapState = (state) => state.appState.replayMapRef;
export const replayMapObject = (state) => state.appState.replayMapRef.mapObject;
const baseMapRefState = (state) =>
	state.replayMapState
		? state.replayMapState.replayBaseMap.mapRef
		: state.mapState
		? state.mapState.baseMap.mapRef
		: null;

export const activeEntitiesSelector = createSelector(mapState, (state) => {
	return state.entities;
});

export const activeReplayEntitiesSelector = createSelector(
	replayMapState,
	(state) => {
		return state.entities;
	}
);

export const mapSelector = () => {
	return createDeepEqualSelector(baseMapRefState, (result) => {
		return result;
	});
};

export const mapStateSelector = () => {
	return createDeepEqualSelector(mapState, (result) => {
		return result;
	});
};
