import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./assignmentFormActions";

import fetchMock from "fetch-mock";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {};

const safelyMock = (method, matcher, response) => {
    // future implementation
    // fetchMock[`${method}Once`](patchedMatcher, response).catch(200)

    // current implementation to workaround
    fetchMock.mock("*", response);
};

const getSentData = () => {
    const call = fetchMock.calls().matched[0][0];
    if (call.body) {
        return JSON.parse(call.body);
    } else {
        return JSON.parse(call._bodyInit);
    }

};

// Utility to make jest resolve all pending promises so we can continue
const flushAllPromises = () => new Promise(resolve => setTimeout(resolve, 0));

global.URL.createObjectURL = jest.fn();

describe("AssignmentForm Sync Actions", () => {
    it("Should call an action to toggle generating pdf", () => {
        const expectedAction = {
            type: t.TOGGLE_GENERATING_PDF
        };
        expect(actions.toggleGeneratingPdf()).toEqual(expectedAction);
    });

    it("Should call an action to export error", () => {
        const err = { message: "" };
        const expectedAction = {
            type: t.EXPORT_ERROR,
            error: new Error(err)
        };
        expect(actions.exportError(err)).toEqual(expectedAction);
    });
});

describe("AssignmentForm Async Actions", () => {
    describe("generatePDFExport", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "get",
                "/berth-schedule-app/api/berthAssignments/export/foo",
                { data: {}, ok: true }
            );
        });

        it("Should call get a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.generatePDFExport("", "", "", ""));
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch TOGGLE_GENERATING_PDF and EXPORT_ERROR on successful get", () => {
            const store = mockStore(initialState);

            const exportTime = new Date();

            const expectedActions = [{
                type: t.TOGGLE_GENERATING_PDF
            }, {
                type: t.TOGGLE_GENERATING_PDF
            }];

            store.dispatch(actions.generatePDFExport("", "", "", exportTime));
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});