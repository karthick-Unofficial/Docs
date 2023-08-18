import React from "react";
import AlertWidget from "./AlertWidget";

import { shallow } from "enzyme";

describe("AlertWidget", () => {
	it("renders", () => {
		const activeAlerts = [
			{
				activityId: "e9d5ed91-902e-45d9-9ddb-8877f2f51928",
				actor: {
					id: "shapes-app",
					name: "Shapes App",
					type: "application"
				},
				app: "shape-analyzer",
				closed: false,
				createdDate: "2017-11-13T20:22:29.128Z",
				id: "04bccb99-8169-403d-b7bd-1b221d388091",
				isPriority: true,
				lastModifiedDate: "2017-12-06T15:52:33.570Z",
				message: "KENNETH S SETTOON entered Do Not Enter",
				object: {
					feedId: "aishub",
					id: "aishub.367186840",
					name: "KENNETH S SETTOON",
					type: "track"
				},
				published: "2017-11-13T20:22:28.344Z",
				summary: "KENNETH S SETTOON entered Do Not Enter",
				target: {
					feedId: "shapes",
					id: "0272d4e6-10c2-456a-8a87-93d6db3edb9d",
					name: "Do Not Enter",
					type: "shapes"
				},
				type: "enter",
				userId: "123",
				viewed: false
			}
		];

		const notifications = {
			activeItems: [],
			activeItemsById: {},
			archiveItems: [],
			archiveItemsById: {}
		};

		const selectedEntity = {
			appId: "map-app",
			createdDate: 1506539788.248,
			entityData: {
				geometry: {
					coordinates: [-112.92383522014282, 40.23064685419149],
					type: "Point"
				},
				properties: {
					description: "",
					id: "e72cbf33-ea13-4685-b741-6b11894ed286",
					name: "Sharing"
				},
				type: "Point"
			},
			entityType: "shapes",
			feedId: "shapes",
			id: "e72cbf33-ea13-4685-b741-6b11894ed286",
			isDeleted: false,
			isOwner: false,
			isShareable: true,
			lastModifiedDate: 1506540564.809,
			owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
			ownerOrg: "ares_security_corporation",
			sharedWith: { ares_security_corporation: "VIEW/EDIT" }
		};

		const wrapper = shallow(
			<AlertWidget
				activeAlerts={activeAlerts}
				selectedEntity={selectedEntity}
				notifications={notifications}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
