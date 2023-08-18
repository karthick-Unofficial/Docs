import React from "react";
import ListCard from "./ListCard";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

it("renders", () => {
	const wrapper = shallow(
		<ListCard />
	);
	expect(wrapper).toMatchSnapshot();
});
