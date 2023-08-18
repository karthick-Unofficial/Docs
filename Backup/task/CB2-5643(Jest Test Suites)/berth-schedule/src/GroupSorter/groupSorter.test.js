import React from "react";
import GroupSorter from "./GroupSorter";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, i18n } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("GroupSorter", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        appState,
        berthGroups: [],
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<GroupSorter />);
        expect(wrapper).toMatchSnapshot();
    });
});