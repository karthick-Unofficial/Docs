import notifications, { initialState as seedState } from "./reducer.js";

import * as actions from "./actions";

describe("notifications reducer", () => {
	it("should initialize with expected initial state", () => {
		expect(notifications(undefined, {})).toEqual(seedState);
	});

	describe("Should handle initialNotificationsReceived", () => {
		it("Should add notifications correctly to activeItems", () => {
			const sampleNotifications = [
				{
					summary: "Something happened.",
					id: "123"
				},
				{
					summary: "Something happened again.",
					id: "789"
				}
			];
			let action;
			let initialState;
			let expectedState;

			action = actions.initialNotificationsReceived(sampleNotifications);
			initialState = { ...seedState };
			expectedState = {
				...seedState,
				activeItems: ["123", "789"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should add notifications correctly to activeItemsById", () => {
			const sampleNotifications = [
				{
					summary: "Something happened.",
					id: "123"
				},
				{
					summary: "Something happened again.",
					id: "789"
				}
			];
			let action;
			let initialState;
			let expectedState;

			action = actions.initialNotificationsReceived(sampleNotifications);
			initialState = { ...seedState };
			expectedState = {
				...seedState,
				activeItemsById: {
					123: sampleNotifications[0],
					789: sampleNotifications[1]
				}
			};
			expect(notifications(initialState, action).activeItemsById).toEqual(
				expectedState.activeItemsById
			);
		});
	});

	describe("Should handle closeNotification", () => {
		it("Should remove notification correctly from activeItems when a single item is present", () => {
			const notificationId = "123";

			let action;
			let initialState;
			let expectedState;

			action = actions.closeNotification(notificationId);
			initialState = {
				...seedState,
				activeItems: ["123"]
			};
			expectedState = {
				...seedState,
				activeItems: []
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should remove notification correctly from activeItems when multiple items are present, in various configurations", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeNotification("123");
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["456", "789"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);

			action = actions.closeNotification("456");
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["123", "789"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);

			action = actions.closeNotification("789");
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["123", "456"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should not alter state if passed id is not present", () => {
			const notificationId = "789";

			let action;
			let initialState;
			let expectedState;

			action = actions.closeNotification(notificationId);
			initialState = {
				...seedState,
				activeItems: ["123", "456"]
			};
			expectedState = initialState;
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should remove notification correctly from activeItemsById", () => {
			const notificationId = "123";

			let action;
			let initialState;
			let expectedState;

			action = actions.closeNotification(notificationId);
			initialState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expectedState = {
				...seedState,
				activeItemsById: {
					789: { id: "789" }
				}
			};
			expect(notifications(initialState, action).activeItemsById).toEqual(
				expectedState.activeItemsById
			);
		});

		it("Should not alter activeItemsById if passed notification is not present ", () => {
			const notificationId = "456";

			let action;
			let initialState;
			let expectedState;

			action = actions.closeNotification(notificationId);
			initialState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expectedState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expect(notifications(initialState, action).activeItemsById).toEqual(
				expectedState.activeItemsById
			);
		});
	});

	describe("Should handle closeBulkNotifications", () => {
		it("Should remove notifications correctly from activeItems, in various configurations", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeBulkNotifications(["123", "456"]);
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["789"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);

			action = actions.closeBulkNotifications(["123", "789"]);
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["456"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);

			action = actions.closeBulkNotifications(["789", "456"]);
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["123"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should only remove a notification if the id is present", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeBulkNotifications(["123", "1000"]);
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["456", "789"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should not alter state if no passed ids are present", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeBulkNotifications(["1123123", "1000"]);
			initialState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expectedState = {
				...seedState,
				activeItems: ["123", "456", "789"]
			};
			expect(notifications(initialState, action).activeItems).toEqual(
				expectedState.activeItems
			);
		});

		it("Should remove notifications correctly from activeItemsById", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeBulkNotifications(["123", "456"]);
			initialState = {
				...seedState,
				activeItemsById: {
					456: { id: "456" },
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expectedState = {
				...seedState,
				activeItemsById: {
					789: { id: "789" }
				}
			};
			expect(notifications(initialState, action).activeItemsById).toEqual(
				expectedState.activeItemsById
			);
		});

		it("Should only remove a notification from activeItemsById if the id is present ", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeBulkNotifications(["1000", "456"]);
			initialState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					456: { id: "456" },
					789: { id: "789" }
				}
			};
			expectedState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expect(notifications(initialState, action).activeItemsById).toEqual(
				expectedState.activeItemsById
			);
		});

		it("Should not alter activeItemsById if passed notification is not present ", () => {
			let action;
			let initialState;
			let expectedState;

			action = actions.closeBulkNotifications(["as;lkjasdfaw", "098765"]);
			initialState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expectedState = {
				...seedState,
				activeItemsById: {
					123: { id: "123" },
					789: { id: "789" }
				}
			};
			expect(notifications(initialState, action).activeItemsById).toEqual(
				expectedState.activeItemsById
			);
		});
	});

	describe("Should handle dumpArchive", () => {
		it("reset archiveItems and archiveItemsById to empty when some items are present in each", () => {
			const sampleNotification = {
				summary: "Something happened.",
				id: "123"
			};

			let action;
			let initialState;
			let expectedState;

			action = actions.dumpArchive();
			initialState = {
				...seedState,
				archiveItems: ["123", "456", "1000"],
				archiveItemsById: {
					123: { id: 123 },
					456: { id: 456 },
					789: { id: 789 }
				}
			};
			expectedState = {
				...seedState,
				archiveItems: [],
				archiveItemsById: {}
			};
			expect(notifications(initialState, action)).toEqual(expectedState);
		});

		it("Should not alter archiveItems and archiveItemsById if they are already empty", () => {
			const sampleNotification = {
				summary: "Something happened.",
				id: "123"
			};

			let action;
			let initialState;
			let expectedState;

			action = actions.dumpArchive();
			initialState = {
				...seedState,
				archiveItems: [],
				archiveItemsById: {}
			};
			expectedState = {
				...seedState,
				archiveItems: [],
				archiveItemsById: {}
			};
			expect(notifications(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle getArchiveSuccess", () => {
		// Returns all thus-queried pages with each request (no appends)

		it("Should add notifications correctly to archiveItems if empty", () => {
			const sampleNotifications = [
				{
					summary: "Something happened.",
					id: "123"
				},
				{
					summary: "Something happened again.",
					id: "789"
				}
			];
			let action;
			let initialState;
			let expectedState;

			action = actions.getArchiveSuccess(sampleNotifications);
			initialState = { ...seedState };
			expectedState = {
				...seedState,
				archiveItems: ["123", "789"]
			};
			expect(notifications(initialState, action).archiveItems).toEqual(
				expectedState.archiveItems
			);
		});

		it("Should add notifications correctly to archiveItemsById if empty", () => {
			const sampleNotifications = [
				{
					summary: "Something happened.",
					id: "123"
				},
				{
					summary: "Something happened again.",
					id: "789"
				}
			];
			let action;
			let initialState;
			let expectedState;

			action = actions.getArchiveSuccess(sampleNotifications);
			initialState = { ...seedState };
			expectedState = {
				...seedState,
				archiveItemsById: {
					123: sampleNotifications[0],
					789: sampleNotifications[1]
				}
			};
			expect(
				notifications(initialState, action).archiveItemsById
			).toEqual(expectedState.archiveItemsById);
		});
	});
});
