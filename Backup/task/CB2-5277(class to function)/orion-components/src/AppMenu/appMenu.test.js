import React from "react";
import AppMenu from "./AppMenu";

import { shallow } from "enzyme";

const DATE_TO_USE = new Date("2019");
const _Date = Date;
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;

const user = {
	admin: true,
	applications: [
		{
			appId: "rules-app",
			config: { canView: true, role: "viewer" },
			icon: "",
			name: "Rules"
		},
		{
			appId: "collections-app",
			config: { canView: true, role: "viewer" },
			icon: "",
			name: "Collections"
		},
		{
			appId: "notifications-app",
			config: { canView: true, role: "viewer" },
			icon: "",
			name: "Notifications"
		},
		{
			appId: "map-app",
			config: { canView: true, role: "viewer" },
			icon: "",
			name: "Map"
		}
	],
	attachments: [
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-04T14:39:43.787Z",
			filename: "downloadduck.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.d8531070-a911-11e7-af4b-c7247049173d",
			id: "e50000fc-b52d-474e-baf3-121a2d4ad06b",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-04T14:57:15.711Z",
			deleted: true,
			filename: "downloadduck.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.4f881d50-a914-11e7-af4b-c7247049173d",
			id: "44ae4943-2cec-4469-b19f-ec2ee4efccd2",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-04T14:41:55.538Z",
			filename: "download.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.2b0fca10-a912-11e7-af4b-c7247049173d",
			id: "81afbe45-7cf9-487e-861a-143ea7e45a7c",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-09-28T18:16:03.436Z",
			filename: "downloadduck.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.168a9b30-a479-11e7-8b21-4dde5462af72",
			id: "eeb782e9-1bff-4dd1-8a87-c11e62876ce5",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-04T14:41:23.509Z",
			filename: "download.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.17fc84e0-a912-11e7-af4b-c7247049173d",
			id: "3b35b04b-2637-4f06-824a-074908713db1",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-04T14:50:29.250Z",
			filename: "downloadduck.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.5d45ae90-a913-11e7-af4b-c7247049173d",
			id: "a1598217-af8c-474d-9042-8395ef1eab61",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-04T14:46:26.005Z",
			deleted: true,
			filename: "download.jpg",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.cc4726d0-a912-11e7-af4b-c7247049173d",
			id: "3d0f0c4e-157f-434e-9522-c14d188013bb",
			mimeType: "image/jpeg",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		},
		{
			app: "settings_app",
			createdBy: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			createdDate: "2017-10-19T18:07:55.679Z",
			filename: "Screenshot from 2017-10-18 09-24-35.png",
			handle:
				"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.6e7c2bd0-b4f8-11e7-88d7-cdd286aa9413",
			id: "598b50b1-cbd9-4d03-b0d0-4ba5dc8459af",
			mimeType: "image/png",
			targetId: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
			targetType: "user"
		}
	],
	contact: {
		address: null,
		cellPhone: null,
		city: "Columbia",
		officePhone: "8036400682",
		state: "SC",
		zip: "29801"
	},
	createdDate: "2017-09-27T18:18:46.324Z",
	disabled: false,
	email: "jcarroll@aressecuritycorp.com",
	id: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
	integrations: [
		{
			appId: "map-app",
			config: { canView: true, role: "viewer" },
			entityType: "shapes",
			feedId: "shapes",
			name: "Shapes",
			source: "app"
		},
		{
			appId: "archive-app",
			config: { canView: true, role: "viewer" },
			entityType: "track",
			feedId: "track-generator",
			name: "Test Track Feed",
			ownerOrg: "ares_security_corporation",
			source: "int",
			ttl: 60
		}
	],
	lastModifiedDate: "2017-10-19T18:07:55.579Z",
	name: "Test User",
	orgId: "ares_security_corporation",
	orgRole: {
		organization: {
			canShare: true,
			canContribute: true,
			canEdit: true,
			canView: true
		},
		lastModifiedDate: "Tue Aug 29 2017 14:26:31 GMT+00:00",
		roleId: "org_admin",
		ecosystem: {
			canShare: true,
			canContribute: true,
			canView: true
		},
		eventsContribute: true,
		title: "System Admin"
	},
	profileImage:
		"user.ddd72afd-b7c6-4f60-a58d-da24d2ed1f19.6e7c2bd0-b4f8-11e7-88d7-cdd286aa9413",
	role: "system-user",
	roleId: "a26d7255-118f-4392-8b0a-dee9fad66843",
	setPasswordToken: null,
	username: "testuser@aressecuritycorp.com"
};

describe("AppMenu", () => {
	it("renders", () => {
		// Basic render with a couple dock items

		const wrapper = shallow(
			<AppMenu
				user={user}
				emailConfig={{ body: "", address: "", subject: "" }}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
