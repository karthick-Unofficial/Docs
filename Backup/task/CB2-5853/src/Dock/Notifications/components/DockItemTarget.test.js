import React from "react";
import DockItemTarget from "./DockItemTarget";

import { shallow } from "enzyme";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

// import { initialState } from './reducers/user.js';

describe("DockItemTarget", () => {
	it("renders", () => {
		// Basic render with a couple dock items

		const wrapper = shallow(<DockItemTarget />);
		expect(wrapper).toMatchSnapshot();
	});
});
