import React from "react";
import Reset from "./Reset";

import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn().mockImplementation(selector => selector()),
	useDispatch: () => jest.fn()
}));

jest.mock('react-router-dom', () => ({
	useNavigate: () => jest.fn(),
	useParams: () => jest.fn()
}));

describe("reset", () => {
	it("renders", () => {
		const wrapper = shallow(<Reset errorMessage={""} />);
		expect(wrapper).toMatchSnapshot();
	});
});