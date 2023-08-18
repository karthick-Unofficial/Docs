import React from "react";
import AssignmentForm from "./AssignmentForm";
import { shallow } from "enzyme";
import * as reactRedux from 'react-redux';
import { appState, assignments, berths, clientConfig, formPanel, i18n, session } from "../../testData";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("AssignmentForm", () => {
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
        clientConfig,
        formPanel,
        i18n,
        session
    };

    it("renders", () => {
        const wrapper = shallow(<AssignmentForm handleClose={() => jest.fn()} />);
        expect(wrapper).toMatchSnapshot();
    });
});