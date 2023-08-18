import React from "react";
import App from "./App";
import { shallow } from "enzyme";
import * as reactRedux from "react-redux";
import { appState, session } from "orion-components/testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn(),
	connect: () => jest.fn()
}));

jest.mock("react-router-dom", () => ({
	useLocation: () => ({
		pathname: ""
	})
}));

jest.mock("react-dom", () => ({
	render: () => jest.fn()
}));

jest.mock("react-router-dom", () => ({
	useNavigate: () => jest.fn(),
	useLocation: () => jest.fn()
}));

describe("App", () => {
	beforeEach(() => {
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useSelectorMock.mockClear();
	});

	const useSelectorMock = reactRedux.useSelector;

	const mockStore = {
		appState,
		session,
		servicesReady: true
	};

	it("renders", () => {
		const wrapper = shallow(<App />);
		expect(wrapper).toMatchSnapshot();
	});
});
