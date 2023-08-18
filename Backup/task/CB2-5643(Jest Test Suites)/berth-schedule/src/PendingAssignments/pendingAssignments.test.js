import React from "react";
import PendingAssignments from "./PendingAssignments";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { assignments, berths, formPanel, session, i18n } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

describe("PendingAssignments", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        assignments,
        berths,
        date: "Fri Feb 03 2023 16:41:58 GMT+0530 (India Standard Time)",
        formPanel,
        session,
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<PendingAssignments />);
        expect(wrapper).toMatchSnapshot();
    });
});