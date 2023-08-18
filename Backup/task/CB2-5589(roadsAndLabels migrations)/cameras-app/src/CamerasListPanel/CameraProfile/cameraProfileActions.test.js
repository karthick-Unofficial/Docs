import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../../actionTypes";
import * as actions from "./cameraProfileActions";

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
const checkMockedUrl = (url, index = 0) => {
	return fetchMock.calls().matched[index][0].url.includes(url);
};

// Utility to make jest resolve all pending promises so we can continue
const flushAllPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("CameraProfile Sync Actions", () => {
	it("Should fire an action to select widget", () => {
		const expectedAction = {
			type: t.SELECT_WIDGET,
			payload: ""
		};
		expect(actions._selectWidget("")).toEqual(expectedAction);
	});
});

describe("CameraProfile Async Actions", () => {
	describe("createCollection", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("post", "/entityCollections", {});
		});

		it("Should call post a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.createCollection("", ""));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should make each request to the correct endpoint", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.createCollection("", ""));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("entityCollections", 0)).toBe(true);
			});
		});
	});

	describe("updateCamera", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("put", "/cameras/345", {});
		});

		it("Should call put a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.updateCamera("345", {}));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should make each request to the correct endpoint", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.updateCamera("345", {}));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("cameras/345", 0)).toBe(true);
			});
		});
	});
});
