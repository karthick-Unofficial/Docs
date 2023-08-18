import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./createRuleActions";

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

describe("Create Rule Sync Actions", () => {

	it("Should create an action to add a rule.", () => {
		const expectedAction = {
			type: t.ADD_RULE_SUCCESS,
			id: "id",
			body: {}
		};
		expect(actions.addRuleSuccess("id", {})).toEqual(expectedAction);
	});
});

describe("Create Rule Async Actions", () => {

	describe("createRule", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"post", 
				"/rules",
				{ body: {"deleted":0, "errors":0, "generated_keys":["345"], "inserted":1, "replaced":0, "skipped":0, "unchanged":0}, headers: { "content-type": "application/json" }}
			);
		});

		it("Should call add a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.addRule({}));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/rules")).toBe(true);
			});

		});

		const body = {title: "title", desc: "desc", audioSettings: {}, dismissForOrg: false, statement: "statement", subject: [], trigger: "exit", targets: [], conditions: [], escalationEvent: "", assignments: {}, owner: "123", ownerOrg: "org_name"};

		it("Should have sent with the correct data", () => {   
			const store = mockStore(initialState);

			store.dispatch(actions.addRule("title", "desc", {}, false, "statement", [], "exit", [], [], "", {}, "123", "org_name"));
			return flushAllPromises().then(() => {
				expect(getSentData()).toEqual(body);
			});
		});

		it("Should dispatch ADD_RULE_SUCCESS on successful update", () => {
			const store = mockStore(initialState);

			const expectedActions = [{
				type: t.ADD_RULE_SUCCESS,
				id: "345",
				body: JSON.stringify(body)
			}];

			store.dispatch(actions.addRule("title", "desc", {}, false, "statement", [], "exit", [], [], "", {}, "123", "org_name"));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});

});