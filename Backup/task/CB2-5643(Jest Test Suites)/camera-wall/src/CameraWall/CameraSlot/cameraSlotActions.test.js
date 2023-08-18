import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./cameraSlotActions";

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

describe("CameraSlot Sync Actions", () => {
    it("Should fire an action to remove camera", () => {
        const expectedAction = {
            type: t.REMOVE_CAMERA,
            payload: { index: "" }
        };
        expect(actions.removeCamera("")).toEqual(expectedAction);
    });
});