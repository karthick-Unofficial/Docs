import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../../actionTypes.js";
import * as actions from "./eventProfileActions";

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

describe("EventProfile Sync Actions", () => {
	it("Should fire an action to select widget", () => {
		const expectedAction = {
			type: t.SELECT_WIDGET,
			payload: ""
		};
		expect(actions.selectWidget("")).toEqual(expectedAction);
	});
});

describe("EventProfile Async Actions", () => {
	describe("deleteEvent", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("delete", "/events/345", {});
		});

		it("Should call delete a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.deleteEvent("345"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should make each request to the correct endpoint", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.deleteEvent("345"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("events/345", 0)).toBe(true);
			});
		});
	});
});
