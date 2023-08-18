import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import "isomorphic-fetch";

import * as t from "./actionTypes";
import * as actions from "./actions";

import { initialState as userInitialState } from "./reducers/user";
import { initialState as identityInitialState } from "./reducers/identity";

// orion test utilities
import {
	flushAllPromises,
	safelyMock,
	checkMockedUrl,
	getMockedMethod,
	getSentData
} from "../lib/test-utils.js";

import fetchMock from "fetch-mock";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("ListPanel Sync Actions", () => {
	it("Should create an action to invalidate identity", () => {
		const expectedAction = {
			type: t.IDENTITY_INVALIDATED
		};
		expect(actions.identityInvalidated()).toEqual(expectedAction);
	});

	it("Should create an action for hydrate user success", () => {
		const user = {
			name: "Test User",
			email: "test@test.com"
		};
		const expectedAction = {
			type: t.HYDRATE_USER_SUCCESS,
			user: user
		};
		expect(actions.hydrateUserSuccess(user)).toEqual(expectedAction);
	});

	// it("Should create an action for login request", () => {
	//     const expectedAction = {
	//         type: t.LOGIN_REQUEST
	//     }
	//     expect(actions.requestLogin()).toEqual(expectedAction);
	// })

	// it("Should create an action for login success", () => {
	//     const expectedAction = {
	//         type: t.LOGIN_SUCCESS
	//     }
	//     expect(actions.loginSuccess()).toEqual(expectedAction);
	// })

	// it("Should create an action for login failure", () => {
	//     const expectedAction = {
	//         type: t.LOGIN_FAILURE,
	//         errorMessage: 'error'
	//     }
	//     expect(actions.loginFailure('error')).toEqual(expectedAction);
	// })
});

describe("ListPanel Async Actions", () => {
	describe("hydrateUser", () => {
		const response = {
			user: {
				name: "Test User",
				id: "123",
				email: "test@test.com"
			},
			org: {
				name: "Ares Security Corporation",
				orgId: "ares_security_corp"
			}
		};
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("get", "/user", {
				body: response,
				headers: { "content-type": "application/json" }
			});
		});

		it("Should dispatch HYDRATE_USER_SUCCESS on success", () => {
			const store = mockStore({ appState: userInitialState });

			const expectedActions = [
				{ type: t.HYDRATE_USER_SUCCESS, user: response.user }
			];

			store.dispatch(actions.hydrateUser(response.user.id));
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});

		it("Should call getProfile a single time", () => {
			const store = mockStore({ appState: userInitialState });

			store.dispatch(actions.hydrateUser(response.user.id));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/profile")).toBe(true);
				expect(getMockedMethod()).toEqual("GET");
			});
		});

		it("Should call getProfile with the correct data", () => {
			const store = mockStore({ appState: userInitialState });

			store.dispatch(actions.hydrateUser(response.user.id));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl(`/users/${response.user.id}/profile`)).toBe(true);
			});
		});
	});

	describe("logOut", () => {
		it("Should dispatch IDENTITY_INVALIDATED on success", () => {
			const store = mockStore({ appState: userInitialState });

			const expectedActions = [{"type": "IDENTITY_INVALIDATED"}, {"type": "IDENTITY_INVALIDATED"}];

			store.dispatch(actions.logOut());
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});

		// Should also test that cookie has been cleared. Maybe needs to be in client-app-core?
	});

	// describe("login", () => {
	//     const creds = {
	//         "username": "testuser@test.com",
	//         "password": "1111111"
	//     }
	//     const response = {"success": true, "access_token": 'aabcd1234'}
	//     afterEach(() => {
	//         fetchMock.reset();
	//         fetchMock.restore();
	//     })
	//     beforeEach(() => {
	//         safelyMock('get', '/api/auth/token', { body: response, headers: { 'content-type': 'application/json' }})
	//     })

	//     it("Should dispatch LOGIN_REQUEST and LOGIN_SUCCESS correctly", () => {
	//         const store = mockStore({appState : userInitialState});

	//         const expectedActions = [
	//             { type: t.LOGIN_REQUEST },
	//             { type: t.LOGIN_SUCCESS }
	//         ]

	//         store.dispatch(actions.loginUser(creds));
	//         return flushAllPromises().then(() => {
	//             expect(store.getActions()).toEqual(expectedActions);
	//         });

	//     })

	//     it("Should have called login a single time", () => {
	//         const creds = {
	//             "username": "testuser@test.com",
	//             "password": "1111111"
	//         }
	//         const store = mockStore({appState : userInitialState});

	//         store.dispatch(actions.loginUser(creds));
	//         return flushAllPromises().then(() => {
	//             expect(checkMockedUrl('auth/token')).toBe(true);
	//             expect(getMockedMethod()).toEqual("POST");
	//         });

	//     })

	//     it("Should have called login with the correct data", () => {
	//         const creds = {
	//             "username": "testuser@test.com",
	//             "password": "1111111"
	//         }
	//         const store = mockStore({appState : userInitialState});

	//         store.dispatch(actions.loginUser(creds));
	//         return flushAllPromises().then(() => {
	//             expect(getSentData()).toEqual(creds);
	//         });

	//     })

	//     // Should also test that cookie has been set

	// })
});
