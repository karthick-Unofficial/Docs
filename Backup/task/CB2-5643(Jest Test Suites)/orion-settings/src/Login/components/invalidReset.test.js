import React from "react";
import InvalidReset from "./InvalidReset";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { i18n } from "../../testData";

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn()
}));

jest.mock('orion-components', () => ({
	getTranslation: () => { }
}));

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn(),
}));

describe("InvalidReset", () => {
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
		const wrapper = shallow(<InvalidReset />);
		expect(wrapper).toMatchSnapshot();
	});
});