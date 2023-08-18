import React from "react";
import ListPanel from "./ListPanel";
import { render, screen } from "@testing-library/react";
import * as reactRedux from "react-redux";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

jest.mock("react-redux", () => ({
	useDispatch: jest.fn(),
	useSelector: jest.fn()
}));

jest.mock("orion-components", () => ({
	getTranslation: () => jest.fn(),
	userFeedsSelector: () => jest.fn(),
	selectedContextSelector: () => jest.fn()
}));

// cSpell:ignore untar
jest.mock("js-untar", () => ({
	untar: jest.fn()
}));

describe("ListPanel", () => {
	const useSelectorMock = reactRedux.useSelector;
	const useDispatchMock = reactRedux.useDispatch;

	beforeEach(() => {
		useDispatchMock.mockImplementation(() => () => {});
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useDispatchMock.mockClear();
		useSelectorMock.mockClear();
	});

	const mockStore = {
		appState: {
			contextPanel: {
				contextPanelData: {
					secondaryOpen: {}
				}
			},
			dock: {
				dockData: {
					WavCam: []
				}
			}
		},
		i18n: {
			locale: "en"
		},
		mapState: {
			mapTools: {
				mode: {}
			},
			baseMap: {
				visible: true
			}
		},
		session: {
			user: {
				profile: {}
			},
			userFeeds: []
		},
		userAppState: {
			widgetLaunchData: []
		}
	};

	it("renders", () => {
		render(<ListPanel />);
		expect(screen).toMatchSnapshot();
	});
});
