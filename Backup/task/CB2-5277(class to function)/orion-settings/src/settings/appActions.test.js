// import configureMockStore from "redux-mock-store";
// import thunk from "redux-thunk";

// import * as t from "./actionTypes";
// import * as actions from "./appActions";

// import fetchMock from "fetch-mock";
// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

// const initialState = {};

it("works", () => {
	return new Promise(resolve => {
		resolve();
	});
});

// const safelyMock = (method, matcher, response) => {
// 	// future implementation
// 	// fetchMock[`${method}Once`](patchedMatcher, response).catch(200)

// 	// current implementation to workaround
// 	fetchMock.mock("*", response);
// };

// // This implementation can also be modified when workaround is fixed
// const checkMockedUrl = (url, index = 0) => {
// 	return fetchMock.calls().matched[index][0].url.includes(url);
// };

// const getSentData = () => {
// 	const call = fetchMock.calls().matched[0][0];
// 	if (call.body) {
// 		return JSON.parse(call.body);
// 	} else {
// 		return JSON.parse(call._bodyInit);
// 	}
// };

// const getMockedMethod = (index = 0) => {
// 	const call = fetchMock.calls().matched[index][0];
// 	return call.method;
// };

// // Utility to make jest resolve all pending promises so we can continue
// const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

// describe("App Sync Actions", () => {
// 	it("Should create an action to set fetching", () => {
// 		const expectedAction = {
// 			type: t.IS_FETCHING
// 		};

// 		expect(actions.setFetching()).toEqual(expectedAction);
// 	});

// 	it("Should create an action for successful ecosystem hydration", () => {
// 		const users = [{ name: "Test User" }];
// 		const orgs = [{ name: "Ares Security Corporation" }];
// 		const apps = [{ name: "Cameras" }];
// 		const integrations = [{ name: "Test Integration" }];
// 		const expectedAction = {
// 			type: t.HYDRATE_ECOSYSTEM_SUCCESS,
// 			orgs,
// 			users,
// 			apps,
// 			integrations
// 		};

// 		expect(
// 			actions.hydrateEcosystemSuccess(orgs, users, apps, integrations)
// 		).toEqual(expectedAction);
// 	});

// 	it("Should create an action for successful ecosystem refresh", () => {
// 		const users = [{ name: "Test User" }];
// 		const orgs = [{ name: "Ares Security Corporation" }];
// 		const apps = [{ name: "Cameras" }];
// 		const integrations = [{ name: "Test Integration" }];
// 		const expectedAction = {
// 			type: t.REFRESH_ECOSYSTEM_SUCCESS,
// 			orgs,
// 			users,
// 			apps,
// 			integrations
// 		};

// 		expect(
// 			actions.refreshEcosystemSuccess(orgs, users, apps, integrations)
// 		).toEqual(expectedAction);
// 	});

// 	it("Should create an action to set refreshing ecosystem", () => {
// 		const expectedAction = {
// 			type: t.IS_REFRESHING_ECOSYSTEM
// 		};

// 		expect(actions.isRefreshingEcosystem()).toEqual(expectedAction);
// 	});

// 	it("Should create an action for successful user refresh", () => {
// 		const data = { user: { name: "Test User" } };
// 		const expectedAction = {
// 			type: t.REFRESH_USER_SUCCESS,
// 			user: data.user
// 		};

// 		expect(actions.refreshUserSuccess(data)).toEqual(expectedAction);
// 	});

// 	it("Should create an action to set refreshing user", () => {
// 		const expectedAction = {
// 			type: t.IS_REFRESHING_USER
// 		};

// 		expect(actions.isRefreshingUser()).toEqual(expectedAction);
// 	});
	
// 	// it("Should create an action for succesful org apps fetch", () => {
// 	// 	const data = { orgId: { applications: [{ id: "map-app" }] } };
// 	// 	const expectedAction = {
// 	// 		type: t.GET_ALL_ORG_APPS_SUCCESS,
// 	// 		payload: data
// 	// 	};
		
// 	// 	expect(actions.getAllOrgAppsSuccess(data)).toEqual(expectedAction);
// 	// });
// });

// describe("App Async Actions", () => {
// 	describe("hydrateEcosystem", () => {
// 		afterEach(() => {
// 			fetchMock.reset();
// 			fetchMock.restore();
// 		});
// 		beforeEach(() => {
// 			safelyMock("get", "/users", []);
// 		});

// 		it("Should make four separate get requests", () => {
// 			const store = mockStore(initialState);

// 			store.dispatch(actions.hydrateEcosystem());
// 			return flushAllPromises().then(() => {
// 				expect(fetchMock.calls().matched.length).toEqual(4);
// 			});
// 		});

// 		it("Should make each request to the correct endpoint", () => {
// 			const store = mockStore(initialState);

