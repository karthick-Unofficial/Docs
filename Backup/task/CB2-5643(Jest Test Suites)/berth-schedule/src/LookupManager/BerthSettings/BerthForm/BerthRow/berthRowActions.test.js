import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./berthRowActions";

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

describe("BerthRow Sync Actions", () => {
    it("Should fire an action on berth received", () => {
        const expectedAction = {
            type: t.BERTH_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.berthReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on berth updated", () => {
        const expectedAction = {
            type: t.BERTH_UPDATED,
            payload: { id: "", data: {} }
        };
        expect(actions.berthUpdated("", {})).toEqual(expectedAction);
    });

    it("Should fire an action on berth removed", () => {
        const expectedAction = {
            type: t.BERTH_REMOVED,
            payload: { id: "" }
        };
        expect(actions.berthRemoved("")).toEqual(expectedAction);
    });
});

describe("BerthRow Async Actions", () => {
    describe("addBerth", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "post",
                "/berth-schedule-app/api/berths",
                {}
            );
        });

        const berth = { beginningFootmark: "", endFootmark: "" }

        it("Should call post a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.addBerth(berth));
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTH_RECEIVED on successful post", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTH_RECEIVED,
                payload: { data: {} }
            }];

            store.dispatch(actions.addBerth(berth));
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe("deleteBerth", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "delete",
                "/berth-schedule-app/api/berths/345",
                {}
            );
        });

        it("Should call delete a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.deleteBerth("345"));
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTH_REMOVED on successful delete", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTH_REMOVED,
                payload: { id: "345" }
            }];

            store.dispatch(actions.deleteBerth("345"));
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });

    describe("updateBerth", () => {
        afterEach(() => {
            fetchMock.reset();
            fetchMock.restore();
        });
        beforeEach(() => {
            safelyMock(
                "put",
                "/berth-schedule-app/api/berths/345",
                { id: "345", data: {} }
            );
        });

        const berth = { beginningFootmark: 0, endFootmark: 0 }

        it("Should call put a single time.", () => {
            const store = mockStore(initialState);

            store.dispatch(actions.updateBerth("345", berth));
            return flushAllPromises().then(() => {
                expect(fetchMock.calls().matched.length).toEqual(1);
            });

        });

        it("Should dispatch BERTH_UPDATED on successful put", () => {
            const store = mockStore(initialState);

            const expectedActions = [{
                type: t.BERTH_UPDATED,
                payload: { id: "345", data: berth }
            }];

            store.dispatch(actions.updateBerth("345", berth));
            return flushAllPromises().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
        });
    });
});