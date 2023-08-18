import React from "react";
import ColumnOrder from "./ColumnOrder";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ColumnOrder />
	);
	expect(wrapper).toMatchSnapshot();
});
