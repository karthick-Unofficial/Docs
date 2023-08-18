import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./mainActions";

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

// This implementation can also be modified when workaround is fixed
const checkMockedUrl = (url) => {
	return fetchMock.calls().matched[0][0].url.includes(url);
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
const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

describe("Main Sync Actions", () => {

	it("Should create an action to delete a rule.", () => {
		const expectedAction = {
			type: t.DELETE_RULE_SUCCESS,
			id: "id"
		};
		expect(actions.deleteRuleSuccess("id")).toEqual(expectedAction);
	});
});

describe("Main Async Actions", () => {

	describe("deleteRule", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"delete",
				"/rules",
				{ body: {"deleted":0, "errors":0, "inserted":0, "replaced":1, "skipped":0, "unchanged":0}, headers: { "content-type": "application/json" }}
			);
		});

		it("Should call delete a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.deleteRule("id"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});

		});

		it("Should have sent with the correct data", () => {   
			const store = mockStore(initialState);

			const expectedData = "/rules/id";

			store.dispatch(actions.deleteRule("id"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl(expectedData)).toBe(true);
			});
		});

		it("Should dispatch DELETE_RULE_SUCCESS on successful delete", () => {
			const store = mockStore(initialState);

			const expectedActions = [{
				type: t.DELETE_RULE_SUCCESS,
				id: "id"
			},
			{
				payload: {
					contextId: "id"
				},
				type: "REMOVE_CONTEXT"
			}];

			store.dispatch(actions.deleteRule("id"));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});

});






