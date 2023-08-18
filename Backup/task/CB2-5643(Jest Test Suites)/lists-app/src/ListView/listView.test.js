import React from "react";
import ListView from "./ListView";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ListView />
	);
	expect(wrapper).toMatchSnapshot();
});
