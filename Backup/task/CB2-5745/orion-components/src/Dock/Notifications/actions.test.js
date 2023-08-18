import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import "isomorphic-fetch";

import * as t from "./actionTypes";
import * as actions from "./actions";

import { initialState as notificationsInitialState } from "../reducer";

// orion test utilities
import {
	flushAllPromises,
	safelyMock,
	checkMockedUrl,
	getMockedMethod,
	getSentData
} from "../../lib/test-utils.js";

import fetchMock from "fetch-mock";
import { waitFor } from "@testing-library/dom";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Notifications Sync Actions", () => {
	const notifications = [
		{
			id: "123",
			message: "Something has happened"
		},
		{
			id: "123",
			message: "Something else has happened"
		}
	];

	it("Should create an action for initial received notifications", () => {
		const expectedAction = {
			type: t.INITIAL_NOTIFICATIONS_RECEIVED,
			notifications: notifications
		};
		expect(actions.initialNotificationsReceived(notifications)).toEqual(
			expectedAction
		);
	});

	it("Should create an action for archive fetch success", () => {
		const expectedAction = {
			type: t.GET_ARCHIVE_FAILED
		};
		expect(actions.getArchiveFailed()).toEqual(expectedAction);
	});

	it("Should create an action for archive fetch failure", () => {
		const expectedAction = {
			type: t.GET_ARCHIVE_SUCCESS,
			notifications
		};
		expect(actions.getArchiveSuccess(notifications)).toEqual(
			expectedAction
		);
	});

	it("Should create an action for archive dump", () => {
		const expectedAction = {
			type: t.DUMP_ARCHIVE
		};
		expect(actions.dumpArchive()).toEqual(expectedAction);
	});

	// The following for have async elements in optimstMiddleware, tests for async should be written there?

	it("Should create an action to close a notification", () => {
		const notification = {
			id: "1111",
			message: "yo"
		};
		const expectedAction = {
			type: t.CLOSE_NOTIFICATION,
			notificationId: notification.id
		};
		expect(actions.closeNotification(notification.id)).toEqual(
			expectedAction
		);
	});

	it("Should create an action to close bulk notifications", () => {
		const expectedAction = {
			type: t.CLOSE_NOTIFICATIONS,
			notificationIds: notifications.map((n) => n.id)
		};
		expect(
			actions.closeBulkNotifications(notifications.map((n) => n.id))
		).toEqual(expectedAction);
	});

	it("Should create an action to reopen a notification", () => {
		const notification = {
			id: "1111",
			message: "yo"
		};
		const expectedAction = {
			type: t.REOPEN_NOTIFICATION,
			notification,
			notificationId: notification.id
		};
		expect(actions.reopenNotification(notification)).toEqual(
			expectedAction
		);
	});

	it("Should create an action to reopen bulk notifications", () => {
		const expectedAction = {
			type: t.REOPEN_NOTIFICATIONS,
			notifications,
			notificationIds: notifications.map((n) => n.id)
		};
		expect(actions.reopenBulkNotifications(notifications)).toEqual(
			expectedAction
		);
	});

	describe("Notifications Async Actions", () => {
		const notifications = [
			{
				id: "123",
				message: "Something has happened"
			},
			{
				id: "123",
				message: "Something else has happened"
			}
		];

		describe("queryArchive", () => {
			afterEach(() => {
				fetchMock.reset();
				fetchMock.restore();
			});
			beforeEach(() => {
				safelyMock("get", "/archive", {
					body: notifications,
					headers: { "content-type": "application/json" }
				});
			});

			it("Should dispatch GET_ARCHIVE_SUCCESS correctly", () => {
				const store = mockStore({
					appState: notificationsInitialState
				});

				const expectedActions = [
					{
						type: t.GET_ARCHIVE_SUCCESS,
						notifications: notifications
					}
				];

				store.dispatch(actions.queryArchive(1));
				return waitFor(() => {
					console.log(store.getActions(), "store.getActions()");
					expect(store.getActions()).toEqual(expectedActions);
				});
			});

			it("Should call setAppState a single time", () => {
				const store = mockStore({
					appState: notificationsInitialState
				});

				store.dispatch(actions.queryArchive(1));
				return flushAllPromises().then(() => {
					expect(checkMockedUrl("/archive")).toBe(true);
				});
			});

			it("Should call setAppState with the correct data", () => {
				const store = mockStore({
					appState: notificationsInitialState
				});

				store.dispatch(actions.queryArchive(1));
				return flushAllPromises().then(() => {
					expect(checkMockedUrl("/archive/1")).toBe(true);
					expect(getMockedMethod()).toEqual("GET");
				});
			});
		});
	});
});
