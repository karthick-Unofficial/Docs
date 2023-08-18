import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./userAccountActions";

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

describe("User Account Sync Actions", () => {
	it("Should fire an action on profile fetch success", () => {
		const user = {};
		const expectedAction = {
			type: t.FETCH_PROFILE_SUCCESS,
			user
		};
		expect(actions.fetchProfileSuccess(user)).toEqual(expectedAction);
	});

	it("Should fire an action on delete user success", () => {
		const expectedAction = {
			type: t.DELETE_USER_SUCCESS
		};
		expect(actions.deleteUserSuccess()).toEqual(expectedAction);
	});
});