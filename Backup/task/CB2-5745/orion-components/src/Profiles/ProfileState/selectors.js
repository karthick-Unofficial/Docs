import { createSelector } from "reselect";
import cloneDeep from "lodash/cloneDeep";

export const selectedEntityState = (state) =>
	state.appState.contextPanel.profile
		? state.appState.contextPanel.profile.selectedEntity
		: null;

export const contextualDataState = (state) => state.contextualData;

export const selectedContextSelector = createSelector(
	selectedEntityState,
	contextualDataState,
	(entity, contextualData) => {
		return entity ? contextualData[entity.id] : null;
	}
);

export const selectedFacilitySelector = createSelector(
	selectedEntityState,
	contextualDataState,
	(entity, contextualData) => {
		let returnObject = {};
		if (entity) {
			const context = contextualData[entity.id];
			const { subscriptions, ...copyOfContext } = context;
			returnObject = cloneDeep(copyOfContext);
			if (subscriptions) {
				const { floorPlanCameras, ...copySubs } = subscriptions;
				returnObject.subscriptions = cloneDeep(copySubs);
			}
		}
		return entity ? returnObject : null;
	}
);
