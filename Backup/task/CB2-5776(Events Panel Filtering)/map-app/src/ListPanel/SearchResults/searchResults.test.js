import React from "react";
import SearchResults from "./SearchResults";

import { shallow } from "enzyme";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

jest.mock("react-redux", () => ({
	useSelector: jest.fn().mockImplementation((selector) => selector()),
	useDispatch: () => jest.fn()
}));

describe("SearchResults", () => {
	it("renders correctly with text", () => {
		const wrapper = shallow(<SearchResults searchTerms="" />);
		expect(wrapper).toMatchSnapshot();
	});

	it("renders correctly without text", () => {
		const wrapper = shallow(<SearchResults searchTerms="" />);
		expect(wrapper).toMatchSnapshot();
	});
});
