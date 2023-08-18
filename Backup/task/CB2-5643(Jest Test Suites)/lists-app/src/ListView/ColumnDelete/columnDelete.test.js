import React from "react";
import ColumnDelete from "./ColumnDelete";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ColumnDelete />
	);
	expect(wrapper).toMatchSnapshot();
});
