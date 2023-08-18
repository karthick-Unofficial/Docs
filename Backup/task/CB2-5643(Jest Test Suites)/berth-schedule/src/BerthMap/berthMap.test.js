import React from "react";
import BerthMap from "./BerthMap";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { map, clientConfig } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("BerthMap", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        clientConfig,
        map,
        baseMaps: []
    };

    it("renders", () => {
        const wrapper = shallow(<BerthMap />);
        expect(wrapper).toMatchSnapshot();
    });
});