// 			store.dispatch(actions.hydrateEcosystem());
// 			return flushAllPromises().then(() => {
// 				expect(checkMockedUrl("organizations", 0)).toBe(true);
// 				expect(checkMockedUrl("users", 1)).toBe(true);
// 				expect(checkMockedUrl("applications", 2)).toBe(true);
// 				expect(checkMockedUrl("feeds", 3)).toBe(true);
// 			});
// 		});
// 	});

// 	describe("refreshEcosystem", () => {
// 		afterEach(() => {
// 			fetchMock.reset();
// 			fetchMock.restore();
// 		});
// 		beforeEach(() => {
// 			safelyMock("get", "/users", []);
// 		});

// 		// it("Should make four separate get requests", () => {
// 		// 	const store = mockStore(initialState);

// 		// 	store.dispatch(actions.refreshEcosystem());
// 		// 	return flushAllPromises().then(() => {
// 		// 		expect(fetchMock.calls().matched.length).toEqual(4);
// 		// 	});
// 		// });

// 		// it("Should make each request to the correct endpoint", () => {
// 		// 	const store = mockStore(initialState);

// 		// 	store.dispatch(actions.refreshEcosystem());
// 		// 	return flushAllPromises().then(() => {
// 		// 		expect(checkMockedUrl("organizations", 0)).toBe(true);
// 		// 		expect(checkMockedUrl("users", 1)).toBe(true);
// 		// 		expect(checkMockedUrl("applications", 2)).toBe(true);
// 		// 		expect(checkMockedUrl("feeds", 3)).toBe(true);
// 		// 	});
// 		// });
// 	});

// 	describe("refreshUser", () => {
// 		afterEach(() => {
// 			fetchMock.reset();
// 			fetchMock.restore();
// 		});
// 		beforeEach(() => {
// 			safelyMock("get", "/users", {
// 				user: {}
// 			});
// 		});

// 		it("Should dispatch IS_REFRESHING_USER correctly", () => {
// 			const store = mockStore(initialState);

// 			const expectedActions = [
// 				{ type: t.IS_REFRESHING_USER },
// 				{ type: t.REFRESH_USER_SUCCESS, user: {} }
// 			];

// 			store.dispatch(actions.refreshUser());
// 			return flushAllPromises().then(() => {
// 				expect(store.getActions()).toEqual(expectedActions);
// 			});
// 		});

// 		it("Should make a single request to the correct endpoint", () => {
// 			const store = mockStore(initialState);

// 			store.dispatch(actions.refreshUser());
// 			return flushAllPromises().then(() => {
// 				expect(fetchMock.calls().matched.length).toEqual(1);
// 				expect(checkMockedUrl("user")).toBe(true);
// 			});
// 		});

// 		it("Should make each request with the correct data", () => {
// 			const store = mockStore(initialState);

// 			store.dispatch(actions.refreshUser());
// 			return flushAllPromises().then(() => {
// 				expect(getMockedMethod()).toEqual("GET");
// 				expect(checkMockedUrl("/myProfile")).toBe(true);
// 			});
// 		});
// 	});
// 	describe("getAllOrgApps", () => {
// 		const response = [
// 			{
// 				applications: [
// 					{
// 						appId: "map-app",
// 						icon: "",
// 						name: "Map"
// 					}
// 				],
// 				createdDate: "2017-10-18T16:54:06.874Z",
// 				description: "",
// 				id: "4709b623-7021-4458-9ab5-45e31facaff3",
// 				lastModifiedDate: "2017-10-18T16:54:06.874Z",
// 				name: "Test Organization",
// 				orgId: "test_organization"
// 			}
// 		];
		
// 		afterEach(() => {
// 			fetchMock.reset();
// 			fetchMock.restore();
// 		});
// 		beforeEach(() => {
// 			safelyMock("get", "/orgApplications", response);
// 		});
		
// 		// it("Should make a single request.", () => {
// 		// 	const store = mockStore(initialState);
		
// 		// 	store.dispatch(actions.getAllOrgApps());
// 		// 	return flushAllPromises().then(() => {
// 		// 		expect(fetchMock.calls().matched.length).toEqual(1);
// 		// 	});
// 		// });
// 		// it("Should make a get request to the correct endpoint.", () => {
// 		// 	const store = mockStore(initialState);
			
// 		// 	store.dispatch(actions.getAllOrgApps());
// 		// 	return flushAllPromises().then(() => {
// 		// 		expect(getMockedMethod()).toEqual("GET");
// 		// 		expect(checkMockedUrl("/orgApplications")).toBe(true);
// 		// 	});
// 		// });
			
// 		// it("Should dispatch getAllOrgAppsSuccess.", () => {
// 		// 	const store = mockStore(initialState);
			
// 		// 	const expectedActions = [
// 		// 		{
// 		// 			type: t.GET_ALL_ORG_APPS_SUCCESS,
// 		// 			payload: response
// 		// 		}
// 		// 	];
			
// 		// 	store.dispatch(actions.getAllOrgApps());
// 		// 	return flushAllPromises().then(() => {
// 		// 		expect(store.getActions()).toEqual(expectedActions);
// 		// 	});
// 		// });
// 	});
// });
