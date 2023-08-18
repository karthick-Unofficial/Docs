import { createSelector } from "reselect";
import { defaultCamerasProfileWidgets } from "orion-components/Profiles/Utils/CameraProfileWidgets";
import unionBy from "lodash/unionBy";
import { widgetStateSelector } from "orion-components/AppState/Selectors";

const getWidgetState = (state) => widgetStateSelector(state)?.widgetOrder || [];

export const cameraProfileConfig = createSelector([getWidgetState], (widgetState) => (widgetsExpandable) => {
	const defaultTypes = ["linked_items", "activities", "live_camera", "files"];

	if (widgetsExpandable) defaultTypes.push("map");

	const filteredDefault = defaultCamerasProfileWidgets.filter((widget) => defaultTypes.includes(widget.id));
	const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

	const widgetConfig = unionBy(filteredDefault, filteredState, "id");

	return widgetConfig;
});
