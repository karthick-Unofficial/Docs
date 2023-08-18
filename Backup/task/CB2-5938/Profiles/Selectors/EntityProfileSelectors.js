import { createSelector } from "reselect";
import { defaultEntityProfileWidgets } from "orion-components/Profiles/Utils/EntityProfileWidgets";
import unionBy from "lodash/unionBy";
import { widgetStateSelector } from "orion-components/AppState/Selectors";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const getWidgetState = (state) => widgetStateSelector(state) || [];
const selectIntegrations = (state) => state.session?.user?.profile?.integrations || [];

const getCustomWidgetConfig = (widgetName, integrations, feedId) => {
	const customWidgetsArr = [];
	integrations.filter((customWidget) => {
		if (feedId === customWidget.feedId && hasOwn(customWidget, "widgets")) {
			const { widgets } = customWidget;
			widgets.map((widget) => {
				if (widget.id === widgetName) {
					customWidgetsArr.push(widget.id);
				}
			});
		}
	});
	return customWidgetsArr;
};

export const entityWidgetConfig = createSelector(
	[getWidgetState, selectIntegrations],
	(widgetState, integrations) => (context, feedId, marineTrafficVesselData, marineTrafficVisible) => {
		const { entityType } = context.entity;
		const checkDroneWidget = getCustomWidgetConfig("drone-association", integrations, feedId);

		let widgetConfig = widgetState
			? unionBy(widgetState, defaultEntityProfileWidgets, "id")
			: defaultEntityProfileWidgets;

		// -- remove details from shapes
		widgetConfig =
			entityType === "shapes" ? widgetConfig.filter((widget) => widget.id !== "details") : widgetConfig;

		// -- remove marine traffic from irrelevant feeds
		widgetConfig =
			!marineTrafficVesselData || !marineTrafficVisible
				? widgetConfig.filter((widget) => widget.id !== "marineTrafficParticulars")
				: widgetConfig;

		// remove drone-association widget from irrelevant feeds
		widgetConfig =
			checkDroneWidget.length === 0
				? widgetConfig.filter((widget) => widget.id !== "drone-association")
				: widgetConfig;

		return widgetConfig;
	}
);
