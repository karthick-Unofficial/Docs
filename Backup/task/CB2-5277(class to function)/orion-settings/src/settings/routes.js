const publicPath = "/settings-app/";

export const routes = {
	SETTINGS: publicPath,
	MY_ACCOUNT: `${publicPath}my-account-settings`,
	MANAGE_ORGANIZATION: `${publicPath}manage-organization`,
	MANAGE_ECOSYSTEM: `${publicPath}manage-ecosystem`,
	EDIT_MY_PROFILE: `${publicPath}my-account-settings/edit-profile`,
	MY_ORGANIZATION: `${publicPath}my-organization`,
	EDIT_MY_ORGANIZATION: `${publicPath}my-organization/edit`,
	ACTIVE_DIRECTORY: `${publicPath}my-organization/active-directory`,
	MANAGE_USER_ROLES: `${publicPath}my-organization/manage-user-roles`,
	MANAGE_USERS: `${publicPath}my-organization/manage-users`,
	SHARING_CONNECTIONS: `${publicPath}my-organization/sharing-connections`,
	MANAGE_FEED_SHARING_POLICIES: `${publicPath}my-organization/manage-feed-sharing-policies`,
	USER_BY_ID: `${publicPath}user/:id`,
	EDIT_USER_BY_ID: `${publicPath}user/:id/edit`,
	// ORG_BY_ID: `${publicPath}org/:id`,
	// EDIT_ORG_BY_ID: `${publicPath}org/:id/edit`,
	// MY_ORG_NEW_USER: `${publicPath}my-organization/new-user`,
	// ORG_BY_ID_NEW_USER: `${publicPath}org/:id/new-user`,
	// CHANGE_PASSWORD: `${publicPath}change-password`,
	// NEW_ORGANIZATION: `${publicPath}new-organization`,
	// NOT_FOUND: `${publicPath}not-found`,
	NOT_AUTHORIZED: `${publicPath}not-authorized`
	// ECO_PROFILE: `${publicPath}ecosystem_profile`
};