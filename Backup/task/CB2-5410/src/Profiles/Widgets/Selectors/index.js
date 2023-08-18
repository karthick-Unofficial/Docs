import { createSelector } from "reselect";
import { defaultWidgetsState } from "../Utils/defaultWidgetsState";

const getDefaultWidgetState = (widgetName) => {
	return defaultWidgetsState[widgetName] || null;
};

const widgetStateSelector = (state) => state.appState?.persisted?.widgets || null;

const getGlobalWidgetState = createSelector([widgetStateSelector], (widgetState) => (widgetName) => {
	if (widgetState !== null && Object.keys(widgetState).length !== 0) {
		return widgetState[widgetName] || getDefaultWidgetState(widgetName);
	} else {
		return getDefaultWidgetState(widgetName);
	}
});

export { getGlobalWidgetState };
