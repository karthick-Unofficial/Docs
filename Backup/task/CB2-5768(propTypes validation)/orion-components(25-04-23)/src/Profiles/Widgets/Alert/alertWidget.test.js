import React from "react";
import AlertWidget from "./AlertWidget";
import { shallow } from "enzyme";
import { i18n } from "orion-components/testData/i18n";
import * as reactRedux from "react-redux";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("AlertWidget", () => {
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
		i18n
	};

	it("renders", () => {
		const notifications = {
			activeItems: [],
			activeItemsById: {},
			archiveItems: [],
			archiveItemsById: {}
		};

		const wrapper = shallow(<AlertWidget notifications={notifications} />);
		expect(wrapper).toMatchSnapshot();
	});
});
