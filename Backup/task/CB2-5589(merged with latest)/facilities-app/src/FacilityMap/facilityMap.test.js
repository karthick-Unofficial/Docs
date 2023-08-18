import React from "react";
import FacilityMap from "./FacilityMap";
import { shallow } from "enzyme";
import { useSelector } from "react-redux";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

jest.mock("react-redux", () => ({
	useSelector: jest.fn()
}));

describe("FacilityMap", () => {
	it("renders", () => {
		useSelector
			.mockImplementationOnce(() => {
				return { persisted: { mapSettings: { zoom: 5 } } };
			})
			.mockImplementationOnce(() => {
				return { mapSettings: { zoom: 5 } };
			});

		const wrapper = shallow(<FacilityMap />);
		expect(wrapper).toMatchSnapshot();
	});
});
