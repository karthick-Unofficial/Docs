import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./berthToolbarActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {};


describe("BerthToolBar Sync Actions", () => {
    it("Should fire an action to open event form", () => {
        const expectedAction = {
            type: t.OPEN_EVENT_FORM
        };
        expect(actions.openEventForm()).toEqual(expectedAction);
    });

    it("Should fire an action to open berth map", () => {
        const expectedAction = {
            type: t.OPEN_BERTH_MAP
        };
        expect(actions.openBerthMap()).toEqual(expectedAction);
    });

    it("Should fire an action to close berth map", () => {
        const expectedAction = {
            type: t.CLOSE_BERTH_MAP
        };
        expect(actions.closeBerthMap()).toEqual(expectedAction);
    });

    it("Should fire an action on track received", () => {
        const expectedAction = {
            type: t.TRACK_RECEIVED,
            payload: { data: {} }
        };
        expect(actions.trackReceived({})).toEqual(expectedAction);
    });

    it("Should call an action to add subscription", () => {
        const expectedAction = {
            type: t.ADD_SUBSCRIPTION,
            payload: { sub: {} }
        };
        expect(actions.addSubscription({})).toEqual(expectedAction);
    });

    it("Should call an action to remove subscription", () => {
        const expectedAction = {
            type: t.REMOVE_SUBSCRIPTIONS
        };
        expect(actions.removeSubscriptions()).toEqual(expectedAction);
    });

    it("Should call an action to update view", () => {
        const expectedAction = {
            type: t.UPDATE_VIEW,
            payload: { page: {} }
        };
        expect(actions.updateView({})).toEqual(expectedAction);
    });

    it("Should call an action to stop berth view", () => {
        const store = mockStore(initialState);

        const subscriptions = [{ unsubscribe: () => jest.fn() }];
        const expectedActions = [{
            type: t.REMOVE_SUBSCRIPTIONS
        }, {
            type: t.CLOSE_BERTH_MAP
        }];

        store.dispatch(actions.stopMapStreams(subscriptions));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it("Should call an action to update berth view", () => {
        const store = mockStore(initialState);

        const currentView = "schedule";
        const expectedActions = [{
            type: t.UPDATE_VIEW,
            payload: { page: "agenda" }
        }];

        store.dispatch(actions.updateBerthView(currentView));
        expect(store.getActions()).toEqual(expectedActions);
    });
});