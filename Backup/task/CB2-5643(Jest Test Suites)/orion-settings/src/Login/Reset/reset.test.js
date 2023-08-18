import React from "react";
import Reset from "./Reset";
import { shallow } from "enzyme";

jest.mock('react-redux', () => ({
	useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
	useParams: () => ({
		token: ""
	})
}));

describe("reset", () => {
	it("renders", () => {
		const wrapper = shallow(<Reset errorMessage={""} />);
		expect(wrapper).toMatchSnapshot();
	});
});