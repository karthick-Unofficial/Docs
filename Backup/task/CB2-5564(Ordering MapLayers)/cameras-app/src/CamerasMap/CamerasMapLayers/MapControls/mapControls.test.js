import React from "react";
import MapControls from "./MapControls";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, session, i18n } from "orion-components/testData"

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("MapControls", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

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
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<MapControls />);
        expect(wrapper).toMatchSnapshot();
    });
});