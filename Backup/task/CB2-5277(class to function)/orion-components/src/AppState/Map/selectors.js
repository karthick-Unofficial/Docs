import { createSelector } from "reselect";

export const mapState = state => state.appState.mapRef;
export const mapObject = state => state.appState.mapRef.mapObject;
export const inEditGeo = state => state.appState.mapRef.inEditGeo;

export const replayMapState = state => state.appState.replayMapRef;
export const replayMapObject = state => state.appState.replayMapRef.mapObject;

export const activeEntitiesSelector = createSelector(mapState, state => {
	return state.entities;
});

export const activeReplayEntitiesSelector = createSelector(replayMapState, state => {
	return state.entities;
});
