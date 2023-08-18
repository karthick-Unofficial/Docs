import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "../../../actionTypes";
import * as actions from "./editEcosystemOrgActions";
import { updateOrgSuccess } from "../../../Organization/manageOrganizationActions";

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

describe("EditEcosystemOrg Sync Actions", () => {
	it("Should call an action to assign an app", () => {
		const orgId = "";
		const app = "";
		const expectedAction = {
			type: t.ASSIGN_APP,
			app,
			orgId
		};
		expect(actions.assignApp(app, orgId)).toEqual(expectedAction);
	});
});

describe("EditEcosystemOrg Async Actions", () => {

	describe("updateOrgSharingConnections", () => {
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

			store.dispatch(actions.updateOrgSharingConnections({}));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});

		});

		const connections = 1;
		const body = { organization: { maxSharingConnections: connections } }

		it("Should have sent with the correct data", () => {
			const store = mockStore(initialState);

			const expectedData = body;

			store.dispatch(actions.updateOrgSharingConnections("orgId", 1));
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

			store.dispatch(actions.updateOrgSharingConnections("test_organization_1", 1));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});
});