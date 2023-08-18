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
    it("Should fire an action on camera group received", () => {
        const expectedAction = {
            type: t.CAMERA_GROUP_RECEIVED,
            payload: { group: {} }
        };
        expect(actions.cameraGroupReceived({})).toEqual(expectedAction);
    });

    it("Should fire an action on camera group removed", () => {
        const expectedAction = {
            type: t.CAMERA_GROUP_REMOVED,
            payload: { groupId: "" }
        };
        expect(actions.cameraGroupRemoved("")).toEqual(expectedAction);
    });

    it("Should fire an action to set widget launch data", () => {
        const expectedAction = {
            type: t.SET_WIDGET_LAUNCH_DATA,
            payload: { widgetLaunchData: {} }
        };
        expect(actions._updateWidgetLaunchData({})).toEqual(expectedAction);
    });
});

// describe("App Async Actions", () => {
//     describe("getAllBerths", () => {
//         afterEach(() => {
//             fetchMock.reset();
//             fetchMock.restore();
//         });
//         beforeEach(() => {
//             safelyMock(
//                 "get",
//                 "/berth-schedule-app/api/berths",
//                 {}
//             );
//         });

//         it("Should call get a single time.", () => {
//             const store = mockStore(initialState);

//             store.dispatch(actions.getAllBerths());
//             return flushAllPromises().then(() => {
//                 expect(fetchMock.calls().matched.length).toEqual(1);
//             });

//         });

//         it("Should dispatch BERTHS_RECEIVED on successful get", () => {
//             const store = mockStore(initialState);

//             const expectedActions = [{
//                 type: t.BERTHS_RECEIVED,
//                 payload: { data: {} }
//             }];

//             store.dispatch(actions.getAllBerths());
//             return flushAllPromises().then(() => {
//                 expect(store.getActions()).toEqual(expectedActions);
//             });
//         });
//     });

//     describe("getAllBerthGroups", () => {
//         afterEach(() => {
//             fetchMock.reset();
//             fetchMock.restore();
//         });
//         beforeEach(() => {
//             safelyMock(
//                 "get",
//                 "/berth-schedule-app/api/berthGroups",
//                 {}
//             );
//         });

//         it("Should call get a single time.", () => {
//             const store = mockStore(initialState);

//             store.dispatch(actions.getAllBerthGroups());
//             return flushAllPromises().then(() => {
//                 expect(fetchMock.calls().matched.length).toEqual(1);
//             });

//         });

//         it("Should dispatch BERTH_GROUPS_RECEIVED on successful get", () => {
//             const store = mockStore(initialState);

//             const expectedActions = [{
//                 type: t.BERTH_GROUPS_RECEIVED,
//                 payload: { data: {} }
//             }];

//             store.dispatch(actions.getAllBerthGroups());
//             return flushAllPromises().then(() => {
//                 expect(store.getActions()).toEqual(expectedActions);
//             });
//         });
//     });
// });