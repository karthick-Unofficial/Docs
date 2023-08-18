import React from "react";
import EventsAppBar from "./EventsAppBar";

import { shallow } from "enzyme";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

jest.mock("react-redux", () => ({
	useSelector: jest.fn().mockImplementation((selector) => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(<EventsAppBar />);
	expect(wrapper).toMatchSnapshot();
});
