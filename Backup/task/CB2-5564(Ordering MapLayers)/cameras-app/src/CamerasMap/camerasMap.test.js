import React from "react";
import CamerasMap from "./CamerasMap";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, clientConfig } from "orion-components/testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("CamerasMap", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        appState,
        baseMaps: {},
        clientConfig,
        mapState: {
            baseMap: {
                mapRef: ""
            }
        }
    };

    it("renders", () => {
        const wrapper = shallow(<CamerasMap />);
        expect(wrapper).toMatchSnapshot();
    });
});