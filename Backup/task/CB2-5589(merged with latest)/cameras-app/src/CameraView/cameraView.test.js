import React from "react";
import CameraView from "./CameraView";
import { shallow } from "enzyme";
import * as reactRedux from "react-redux";
import { appState, session, i18n, userAppState } from "orion-components/testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("CameraView", () => {
	beforeEach(() => {
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useSelectorMock.mockClear();
	});

	const useSelectorMock = reactRedux.useSelector;

	const mockStore = {
		appState,
		contextualData: {},
		session,
		mapState: {
			mapTools: {
				type: ""
			},
			distanceTool: {
				activePath: {}
			}
		},
		i18n,
		userAppState
	};

	it("renders", () => {
		const wrapper = shallow(<CameraView />);
		expect(wrapper).toMatchSnapshot();
	});
});
