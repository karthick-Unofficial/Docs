import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./berthTimelineActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {};

describe("BerthTimeline Sync Actions", () => {
    it("Should fire an action on load form data", () => {
        const data = {};
        const expectedAction = {
            type: t.LOAD_FORM_DATA,
            payload: { data }
        };
        expect(actions.loadFormData(data)).toEqual(expectedAction);
    });

    it("Should fire an action on edit assignment", () => {
        const store = mockStore(initialState);

        const expectedActions = [{
            type: "OPEN_EVENT_FORM"
        }, {
            type: t.LOAD_FORM_DATA,
            payload: { data: {} }
        }];

        store.dispatch(actions.editAssignment({ assignment: {} }));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it("Should fire an action on open berth manager", () => {
        const store = mockStore(initialState);

        const expectedActions = [{
            type: "OPEN_MANAGER"
        }, {
            type: "SELECT_MANAGER",
            payload: { type: "berths" }
        }];

        store.dispatch(actions.openBerthManager({}));
        expect(store.getActions()).toEqual(expectedActions);
    });
});