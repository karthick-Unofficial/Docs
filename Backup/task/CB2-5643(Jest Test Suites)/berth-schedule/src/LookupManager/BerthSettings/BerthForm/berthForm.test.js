import React from "react";
import BerthForm from "./BerthForm";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { berths, i18n } from "../../../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("BerthForm", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        berths,
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<BerthForm group={{ id: "", name: "" }} />);
        expect(wrapper).toMatchSnapshot();
    });
});