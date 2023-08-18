import React from "react";
import AppMenuWrapper from "./AppMenuWrapper";

import { shallow } from "enzyme";
import { session } from "../testData/session";
import * as reactRedux from "react-redux";
import { i18n } from "../testData/i18n";
import { clientConfig } from "../testData/clientConfig";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("AppMenuWrapper", () => {
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
		appId: "map-app",
		session,
		clientConfig,
		i18n
	};
	it("renders", () => {
		// Basic render with a couple dock items

		const wrapper = shallow(<AppMenuWrapper />);
		expect(wrapper).toMatchSnapshot();
	});
});
