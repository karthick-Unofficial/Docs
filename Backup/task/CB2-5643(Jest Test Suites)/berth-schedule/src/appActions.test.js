import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./appActions";

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

describe("App Sync Actions", () => {
    it("Should fire an action on berths received", () => {
        const expectedAction = {
            type: t.BERTHS_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.berthsReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on berth groups received", () => {
        const expectedAction = {
            type: t.BERTH_GROUPS_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.berthGroupsReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on berth assignments received", () => {
        const expectedAction = {
            type: t.BERTH_ASSIGNMENTS_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.berthAssignmentsReceived({})).toEqual(expectedAction);
    });

    it("Should call an action to open manager", () => {
        const expectedAction = {
            type: t.OPEN_MANAGER
        };
        expect(actions.openManager({})).toEqual(expectedAction);
    });

    it("Should fire an action on berth assignment received", () => {
        const expectedAction = {
            type: t.BERTH_ASSIGNMENT_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.berthAssignmentReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on berth assignment removed", () => {
        const expectedAction = {
            type: t.BERTH_ASSIGNMENT_REMOVED,
            payload: { id: "" }
        };
        expect(actions.berthAssignmentRemoved("")).toEqual(expectedAction);
    });

    it("Should fire an action on berth assignment updated", () => {
        const expectedAction = {
            type: t.BERTH_ASSIGNMENT_UPDATED,
            payload: { id: "", data: {} }
        };
        expect(actions.berthAssignmentUpdated("", {})).toEqual(expectedAction);
    });
});

describe("App Async Actions", () => {
    describe("getAllBerths", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "get",
                "/berth-schedule-app/api/berths",
                {}
            );
        });

        it("Should call get a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.getAllBerths());
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTHS_RECEIVED on successful get", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTHS_RECEIVED,
                payload: { data: {} }
            }];

            store.dispatch(actions.getAllBerths());
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe("getAllBerthGroups", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "get",
                "/berth-schedule-app/api/berthGroups",
                {}
            );
        });

        it("Should call get a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.getAllBerthGroups());
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTH_GROUPS_RECEIVED on successful get", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTH_GROUPS_RECEIVED,
                payload: { data: {} }
            }];

            store.dispatch(actions.getAllBerthGroups());
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});