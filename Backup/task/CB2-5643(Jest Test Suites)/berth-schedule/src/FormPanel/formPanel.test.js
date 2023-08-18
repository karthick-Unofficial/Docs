import React from "react";
import FormPanel from "./FormPanel";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { formPanel, i18n } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("FormPanel", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        formPanel,
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<FormPanel />);
        expect(wrapper).toMatchSnapshot();
    });
});