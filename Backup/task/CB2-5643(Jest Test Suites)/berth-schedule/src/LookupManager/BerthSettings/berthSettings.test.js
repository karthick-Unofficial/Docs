import React from "react";
import BerthSettings from "./BerthSettings";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { session } from "../../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("BerthSettings", () => {
    beforeEach(() => {
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    })
    afterEach(() => {
        useSelectorMock.mockClear();
    })

    const useSelectorMock = reactRedux.useSelector;

    const mockStore = {
        berthGroups: [],
        session
    };

    it("renders", () => {
        const wrapper = shallow(<BerthSettings />);
        expect(wrapper).toMatchSnapshot();
    });
});