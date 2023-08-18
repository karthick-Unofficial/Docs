import { createSelector } from "reselect";

export const contextPanelState = (state) =>
	state.appState.contextPanel.contextPanelData;

export const viewingHistorySelector = createSelector(
	contextPanelState,
	(state) => {
		return state.viewingHistory;
	}
);

export const primaryContextSelector = createSelector(
	contextPanelState,
	(state) => {
		return state.selectedContext.primary;
	}
);

export const secondaryContextSelector = createSelector(
	contextPanelState,
	(state) => {
		return state.selectedContext.secondary;
	}
);
