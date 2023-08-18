import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../../actionTypes";
import * as actions from "./resetActions";

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

describe("Reset Async Actions.", () => {

	describe("resetPassword", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"put",
				"/auth",
				{ body: {"deleted":0, "errors":0, "inserted":0, "replaced":1, "skipped":0, "unchanged":0} }
			);
		});

		it("Should make a single put request.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.resetPassword("newPass", "123"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should send the correct data.", () => {
			const store = mockStore(initialState);

			const expectedData = {password: "newPass"};

			store.dispatch(actions.resetPassword("newPass", "123"));
			return flushAllPromises().then(() => {
				expect(getSentData()).toEqual(expectedData);
			});
		});

		it("Should point to the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.resetPassword("newPass", "123"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/reset/123")).toBe(true);
			});
		});
	});

});





