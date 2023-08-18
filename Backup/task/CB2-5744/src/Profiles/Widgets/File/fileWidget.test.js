import React from "react";

import { shallow } from "enzyme";
import FileWidget from "./FileWidget";

jest.mock("mapbox-gl", () => {});

describe("FileWidget", () => {
	it("renders", () => {
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

		const permissions = {
			items: {
				canContribute: true
			}
		};

		const wrapper = shallow(
			<FileWidget
				selectedEntity={selectedEntity}
				permissions={permissions}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
