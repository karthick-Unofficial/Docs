import React from "react";
import BerthSchedule from "./BerthSchedule";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, assignments, berths, map } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("BerthSchedule", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        appState,
        assignments,
        berths,
        map,
        berthGroups: []
    };

    it("renders", () => {
        const wrapper = shallow(<BerthSchedule />);
        expect(wrapper).toMatchSnapshot();
    });
});