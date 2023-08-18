import React from "react";
import CamerasListPanel from "./CamerasListPanel";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, session, globalData, userAppState, i18n } from "orion-components/testData"

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("CamerasListPanel", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        appState,
        session,
        globalData,
        mapState: {
            mapTools: {
                type: ""
            }
        },
        i18n,
        userAppState,
        servicesReady: true
    };

    it("renders", () => {
        const wrapper = shallow(<CamerasListPanel />);
        expect(wrapper).toMatchSnapshot();
    });
});