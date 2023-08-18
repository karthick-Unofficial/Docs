import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./berthFormActions";

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

describe("BerthForm Sync Actions", () => {
    it("Should fire an action on berth group received", () => {
        const expectedAction = {
            type: t.BERTH_GROUP_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.berthGroupReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on berth group updated", () => {
        const expectedAction = {
            type: t.BERTH_GROUP_UPDATED,
            payload: { id: "", data: {} }
        };
        expect(actions.berthGroupUpdated("", {})).toEqual(expectedAction);
    });

    it("Should fire an action on berth group removed", () => {
        const expectedAction = {
            type: t.BERTH_GROUP_REMOVED,
            payload: { id: "" }
        };
        expect(actions.berthGroupRemoved("")).toEqual(expectedAction);
    });
});

describe("BerthForm Async Actions", () => {
    describe("addBerthGroup", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "post",
                "/berth-schedule-app/api/berthGroups",
                {}
            );
        });

        it("Should call post a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.addBerthGroup(""));
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTH_GROUP_RECEIVED on successful post", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTH_GROUP_RECEIVED,
                payload: { data: {} }
            }];

            store.dispatch(actions.addBerthGroup(""));
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe("updateBerthGroup", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "put",
                "/berth-schedule-app/api/berthGroups/345",
                {}
            );
        });

        it("Should call put a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.updateBerthGroup("345", {}));
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTH_GROUP_UPDATED on successful put", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTH_GROUP_UPDATED,
                payload: { id: "345", data: {} }
            }];

            store.dispatch(actions.updateBerthGroup("345", {}));
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});