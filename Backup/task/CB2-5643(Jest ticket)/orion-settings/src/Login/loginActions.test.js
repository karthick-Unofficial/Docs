import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./loginActions";

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
const flushAllPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe("Login Sync Actions", () => {
	it("Should create an action to set the app version", () => {
		const expectedAction = {
			type: t.FETCH_VERSION_SUCCESS,
			version: "0.0.1"
		};

		expect(actions.fetchVersionSuccess("0.0.1")).toEqual(expectedAction);
	});
});

describe("Login Async Actions", () => {

	describe("requestReset", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"/auth",
				{ body: {"code":200, "message":"ok"} }
			);
		});

		it("Should make a single get request.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.requestReset("user@org.com"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point at the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.requestReset("user@org.com"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/user@org.com/forgot")).toBe(true);
			});
		});
	});

	describe("fetchAppVersion", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"end:_appVersion",
				"0.0.1"
			);
		});

		it("Should make a single get request.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchAppVersion("ecosystem"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point at the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchAppVersion("ecosystem"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/ecosystem/api/_appVersion")).toBe(true);
			});
		});
	});

});






