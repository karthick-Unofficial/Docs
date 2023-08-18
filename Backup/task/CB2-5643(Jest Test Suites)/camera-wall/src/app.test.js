import React from "react";
import App from "./App";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, session } from "./testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	useLocation: () => ({
		pathname: ""
	})
}));

describe("App", () => {
	beforeEach(() => {
		useSelectorMock.mockImplementation(selector => selector(mockStore));
	})
	afterEach(() => {
		useSelectorMock.mockClear();
	})

	const useSelectorMock = reactRedux.useSelector;

	const mockStore = {
		appState,
		session
	};

	it("renders", () => {
		const wrapper = shallow(<App />);
		expect(wrapper).toMatchSnapshot();
	});
});