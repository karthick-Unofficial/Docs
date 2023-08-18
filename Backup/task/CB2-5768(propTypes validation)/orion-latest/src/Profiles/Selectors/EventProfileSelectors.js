import { createSelector } from "reselect";
import { defaultEventProfileWidgets } from "orion-components/Profiles/Utils/EventProfileWidgets";
import unionBy from "lodash/unionBy";
import { widgetStateSelector } from "orion-components/AppState/Selectors";
import { isWidgetLaunchableAndExpandable, getAppId, entityTypeSelector } from "orion-components/Profiles/Selectors";
import { eventTypesSelector } from "orion-components/GlobalData/Selectors";

const getWidgetState = (state) => widgetStateSelector(state) || [];
const selectIntegrations = (state) => state.session?.user?.profile?.integrations || [];
const getTypes = (state) => eventTypesSelector(state);
const getExternalSystems = (state) => state?.session?.organization?.externalSystems;

export const eventProfileWidgetConfig = createSelector(
	[getWidgetState, selectIntegrations, getAppId, getTypes, getExternalSystems, (state) => state],
	(widgetState, integrations, appId, types, externalSystems, state) => (event) => {
		const { type } = event;
		const { isTemplate } = event;
		const eventType = types[type];
		let defaultTypes = ["notes", "pinned_items", "files", "cameras"];
		const viewLists = integrations?.find((feed) => feed.entityType === "list");
		const launchableAndExpandable = isWidgetLaunchableAndExpandable(getAppId(state), entityTypeSelector(state));
		const { widgetsExpandable } = launchableAndExpandable;

		if (viewLists) defaultTypes.push("event_lists");

		// Don't allow proximity widget in cameras app
		if (appId !== "cameras-app") defaultTypes.push("proximity");

		// Only allow activities widget if not a template
		if (!isTemplate) defaultTypes.push("activities");

		// Only allow map widget if the widgets are expandable
		if (widgetsExpandable) defaultTypes.push("map");

		// Add additional widgets based on event type
		if (eventType) defaultTypes = [...defaultTypes, ...eventType.widgets];

		// Add resources & equipment widgets if user has HRMS external system
		if (externalSystems.indexOf("hrms") > -1) {
			defaultTypes = [...defaultTypes, "resources", "equipments"];
		}

		const filteredDefault = defaultEventProfileWidgets.filter((widget) => defaultTypes.includes(widget.id));
		const filteredState = widgetState ? widgetState.filter((widget) => defaultTypes.includes(widget.id)) : [];

		const widgetConfig = unionBy(filteredDefault, filteredState, "id");

		return widgetConfig;
	}
);
