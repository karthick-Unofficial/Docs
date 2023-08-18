import { createSelector } from "reselect";
import { defaultAccessPointProfileWidgets } from "orion-components/Profiles/Utils/AccessPointProfileWidgets";
import unionBy from "lodash/unionBy";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { isWidgetLaunchableAndExpandable, getAppId, entityTypeSelector } from "orion-components/Profiles/Selectors";

const getWidgetState = (state) => widgetStateSelector(state) || [];

export const accessPointWidgetConfig = createSelector(
	[getWidgetState, (state) => state],
	(widgetState, state) => (canControlAccessPoint) => {
		const defaultTypes = ["files", "activities", "linked_items", "cameras"];
		const launchableAndExpandable = isWidgetLaunchableAndExpandable(getAppId(state), entityTypeSelector(state));
		const { widgetsExpandable } = launchableAndExpandable;

		if (canControlAccessPoint) defaultTypes.unshift("access_control");

		if (widgetsExpandable) defaultTypes.push("map");

		const filteredDefault = defaultAccessPointProfileWidgets.filter((widget) => defaultTypes.includes(widget.id));
		const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

		const widgetConfig = unionBy(filteredDefault, filteredState, "id");

		return widgetConfig;
	}
);
