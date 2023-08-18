import React from "react";
import LookupManager from "./LookupManager";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { clientConfig, session, i18n } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("LookupManager", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        clientConfig,
        session,
        management: {
            "open": false,
            "type": null,
            "data": null
        },
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<LookupManager />);
        expect(wrapper).toMatchSnapshot();
    });
});