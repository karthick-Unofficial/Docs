import React from "react";
import BerthToolbar from "./BerthToolbar";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { assignments, map, clientConfig, session, i18n } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("BerthToolbar", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        assignments,
        map,
        clientConfig,
        i18n,
        session,
        view: {
            page: ""
        }
    };

    it("renders", () => {
        const wrapper = shallow(<BerthToolbar />);
        expect(wrapper).toMatchSnapshot();
    });
});