import { createSelector } from "reselect";
import { defaultCamerasProfileWidgets } from "orion-components/Profiles/Utils/CameraProfileWidgets";
import { defaultFacilityProfileWidgets } from "orion-components/Profiles/Utils/FacilityProfileWidgets";
import { defaultEntityProfileWidgets } from "orion-components/Profiles/Utils/EntityProfileWidgets";
import { defaultAccessPointProfileWidgets } from "orion-components/Profiles/Utils/AccessPointProfileWidgets";
import { defaultEventProfileWidgets } from "orion-components/Profiles/Utils/EventProfileWidgets";
import { defaultRobotProfileWidgets } from "orion-components/Profiles/Utils/RobotProfileWidgets";
import { defaultGISProfileWidgets } from "orion-components/Profiles/Utils/GISProfileWidgets";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import $ from "jquery";

// widget state
const entityTypeSelector = (state) => state.appState?.contextPanel?.profile?.selectedEntity?.type || null;
const profileWidgetOrderSelector = (state) => state.appState?.persisted?.profileWidgetOrder || null;

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

		if (widgetOrder === null || !widgetOrder[entityType]) {
			const widget = getDefaultProfileWidgets(entityType).find((widget) => widget.id === id);
			return widget ? widget[widgetData] : null;
		}

		if (entityType in widgetOrder) {
			const widget = widgetOrder[entityType].find((widget) => widget.id === id);
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
const getAppId = (state) => state.application.appId;

const getExpandable = (appId, entityType) => {
	const mobile = $(window).width() <= 1023;
	if (mobile && appId === "events-app") {
		return false;
	}
	switch (`${appId}_${entityType}`) {
		case "cameras-app_camera":
			return true;
		case "events-app_accessPoint":
		case "events-app_event":
			return true;
		default:
			return false;
	}
};

const getLaunchable = (appId, entityType) => {
	switch (`${appId}_${entityType}`) {
		case "cameras-app_accessPoint":
		case "cameras-app_entity":
		case "cameras-app_event":
		case "cameras-app_shape":
		case "cameras-app_track":
			return true;

		case "events-app_accessPoint":
		case "events-app_camera":
		case "events-app_entity":
		case "events-app_facility":
		case "events-app_shape":
		case "events-app_track":
			return true;

		case "facilities-app_accessPoint":
		case "facilities-app_camera":
			return true;

		case "map-app_accessPoint":
		case "map-app_camera":
		case "map-app_entity":
		case "map-app_event":
		case "map-app_facility":
		case "map-app_robot":
		case "map-app_shape":
		case "map-app_track":
			return true;

		case "replay-app_accessPoint":
		case "replay-app_entity":
		case "replay-app_shape":
		case "replay-app_track":
			return true;
		default:
			return false;
	}
};

const isWidgetLaunchableAndExpandable = createSelector([getAppId, entityTypeSelector], (appId, entityType) => {
	return {
		widgetsExpandable: getExpandable(appId, entityType),
		widgetsLaunchable: getLaunchable(appId, entityType)
	};
});

// widget expandable and launchable

export { getWidgetState, checkPermissionBasedOnFeedId, canManageByApplication, isWidgetLaunchableAndExpandable };
