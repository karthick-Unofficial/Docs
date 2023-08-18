import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../actionTypes";
import * as actions from "./manageEcosystemActions";
import { updateOrgSuccess } from "../Organization/manageOrganizationActions";

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

describe("ManageEcosystem Sync Actions", () => {
	it("Should fire an action when create org success", () => {
		const data = {};
		const expectedAction = {
			type: t.CREATE_ORG_SUCCESS,
			payload: data
		};
		expect(actions.createOrgSuccess(data)).toEqual(expectedAction);
	});

	it("Should call an action to add new org error", () => {
		const err = "";
		const expectedAction = {
			type: t.CREATE_ORG_ERROR,
			message: err
		};
		expect(actions.newOrgError(err)).toEqual(expectedAction);
	});

	it("Should call an action to clear org error", () => {
		const expectedAction = {
			type: t.CLEAR_ORG_ERROR
		};
		expect(actions.clearOrgError()).toEqual(expectedAction);
	});
});

describe("ManageEcosystem Async Actions", () => {

	describe("toggleOrgDisabled", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"put",
				"/organizations/foo",
				{ body: { "deleted": 0, "errors": 0, "inserted": 0, "replaced": 1, "skipped": 0, "unchanged": 0 }, headers: { "content-type": "application/json" } }
			);
		});

		it("Should call update a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.toggleOrgDisabled("orgId"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});

		});

		const data = { organization: { disabled: true } };

		it("Should have sent with the correct data", () => {
			const store = mockStore(initialState);

			const expectedData = data;

			store.dispatch(actions.toggleOrgDisabled("orgId"));
			return flushAllPromises().then(() => {
				expect(getSentData()).toEqual(expectedData);
			});
		});

		it("Should dispatch UPDATE_ORG_SUCCESS on successful update", () => {
			const store = mockStore(initialState);
			store.dispatch(updateOrgSuccess({}));

			const expectedActions = [{
				type: "UPDATE_ORG_SUCCESS",
				update: {}
			}];

			store.dispatch(actions.toggleOrgDisabled("orgId"));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});
});