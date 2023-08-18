import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./dailyAgendaActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {};

describe("DailyAgenda Sync Actions", () => {
    it("Should fire an action to load form data", () => {
        const expectedAction = {
            type: t.LOAD_FORM_DATA,
            payload: { data: {} }
        };
        expect(actions.loadFormData({})).toEqual(expectedAction);
    });

    it("Should call an action to edit assignment", () => {
        const store = mockStore(initialState);

        const expectedActions = [{
            type: "OPEN_EVENT_FORM"
        }, {
            type: t.LOAD_FORM_DATA,
            payload: { data: {} }
        }];

        store.dispatch(actions.editAssignment({}));
        expect(store.getActions()).toEqual(expectedActions);
    });
});