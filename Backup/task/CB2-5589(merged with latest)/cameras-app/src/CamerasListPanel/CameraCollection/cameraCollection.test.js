import React from "react";
import CameraCollection from "./CameraCollection";
import { shallow } from "enzyme";
import * as reactRedux from "react-redux";
import { appState, session, globalData, i18n } from "orion-components/testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("CameraCollection", () => {
	beforeEach(() => {
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useSelectorMock.mockClear();
	});

	const useSelectorMock = reactRedux.useSelector;

	const mockStore = {
		appState,
		globalData,
		i18n,
		session
	};

	it("renders", () => {
		const wrapper = shallow(
			<CameraCollection searchValue="" collection={{ name: "", id: "", members: [] }} id="all_cameras" />
		);
		expect(wrapper).toMatchSnapshot();
	});
});
