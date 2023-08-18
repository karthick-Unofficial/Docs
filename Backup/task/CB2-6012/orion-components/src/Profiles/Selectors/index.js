import { createSelector } from "reselect";
import { defaultCamerasProfileWidgets } from "orion-components/Profiles/Utils/CameraProfileWidgets";
import { defaultFacilityProfileWidgets } from "orion-components/Profiles/Utils/FacilityProfileWidgets";
import { defaultEntityProfileWidgets } from "orion-components/Profiles/Utils/EntityProfileWidgets";
import { defaultAccessPointProfileWidgets } from "orion-components/Profiles/Utils/AccessPointProfileWidgets";
import { defaultEventProfileWidgets } from "orion-components/Profiles/Utils/EventProfileWidgets";
import { defaultRobotProfileWidgets } from "orion-components/Profiles/Utils/RobotProfileWidgets";
import { defaultGISProfileWidgets } from "orion-components/Profiles/Utils/GISProfileWidgets";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";

// widget state
const entityTypeSelector = (state) => state.appState?.contextPanel?.profile?.selectedEntity?.type || null;
const profileWidgetOrderSelector = (state) => state.appState?.persisted?.profiles || null;

const getDefaultProfileWidgets = (entityType) => {
	switch (entityType) {
		case "camera":
			return defaultCamerasProfileWidgets;
		case "accessPoint":
			return defaultAccessPointProfileWidgets;
		case "facility":
			return defaultFacilityProfileWidgets;
		case "entity":
			return defaultEntityProfileWidgets;
		case "event":
			return defaultEventProfileWidgets;
		case "robot":
			return defaultRobotProfileWidgets;
		case "gis":
			return defaultGISProfileWidgets;
		default:
			return [];
	}
};

const getWidgetState = createSelector(
	[entityTypeSelector, profileWidgetOrderSelector, selectedContextSelector],
	(entityTypeState, widgetOrder, context) => (id, widgetData) => {
		let entityType = entityTypeState;
		const isRobotTrack = context?.entity?.entityData?.properties?.type === "Robot Track";

		if (entityTypeState === "track" || entityTypeState === "shapes") {
			entityType = isRobotTrack ? "robot" : "entity";
		}

		if (widgetOrder === null || !widgetOrder[entityType]?.widgetOrder) {
			const widget = getDefaultProfileWidgets(entityType).find((widget) => widget.id === id);
			return widget ? widget[widgetData] : null;
		}

		if (entityType in widgetOrder) {
			const widget = widgetOrder[entityType]?.widgetOrder.find((widget) => widget.id === id);
			return widget ? widget[widgetData] : null;
		} else {
			if (widgetData === "enabled") {
				return false;
			}

			return null;
		}
	}
);
// widget state

//permissions

const selectIntegrations = (state) => state.session?.user?.profile?.integrations || [];

const checkPermissionBasedOnFeedId = createSelector(
	[selectIntegrations],
	(integrations) =>
		(feedId, type, permission = "") => {
			const integration = integrations?.find((int) => int.intId === feedId);
			if (type === "permissions") {
				return integration?.permissions?.includes(permission);
			} else {
				return integration?.config?.canView;
			}
		}
);

const applicationState = (state) => state.session?.user?.profile?.applications || [];

const canManageByApplication = createSelector([applicationState], (applications) => (appId, permission, type) => {
	const application = applications?.find((app) => app.appId === appId);
	if (type === "config") {
		return application?.config[permission];
	} else {
		return application?.permissions?.includes(permission);
	}
});
//permissions

// widget expandable and launchable
const getAppId = (state) => state?.application?.appId;

export const contextualDataState = (state) => state.contextualData;

const getSelectedContextData = createSelector([contextualDataState], (context) => (contextId, extract = null) => {
	if (context && context[contextId]) {
		const contextData = context[contextId];
		if (extract === null) {
			return contextData;
		} else {
			return contextData[extract];
		}
	} else {
		return {};
	}
});

export {
	getWidgetState,
	checkPermissionBasedOnFeedId,
	canManageByApplication,
	getAppId,
	entityTypeSelector,
	getSelectedContextData
};