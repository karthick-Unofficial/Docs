import * as t from "./actionTypes";
import { feedService } from "client-app-core";

const feedPermissionReceived = (
	feedId,
	name,
	canView,
	source,
	entityType,
	ownerOrg,
	mapIconTemplate,
	profileIconTemplate,
	renderSilhouette,
	marineTrafficVisible = false
) => {
	return {
		type: t.FEED_PERMISSION_RECEIVED,
		payload: {
			feedId,
			name,
			canView,
			source,
			entityType,
			ownerOrg,
			mapIconTemplate,
			profileIconTemplate,
			renderSilhouette,
			marineTrafficVisible
		}
	};
};

export const subscribeFeedPermissions = (userId) => {
	return (dispatch) => {
		feedService.streamUserIntegration(userId, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
			switch (response.type) {
				case "initial":
				case "change":
					{
						const config = response.new_val.config;
						dispatch(
							feedPermissionReceived(
								response.feedId,
								response.name,
								config.canView,
								response.source,
								response.entityType,
								response.ownerOrg,
								response.mapIconTemplate,
								response.profileIconTemplate,
								response.renderSilhouette
							)
						);
					}
					break;

				default:
					break;
			}
		});
	};
};

export const setFeedPermissions = (feedPermissions) => {
	return (dispatch) => {
		for (const permission of feedPermissions) {
			dispatch(
				feedPermissionReceived(
					permission.feedId,
					permission.name,
					permission.canView || true,
					permission.source,
					permission.entityType,
					permission.ownerOrg,
					permission.mapIconTemplate,
					permission.profileIconTemplate,
					permission.renderSilhouette
				)
			);
		}
	};
};

export const subscribeAppFeedPermissions = (userId, appId) => {
	return (dispatch) => {
		feedService.streamUserAppIntegration(userId, appId, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
			switch (response.type) {
				case "initial":
				case "change":
					{
						const config = response.new_val.config;
						dispatch(
							feedPermissionReceived(
								response.feedId,
								response.name,
								config.canView,
								response.source,
								response.entityType,
								response.ownerOrg,
								response.mapIconTemplate,
								response.profileIconTemplate,
								response.renderSilhouette,
								response.marineTrafficVisible
							)
						);
					}
					break;

				default:
					break;
			}
		});
	};
};
