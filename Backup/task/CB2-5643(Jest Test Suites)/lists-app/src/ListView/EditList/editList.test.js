import React from "react";
import EditList from "./EditList";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<EditList />
	);
	expect(wrapper).toMatchSnapshot();
});
