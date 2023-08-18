import { createSelector } from "reselect";
import { defaultCamerasProfileWidgets } from "orion-components/Profiles/Utils/CameraProfileWidgets";
import unionBy from "lodash/unionBy";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { isWidgetLaunchableAndExpandable, getAppId, entityTypeSelector } from "orion-components/Profiles/Selectors";

const getWidgetState = (state) => widgetStateSelector(state) || [];

export const cameraProfileConfig = createSelector([getWidgetState, (state) => state], (widgetState, state) => {
	const defaultTypes = ["linked_items", "activities", "live_camera", "files"];
	const launchableAndExpandable = isWidgetLaunchableAndExpandable(getAppId(state), entityTypeSelector(state));
	const { widgetsExpandable } = launchableAndExpandable;

	if (widgetsExpandable) defaultTypes.push("map");

	const filteredDefault = defaultCamerasProfileWidgets.filter((widget) => defaultTypes.includes(widget.id));
	const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

	const widgetConfig = unionBy(filteredDefault, filteredState, "id");
	
	return widgetConfig;
});
