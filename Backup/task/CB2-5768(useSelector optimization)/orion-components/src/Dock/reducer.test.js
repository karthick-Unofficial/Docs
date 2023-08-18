import alertSidebar, { initialState as seedState } from "./reducer.js";

import * as actions from "./actions";
import * as notificationsActions from "./Notifications/actions";

describe("Dock reducer", () => {
	it("should initialize with expected initial state", () => {
		expect(alertSidebar(undefined, {})).toEqual(seedState);
	});

	describe("Should handle setTab", () => {
		it("Should assign tab correctly and empty newAlerts", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.setTab("notifications");
			initialState = { ...seedState };
			expectedState = {
				...seedState,
				tab: "notifications",
				newAlerts: []
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	// describe("Should handle toggleClose", () => {
	//     it("Should empty newAlerts", () => {

	//         let action;
	//         let initialState;
	//         let expectedState;

	//         action = actions.toggleOpen('notifications');
	//         initialState = { ...seedState };
	//         expectedState = {
	//                 ...seedState,
	//                 newAlerts: []
	//         }
	//         expect(alertSidebar(initialState, action)).toEqual(expectedState)

	//     })
	// })

	describe("Should handle toggleOpen", () => {
		it("Should toggle isOpen correctly from false to true", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.toggleOpen();
			initialState = {
				...seedState,
				isOpen: false
			};
			expectedState = {
				...seedState,
				isOpen: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should toggle isOpen correctly from true to false", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.toggleOpen();
			initialState = {
				...seedState,
				isOpen: true
			};
			expectedState = {
				...seedState,
				isOpen: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle closeNotificationFailed", () => {
		it("Should set isError to true from false", () => {
			const notification = {
				id: "123",
				message: "This will fail."
			};

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_FAILED",
				notificationId: notification.id,
				notification: notification,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [notification.id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already true", () => {
			const notification = {
				id: "123",
				message: "This will fail."
			};

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_FAILED",
				notificationId: notification.id,
				notification: notification,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expectedState = {
				...seedState,
				rejectedNots: [notification.id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should prepend bad id of bad notification to front of rejectedNots", () => {
			const notification = {
				id: "123",
				message: "This will fail."
			};

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_FAILED",
				notificationId: notification.id,
				notification: notification,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: ["123", "456"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [notification.id, "123", "456"],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle closeNotificationsFailed", () => {
		it("Should set isError to true from false", () => {
			const notifications = [
				{
					id: "123",
					message: "This will fail."
				}
			];

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_FAILED",
				notificationIds: [notifications[0].id],
				notifications: notifications,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [notifications[0].id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already true", () => {
			const notifications = [
				{
					id: "123",
					message: "This will fail."
				}
			];

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_FAILED",
				notificationIds: [notifications[0].id],
				notifications: notifications,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expectedState = {
				...seedState,
				rejectedNots: [notifications[0].id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should prepend bad ids of bad notifications to front of rejectedNots", () => {
			const notifications = [
				{
					id: "123",
					message: "This will fail."
				},
				{
					id: "456",
					message: "This will fail too."
				},
				{
					id: "789",
					message: "This will fail as well."
				}
			];

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_FAILED",
				notificationIds: notifications.map((n) => n.id),
				notifications: notifications,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: ["1000", "1001"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [...action.notificationIds, "1000", "1001"],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle reopenNotificationFailed", () => {
		it("Should set isError to true from false", () => {
			const notification = {
				id: "123",
				message: "This will fail."
			};

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "REOPEN_NOTIFICATION_FAILED",
				notificationId: notification.id,
				notification: notification,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [notification.id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already true", () => {
			const notification = {
				id: "123",
				message: "This will fail."
			};

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "REOPEN_NOTIFICATION_FAILED",
				notificationId: notification.id,
				notification: notification,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expectedState = {
				...seedState,
				rejectedNots: [notification.id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should prepend bad id of bad notification to front of rejectedNots", () => {
			const notification = {
				id: "123",
				message: "This will fail."
			};

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "REOPEN_NOTIFICATION_FAILED",
				notificationId: notification.id,
				notification: notification,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: ["123", "456"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [notification.id, "123", "456"],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle reopenNotificationsFailed", () => {
		it("Should set isError to true from false", () => {
			const notifications = [
				{
					id: "123",
					message: "This will fail."
				}
			];

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "REOPEN_NOTIFICATIONS_FAILED",
				notificationIds: [notifications[0].id],
				notifications: notifications,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [notifications[0].id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already true", () => {
			const notifications = [
				{
					id: "123",
					message: "This will fail."
				}
			];

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "REOPEN_NOTIFICATIONS_FAILED",
				notificationIds: [notifications[0].id],
				notifications: notifications,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expectedState = {
				...seedState,
				rejectedNots: [notifications[0].id],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should prepend bad ids of bad notifications to front of rejectedNots", () => {
			const notifications = [
				{
					id: "123",
					message: "This will fail."
				},
				{
					id: "456",
					message: "This will fail too."
				},
				{
					id: "789",
					message: "This will fail as well."
				}
			];

			let action;
			let initialState;
			let expectedState;

			action = {
				type: "REOPEN_NOTIFICATIONS_FAILED",
				notificationIds: notifications.map((n) => n.id),
				notifications: notifications,
				error: "There was an error"
			};

			initialState = {
				...seedState,
				rejectedNots: ["1000", "1001"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [...action.notificationIds, "1000", "1001"],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle getArchiveFailed", () => {
		it("Should set isError to true from false", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveFailed();

			initialState = {
				...seedState,
				hasError: false
			};
			expectedState = {
				...seedState,
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already true", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveFailed();

			initialState = {
				...seedState,
				hasError: true
			};
			expectedState = {
				...seedState,
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should set empty rejectedNots array", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveFailed();
			initialState = {
				...seedState,
				rejectedNots: ["1000", "1001"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change rejectedNots array if already empty", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveFailed();
			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: true
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle getArchiveSuccess", () => {
		it("Should set isError to false from true", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveSuccess();

			initialState = {
				...seedState,
				hasError: true
			};
			expectedState = {
				...seedState,
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already false", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveSuccess();

			initialState = {
				...seedState,
				hasError: false
			};
			expectedState = {
				...seedState,
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should set empty rejectedNots array", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveSuccess();
			initialState = {
				...seedState,
				rejectedNots: ["1000", "1001"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change rejectedNots array if already empty", () => {
			let action;
			let initialState;
			let expectedState;

			action = notificationsActions.getArchiveSuccess();
			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle closeNotificationComplete", () => {
		it("Should set isError to false from true", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_COMPLETE",
				notificationId: "123"
			};

			initialState = {
				...seedState,
				hasError: true
			};
			expectedState = {
				...seedState,
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already false", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_COMPLETE",
				notificationId: "123"
			};

			initialState = {
				...seedState,
				hasError: false
			};
			expectedState = {
				...seedState,
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should set empty rejectedNots array", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_COMPLETE",
				notificationId: "123"
			};
			initialState = {
				...seedState,
				rejectedNots: ["1000", "1001"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change rejectedNots array if already empty", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATION_COMPLETE",
				notificationId: "123"
			};
			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle closeNotificationsComplete", () => {
		it("Should set isError to false from true", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_COMPLETE",
				notificationIds: ["123", "456"]
			};

			initialState = {
				...seedState,
				hasError: true
			};
			expectedState = {
				...seedState,
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isError if already false", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_COMPLETE",
				notificationIds: ["123", "456"]
			};

			initialState = {
				...seedState,
				hasError: false
			};
			expectedState = {
				...seedState,
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should set empty rejectedNots array", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_COMPLETE",
				notificationIds: ["123", "456"]
			};
			initialState = {
				...seedState,
				rejectedNots: ["1000", "1001"],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should not change rejectedNots array if already empty", () => {
			let action;
			let initialState;
			let expectedState;

			action = {
				type: "CLOSE_NOTIFICATIONS_COMPLETE",
				notificationIds: ["123", "456"]
			};
			initialState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expectedState = {
				...seedState,
				rejectedNots: [],
				hasError: false
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle newNotificationAlert", () => {
		it("Should add a new notification correctly to newAlerts when empty", () => {
			const sampleNotification = {
				summary: "Something happened.",
				id: "123"
			};
			let action;
			let initialState;
			let expectedState;

			action = actions.newNotificationAlert(sampleNotification);
			initialState = { ...seedState };
			expectedState = {
				...seedState,
				newAlerts: [sampleNotification]
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should append a new notification correctly to newAlerts when some items are already in the queue ", () => {
			const sampleNotification = {
				summary: "Something happened.",
				id: "123"
			};
			let action;
			let initialState;
			let expectedState;

			action = actions.newNotificationAlert(sampleNotification);
			initialState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "def", summary: "I'm second." }
				]
			};
			expectedState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "def", summary: "I'm second." },
					sampleNotification
				]
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle clearNotification", () => {
		it("Should clear the correct notification from newAlerts when it is the only item present", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.clearNotification("abc");
			initialState = {
				...seedState,
				newAlerts: [{ id: "abc", summary: "I'm first." }]
			};
			expectedState = {
				...seedState,
				newAlerts: []
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});

		it("Should clear the correct notification from newAlerts when multiple items are present, in various configurations", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.clearNotification("abc");
			initialState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "def", summary: "I'm second." },
					{ id: "678", summary: "I'm third." }
				]
			};
			expectedState = {
				...seedState,
				newAlerts: [
					{ id: "def", summary: "I'm second." },
					{ id: "678", summary: "I'm third." }
				]
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);

			action = actions.clearNotification("def");
			initialState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "def", summary: "I'm second." },
					{ id: "678", summary: "I'm third." }
				]
			};
			expectedState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "678", summary: "I'm third." }
				]
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);

			action = actions.clearNotification("678");
			initialState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "def", summary: "I'm second." },
					{ id: "678", summary: "I'm third." }
				]
			};
			expectedState = {
				...seedState,
				newAlerts: [
					{ id: "abc", summary: "I'm first." },
					{ id: "def", summary: "I'm second." }
				]
			};
			expect(alertSidebar(initialState, action)).toEqual(expectedState);
		});
	});
});
