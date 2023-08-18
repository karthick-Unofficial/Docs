import { updatePersistedState } from "orion-components/AppState/Actions";

export const closeDock = ( dockState, dockDirection ) => {
	return dispatch => {
		let newDockState;
		if (dockDirection === "left") {
			newDockState = { 
				...dockState,
				leftDock: {
					...dockState.leftDock,
					currentWidget: null
				}
			};
		} else {
			newDockState = { 
				...dockState,
				rightDock: {
					...dockState.rightDock,
					currentWidget: null
				}
			};
		}
		dispatch(updatePersistedState("tabletop-app", "dockState", newDockState));
	};
};

export const openWidget = ( dockState, dockDirection, widgetName ) => {
	return dispatch => {
		let newDockState;
		if (dockDirection === "left") {
			newDockState = { 
				...dockState,
				leftDock: {
					...dockState.leftDock,
					currentWidget: widgetName
				}
			};
		} else {
			newDockState = { 
				...dockState,
				rightDock: {
					...dockState.rightDock,
					currentWidget: widgetName
				}
			};
		}
		dispatch(updatePersistedState("tabletop-app", "dockState", newDockState));
	};
};

export const moveToOtherDock = ( dockState, dockDirection, widgetName ) => {
	return dispatch => {
		let newDockState;
		if (dockDirection === "left") {
			const newLeftWidgets = dockState.leftDock.availableWidgets.filter(widget => widget !== widgetName);
			newDockState = { 
				leftDock: {
					availableWidgets: newLeftWidgets,
					currentWidget: null
				},
				rightDock: {
					availableWidgets: [ ...dockState.rightDock.availableWidgets, widgetName ],
					currentWidget: widgetName
				}
			};
		} else {
			const newRightWidgets = dockState.rightDock.availableWidgets.filter(widget => widget !== widgetName);
			newDockState = { 
				leftDock: {
					availableWidgets: [ ...dockState.leftDock.availableWidgets, widgetName ],
					currentWidget: widgetName
				},
				rightDock: {
					availableWidgets: newRightWidgets,
					currentWidget: null
				}
			};
		}
		dispatch(updatePersistedState("tabletop-app", "dockState", newDockState));
	};
};