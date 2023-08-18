import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as t from "./actionTypes";
import * as actions from "./appActions";

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

describe("App Sync Actions", () => {

	it("Should create an action to fetch rules.", () => {
		const expectedAction = {
			type: t.FETCH_RULES_SUCCESS,
			rules: "rules"
		};
		expect(actions.fetchRulesSuccess("rules")).toEqual(expectedAction);
	});

	it("Should create an action to fetch org members", () => {
		const expectedAction = {
			type: t.FETCH_ORG_USERS_SUCCESS,
			payload: "payload"
		};
		expect(actions.fetchOrgUsersSuccess("payload")).toEqual(expectedAction);
	});

	it("Should create an action for health systems fetch success", () => {
		const expectedAction = {
			type: t.FETCH_HEALTH_SYSTEMS_SUCCESS,
			payload: {
				systems: [{ "a": "b" }]
			}
		};
		expect(actions.fetchHealthSystemsSuccess([{"a": "b"}])).toEqual(expectedAction);
	});

});

describe("App Async Actions", () => {

	describe("fetchRules", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"/rules",
				[{}]
			);
		});
		
		it("Should call get a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchRules("123"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should dispatch FETCH_RULES_SUCCESS on successful get", () => {
			const store = mockStore(initialState);

			const expectedAction = [{
				type: t.FETCH_RULES_SUCCESS,
				rules: [{}]
			}];

			store.dispatch(actions.fetchRules("123"));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedAction);
			});
		});
	});

	describe("fetchOrgUsers", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"/organizations",
				[{}]
			);
		});
		
		it("Should call get a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchOrgUsers("ASC"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should look for the users of whatever org is passed to it.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchOrgUsers("ASC"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("organizations/ASC/users")).toBe(true);
			});
		});

		it("Should dispatch FETCH_ORG_USERS_SUCCESS on successful get.", () => {
			const store = mockStore(initialState);

			const expectedAction = [{
				type: t.FETCH_ORG_USERS_SUCCESS,
				payload: [{}]
			}];

			store.dispatch(actions.fetchOrgUsers("ASC"));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedAction);
			});
		});
	});

	describe("reHydrateUser", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"/users",
				{}
			);
		});

		const user = {id: "345" };

		it("Should call get a single time", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.reHydrateUser("345"));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point to whichever user's id was passed to it", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.reHydrateUser("345"));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/users/345/profile")).toBe(true);
			});
		});

		///////////// NOTE //////////////

		// Further testing should be done on this action. However at this time, I'm unable to find the information
		// to perform async in async actions tests.

		/////////////////////////////////

	});

	describe("fetchHealthSystems", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"/healthRules",
				[{}]
			);
		});

		it("Should dispatch FETCH_HEALTH_SYSTEMS_SUCCESS on successful get.", () => {
			const store = mockStore(initialState);

			const expectedAction = [{
				type: t.FETCH_HEALTH_SYSTEMS_SUCCESS,
				payload: {
					systems: [{}]
				}
			}];

			store.dispatch(actions.fetchHealthSystems());
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedAction);
			});
		});
	});
});






