import React from "react";
import ListMenu from "./ListMenu";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ListMenu />
	);
	expect(wrapper).toMatchSnapshot();
});
