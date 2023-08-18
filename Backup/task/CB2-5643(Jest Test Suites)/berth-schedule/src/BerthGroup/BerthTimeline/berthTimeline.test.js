import React from "react";
import BerthTimeline from "./BerthTimeline";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { assignments, berths, formPanel, i18n } from "../../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("BerthTimeline", () => {
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
        formPanel,
        berths,
        i18n
    };

    it("renders", () => {
        const wrapper = shallow(<BerthTimeline groupId="" />);
        expect(wrapper).toMatchSnapshot();
    });
});