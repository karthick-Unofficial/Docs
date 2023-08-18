import React from "react";
import LayoutControls from "./LayoutControls";
import * as reactRedux from "react-redux";
import { shallow } from "enzyme";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("LayoutControls", () => {
	beforeEach(() => {
		useDispatchMock.mockImplementation(() => () => {});
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useDispatchMock.mockClear();
		useSelectorMock.mockClear();
	});

	const useSelectorMock = reactRedux.useSelector;
	const useDispatchMock = reactRedux.useDispatch;

	const mockStore = {
		appId: "map-app"
	};

	it("renders", () => {
		const wrapper = shallow(<LayoutControls open={true} close={() => {}} />);
		expect(wrapper).toMatchSnapshot();
	});
});
