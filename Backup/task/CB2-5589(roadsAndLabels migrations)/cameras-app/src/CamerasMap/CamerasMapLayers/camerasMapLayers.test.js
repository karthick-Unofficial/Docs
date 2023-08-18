import React from "react";
import CamerasMapLayers from "./CamerasMapLayers";
import { shallow } from "enzyme";
import * as reactRedux from "react-redux";
import {
	appState,
	clientConfig,
	globalGeo,
	globalData
} from "orion-components/testData";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("CamerasMapLayers", () => {
	beforeEach(() => {
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useSelectorMock.mockClear();
	});

	const useSelectorMock = reactRedux.useSelector;

	const mockStore = {
		appState,
		baseMaps: {},
		clientConfig,
		contextualData: {},
		globalGeo,
		globalData,
		mapState: {
			baseMap: {
				mapRef: ""
			}
		}
	};

	it("renders", () => {
		const wrapper = shallow(<CamerasMapLayers map={{}} feedId="" />);
		expect(wrapper).toMatchSnapshot();
	});
});
