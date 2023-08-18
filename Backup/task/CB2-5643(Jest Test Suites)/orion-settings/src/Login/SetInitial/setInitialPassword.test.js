import React from "react";
import SetInitialPassword from "./SetInitialPassword";
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

describe("setInitialPassword", () => {
	it("renders", () => {
		const wrapper = shallow(
			<SetInitialPassword errorMessage={""} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});