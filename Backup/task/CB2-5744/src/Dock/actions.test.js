import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import "isomorphic-fetch";

import * as t from "./actionTypes";
import * as actions from "./actions";

import { initialState as userInitialState } from "./reducer";

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

describe("Dock Sync Actions", () => {
	it("Should create an action to set tab", () => {
		const expectedAction = {
			type: t.SET_ALERTS_TAB,
			tab: "notifications"
		};
		expect(actions.setTab("notifications")).toEqual(expectedAction);
	});

	it("Should create an action to toggle sidebar open and closed", () => {
		const expectedAction = {
			type: t.TOGGLE_OPEN
		};
		expect(actions.toggleOpen()).toEqual(expectedAction);
	});

	it("Should create an action to display a new alert popin", () => {
		const notification = {
			id: 123,
			message: "A sample notification"
		};
		const expectedAction = {
			type: t.SHOW_ALERT,
			notification
		};
		expect(actions.newNotificationAlert(notification)).toEqual(
			expectedAction
		);
	});

	it("Should create an action to remove a new alert popin", () => {
		const notification = {
			id: 123,
			message: "A sample notification"
		};
		const expectedAction = {
			type: t.HIDE_ALERT,
			notificationId: notification.id
		};
		expect(actions.clearNotification(notification.id)).toEqual(
			expectedAction
		);
	});

	it("Should create an action to generate a user feedback notification.", () => {
		const store = mockStore({ appState: userInitialState });
		const date = new Date();

		const notification = {
			id: "User feedback confirmed.",
			feedback: true,
			createdDate: date,
			summary: "User feedback confirmed.",
			undoFunc: expect.any(Function)
		};

		const expectedActions = [
			{
				type: t.SHOW_ALERT,
				notification: notification
			}
		];

		store.dispatch(
			actions.createUserFeedback("User feedback confirmed.", jest.fn())
		);
		return flushAllPromises().then(() => {
			// temporary, we need to find a way to expect any function, the above expect.any(Function) does not work
			expect(store.getActions()[0].notification.id).toEqual(
				"User feedback confirmed."
			);
			expect(store.getActions()[0].notification.feedback).toEqual(true);
			// expect(store.getActions()[0].notification.createdDate).toEqual(date);
			expect(store.getActions()[0].notification.summary).toEqual(
				"User feedback confirmed."
			);
		});
	});
});
