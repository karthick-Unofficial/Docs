import React from "react";
import Login from "./Login";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { i18n } from "../testData";

jest.mock('react-redux', () => ({
	useSelector: jest.fn()
}));

jest.mock('orion-components', () => ({
	getTranslation: () => { }
}));

describe("Login", () => {
	beforeEach(() => {
		useSelectorMock.mockImplementation(selector => selector(mockStore));
	})
	afterEach(() => {
		useSelectorMock.mockClear();
	})

	const useSelectorMock = reactRedux.useSelector;

	const mockStore = {
		i18n
	};

	it("renders", () => {
		const wrapper = shallow(<Login />);
		expect(wrapper).toMatchSnapshot();
	});
});