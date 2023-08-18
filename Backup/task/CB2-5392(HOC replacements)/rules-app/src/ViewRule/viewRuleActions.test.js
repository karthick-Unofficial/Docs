import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./viewRuleActions";

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

describe("View Rule Sync Actions", () => {

	it("Should create an action to update a rule.", () => {
		const expectedAction = {
			type: t.UPDATE_RULE_SUCCESS,
			id: "id",
			body: {}
		};
		expect(actions.updateRuleSuccess("id", {})).toEqual(expectedAction);
	});
});

describe("View Rule Async Actions", () => {

	describe("updateRule", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"put", 
				"/rules",
				{ body: {"deleted":0, "errors":0, "inserted":0, "replaced":1, "skipped":0, "unchanged":0}, headers: { "content-type": "application/json" }}
			);
		});

		it("Should call update a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.updateRule({}));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});

		});

		const body = {title: "title", desc: "desc", audioSettings: {}, dismissForOrg: false, statement: "statement", subject: [], trigger: "exit", targets: [], conditions: [], escalationEvent: "", assignments: {}};

		it("Should have sent with the correct data", () => {   
			const store = mockStore(initialState);

			const expectedData = body;

			store.dispatch(actions.updateRule("id", "title", "desc", {}, false, "statement", [], "exit", [], [], "", {}));
			return flushAllPromises().then(() => {
				expect(getSentData()).toEqual(expectedData);
			});
		});

		it("Should dispatch UPDATE_RULE_SUCCESS on successful update", () => {
			const store = mockStore(initialState);

			const expectedActions = [{
				type: t.UPDATE_RULE_SUCCESS,
				id: "id",
				body: JSON.stringify(body)
			},
			{
				payload: {
					contextId: "id",
					update: JSON.stringify(body)
				},
				type: "UPDATE_CONTEXT"
			}];

			store.dispatch(actions.updateRule("id", "title", "desc", {}, false, "statement", [], "exit", [], [], "", {}));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});

});