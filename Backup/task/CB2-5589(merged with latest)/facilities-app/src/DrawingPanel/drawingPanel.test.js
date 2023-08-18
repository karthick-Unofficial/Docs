import React from "react";
import DrawingPanel from "./DrawingPanel";
import { shallow } from "enzyme";
import { useSelector } from "react-redux";

jest.mock("react-redux", () => ({
	useSelector: jest.fn()
}));

describe("DrawingPanel", () => {
	it("renders", () => {
		useSelector.mockImplementation(() => {
			return { mapTools: { mode: {}, type: {} } };
		});
		const wrapper = shallow(<DrawingPanel />);
		expect(wrapper).toMatchSnapshot();
	});
});
