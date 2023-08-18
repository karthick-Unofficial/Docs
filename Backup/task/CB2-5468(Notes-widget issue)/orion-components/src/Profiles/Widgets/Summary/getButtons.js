import { getTranslation } from "orion-components/i18n";

const getButtons = (user, context, appId, actions, readOnly) => {
	const { applications } = user;
	const { entity, trackHistory } = context;
	const { isPublic, entityType, fov, activeFOV, entityData, sharedWith } = entity;
	const hasReports = applications.find(app => app.appId === "reports-app");

	switch (entityType) {
		case "track":
			return [
				{
					name: getTranslation("global.profiles.entityProfile.main.trackHistory"),
					icon: "history",
					toggled: !!trackHistory,
					viewable: true
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.tetraRadioCall"), // "Zetron Call"
					icon: "phone",
					toggled: false,
					viewable: (user.zetronSystemAvailable || false)
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.pinTo"),
					icon: "star",
					toggled: false,
					viewable: !readOnly
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.hide"),
					icon: "delete",
					toggled: false,
					viewable: !readOnly
				}
			];
		case "shapes":
			return [
				{
					name: getTranslation("global.profiles.entityProfile.main.pinTo"),
					icon: "star",
					toggled: false,
					viewable: !readOnly
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.edit"),
					icon: "edit",
					toggled: false,
					viewable:
						!readOnly &&
						appId !== "cameras-app" &&
						user.integrations
						&& user.integrations.find(int => int.intId === entity.feedId)
						&& user.integrations.find(int => int.intId === entity.feedId).permissions
						&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.delete"),
					icon: "delete",
					toggled: false,
					viewable: !readOnly
						&& user.integrations
						&& user.integrations.find(int => int.intId === entity.feedId)
						&& user.integrations.find(int => int.intId === entity.feedId).permissions
						&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.hide"),
					icon: "delete",
					toggled: false,
					viewable: !readOnly && isPublic
				}
			];
		case "camera": {
			const buttons = [];
			if (appId && appId.toLowerCase() === "cameras-app") {
				let facilityHidden = true;
				actions.some(action => {
					if (action.nameText.toLowerCase() === "facility") {
						facilityHidden = false;
						return true;
					} else {
						return false;
					}
				});
				buttons.push({
					name: getTranslation("global.profiles.cameraProfile.facility"),
					viewable: !readOnly && entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId,
					icon: "homework",
					disabled: facilityHidden
				});
			}
			return [
				...buttons,
				{
					name: activeFOV ? getTranslation("global.profiles.cameraProfile.hideFOV") : getTranslation("global.profiles.cameraProfile.showFOV"),
					icon: "network_wifi",
					toggled: activeFOV,
					viewable: fov && activeFOV !== undefined
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.pinTo"),
					icon: "star",
					toggled: false,
					viewable: !readOnly
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.edit"),
					icon: "edit",
					toggled: false,
					viewable: !readOnly && user.integrations
						&& user.integrations.find(int => int.intId === entity.feedId)
						&& user.integrations.find(int => int.intId === entity.feedId).permissions
						&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.hide"),
					icon: "delete",
					toggled: false,
					viewable: !readOnly
				}
			];
		}

		case "accessPoint":
		case "Access Point":
		case "AccessPoint": {
			const buttons = [];
			if (appId && appId.toLowerCase() === "cameras-app") {
				let facilityHidden = true;
				actions.some(action => {
					if (action.nameText.toLowerCase() === "facility") {
						facilityHidden = false;
						return true;
					} else {
						return false;
					}
				});
				buttons.push({
					name: getTranslation("global.profiles.cameraProfile.facility"),
					viewable: !readOnly && entityData.displayType && entityData.displayType.toLowerCase() === "facility" && entityData.displayTargetId,
					icon: "homework",
					disabled: facilityHidden
				});
			}
			return [
				...buttons,
				{
					name: getTranslation("global.profiles.entityProfile.main.pinTo"),
					icon: "star",
					toggled: false,
					viewable: !readOnly
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.edit"),
					icon: "edit",
					toggled: false,
					viewable: !readOnly && user.integrations
						&& user.integrations.find(int => int.intId === entity.feedId)
						&& user.integrations.find(int => int.intId === entity.feedId).permissions
						&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.hide"),
					icon: "delete",
					toggled: false,
					viewable: !readOnly
				}
			];
		}

		case "event": {
			const canManageEvents = user.applications
				&& user.applications.find(app => app.appId === "events-app")
				&& user.applications.find(app => app.appId === "events-app").permissions
				&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage");
			const canShareEvents = user.applications
				&& user.applications.find(app => app.appId === "events-app")
				&& user.applications.find(app => app.appId === "events-app").permissions
				&& user.applications.find(app => app.appId === "events-app").permissions.includes("share");
			return [
				{
					name: getTranslation("global.profiles.eventProfile.main.report"),
					icon: "description",
					toggled: false,
					viewable: !readOnly && hasReports
				},
				{
					name: isPublic && !canShareEvents ? getTranslation("global.profiles.eventProfile.main.shared") : getTranslation("global.profiles.eventProfile.main.share"),
					icon: "share",
					toggled: sharedWith.length > 0,
					disabled: isPublic && !canShareEvents,
					viewable: !readOnly && canShareEvents
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.edit"),
					icon: "edit",
					toggled: false,
					viewable: !readOnly && canManageEvents
				},
				{
					name: getTranslation("global.profiles.entityProfile.main.delete"),
					icon: "delete",
					toggled: false,
					viewable: !readOnly && entity.ownerOrg === user.orgId && canManageEvents
				}
			];
		}
		case "facility": {
			const buttons = actions.map(action => {
				switch (action.nameText.toLowerCase()) {
					case "edit":
						return {
							name: getTranslation("global.profiles.entityProfile.main.edit"),
							icon: "edit",
							toggled: false,
							viewable: !readOnly && user.integrations
								&& user.integrations.find(int => int.intId === entity.feedId)
								&& user.integrations.find(int => int.intId === entity.feedId).permissions
								&& user.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage")
						};
					case "hide":
						return {
							name: getTranslation("global.profiles.entityProfile.main.hide"),
							icon: "delete",
							toggled: false,
							viewable: !readOnly
						};
					case "pin to": {
						return {
							name: getTranslation("global.profiles.entityProfile.main.pinTo"),
							icon: "star",
							toggled: false,
							viewable: !readOnly
						};
					}
					case "delete": {
						return {
							name: getTranslation("global.profiles.entityProfile.main.delete"),
							icon: "delete",
							toggled: false,
							viewable: !readOnly
						};
					}
					default:
						break;
				}
			});

			return buttons;
		}
		default:
			break;
	}
};

export default getButtons;
