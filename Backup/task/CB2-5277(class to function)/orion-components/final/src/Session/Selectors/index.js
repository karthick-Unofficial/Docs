import { createSelector } from "reselect";
import _ from "lodash";

const userIntegrationsSelector = state => state.session.user.profile.integrations;
const userApplicationsSelector = state => state.session.user.profile.applications;

export const userApplicationArraySelector = createSelector(
	userApplicationsSelector,
	applications => {
		const appIds = applications.map(app => app.appId);
		return appIds;
	}
);

export const userIntegrationsOfEntityTypeSelector = entityType => {
	return createSelector(
		userIntegrationsSelector,
		integrations => integrations.filter(int => int.entityType === entityType && int.config.canView)
	);
};

export const userIntegrationByFeedIdSelector = feedId => {
	return createSelector(
		userIntegrationsSelector,
		integrations => _.find(integrations, int => int.feedId === feedId)
	);
};