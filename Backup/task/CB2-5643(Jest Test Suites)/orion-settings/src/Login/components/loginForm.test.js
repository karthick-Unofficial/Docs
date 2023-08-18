import React from "react";
import LoginForm from "./LoginForm";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { i18n } from "../../testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	useOutletContext: () => ({
		errorMessage: ""
	})
}));

jest.mock('orion-components', () => ({
	getTranslation: () => { }
}));

describe("LoginForm", () => {
	beforeEach(() => {
		useDispatchMock.mockImplementation(() => () => { });
		useSelectorMock.mockImplementation(selector => selector(mockStore));
	})
	afterEach(() => {
		useDispatchMock.mockClear();
		useSelectorMock.mockClear();
	})

	const useSelectorMock = reactRedux.useSelector;
	const useDispatchMock = reactRedux.useDispatch;

	const mockStore = {
		i18n
	};

	it("renders", () => {
		const wrapper = shallow(<LoginForm />);
		expect(wrapper).toMatchSnapshot();
	});
});