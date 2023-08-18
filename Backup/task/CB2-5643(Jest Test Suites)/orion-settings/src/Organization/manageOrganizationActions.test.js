import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./manageOrganizationActions";

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

describe("Manage Organization Sync Actions", () => {
	it("Should fire an action on fetch org success", () => {
		const id = "";
		const expectedAction = {
			type: t.FETCH_ORG_SUCCESS,
			id
		};
		expect(actions.fetchOrgSuccess(id)).toEqual(expectedAction);
	});

	it("Should fire an action on update org success", () => {
		const org = {};
		const expectedAction = {
			type: t.UPDATE_ORG_SUCCESS,
			update: org
		};
		expect(actions.updateOrgSuccess(org)).toEqual(expectedAction);
	});

	it("Should fire an action on submitting org update", () => {
		const expectedAction = {
			type: t.IS_SUBMITTING_ORG_UPDATE
		};
		expect(actions.isSubmittingOrgUpdate()).toEqual(expectedAction);
	});
});