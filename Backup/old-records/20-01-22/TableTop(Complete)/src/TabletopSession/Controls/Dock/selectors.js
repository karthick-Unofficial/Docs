import _ from "lodash";
import { createSelector } from "reselect";
import widgetsConfig from "../../Widgets/widgetsConfig";

const appStateSelector = state => state.appState;

let newWidgetsCheckDone = false;
export const dockStateSelector = createSelector(
	appStateSelector,
	appState => {
		if (appState && appState.persisted && appState.persisted.dockState) {
			const dockState = appState.persisted.dockState;

			if (!newWidgetsCheckDone) {
				// We check for any new widgets not added to the dock state, we add them to left dock
				const newWidgets = [];
				_.keys(widgetsConfig).forEach((widget) => {
					if (!dockState.leftDock.availableWidgets.includes(widget) 
						&& !dockState.rightDock.availableWidgets.includes(widget)) {
						newWidgets.push(widget);
					}
				});

				if (newWidgets.length > 0) {
					dockState.leftDock.availableWidgets = [...dockState.leftDock.availableWidgets, ...newWidgets];
				}

				newWidgetsCheckDone = true;
			}

			return dockState;
		} else {
			newWidgetsCheckDone = true; // We dont need this check for the remainder of this session
			const availableWidgets = Object.keys(widgetsConfig);
			return {
				leftDock: {
					availableWidgets: availableWidgets,
					currentWidget: null
				},
				rightDock: {
					availableWidgets: [],
					currentWidget: null
				}
			};
		}
	}
);