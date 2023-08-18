import React from "react";
import DailyAgenda from "./DailyAgenda";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { assignments, berths, i18n } from "../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("DailyAgenda", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        assignments,
        date: "Fri Feb 03 2023 16:41:58 GMT+0530 (India Standard Time)",
        berths,
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<DailyAgenda />);
        expect(wrapper).toMatchSnapshot();
    });
});