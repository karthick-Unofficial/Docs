import React from "react";
import ColumnAdd from "./ColumnAdd";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ColumnAdd />
	);
	expect(wrapper).toMatchSnapshot();
});
