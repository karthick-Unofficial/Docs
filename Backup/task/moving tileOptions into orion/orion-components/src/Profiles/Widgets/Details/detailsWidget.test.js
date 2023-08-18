import React from "react";
import DetailsWidget from "./DetailsWidget";

import { shallow } from "enzyme";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

describe("DetailsWidget", () => {
	it("renders", () => {
		const selectedEntity = {
			appId: "vessels-app",
			entityData: {
				geometry: {
					coordinates: [-91.19507833333333, 29.682976666666665],
					type: "Point"
				},
				properties: {
					course: 209.3,
					disposition: "unknown",
					name: "MISS LAURIE",
					sourceId: "367002040",
					speed: 7.2
				}
			},
			entityType: "track",
			feedId: "aishub",
			id: "aishub.367002040",
			isActive: true,
			ownerOrg: "ares_security_corporation",
			sourceId: "367002040"
		};

		const wrapper = shallow(
			<DetailsWidget
				selectedEntity={selectedEntity}
				details={selectedEntity.entityData.properties}
				displayProps={[]}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
