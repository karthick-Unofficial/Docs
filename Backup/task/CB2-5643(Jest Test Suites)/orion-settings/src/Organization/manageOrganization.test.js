import React from "react";
import ManageOrganization from "./ManageOrganization";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, i18n, session, globalData } from "../testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn(),
}));

jest.mock('orion-components', () => ({
	getTranslation: () => { },
	getDir: () => { }
}));

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
	useParams: jest.fn()
}));

describe("ManageOrganization", () => {
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
		appState,
		session,
		i18n,
		globalData
	};

	it("renders", () => {
		const wrapper = shallow(<ManageOrganization />);
		expect(wrapper).toMatchSnapshot();
	});
});