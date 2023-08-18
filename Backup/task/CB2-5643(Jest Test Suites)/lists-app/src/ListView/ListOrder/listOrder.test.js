import React from "react";
import ListOrder from "./ListOrder";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ListOrder />
	);
	expect(wrapper).toMatchSnapshot();
});
