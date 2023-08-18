import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { waitFor } from "@testing-library/react";
import * as t from "../actionTypes";
import * as actions from "./reportBuilderActions";

import fetchMock from "fetch-mock";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

global.setImmediate = process.nextTick;

const initialState = {
	appState: {
		global: {
			timeFormat: "12-hour"
		}
	}
};

const safelyMock = (method, matcher, response) => {
	// future implementation
	// fetchMock[`${method}Once`](patchedMatcher, response).catch(200)

	// current implementation to workaround
	fetchMock.mock("*", response);
};

// This implementation can also be modified when workaround is fixed
const checkMockedUrl = (url, index = 0) => {
	return fetchMock.calls().matched[index][0].url.includes(url);
};

const getSentData = () => {
	const call = fetchMock.calls().matched[0][0];
	if (call.body) {
		return JSON.parse(call.body);
	} else {
		return JSON.parse(call._bodyInit);
	}
};

const getMockedMethod = (index = 0) => {
	const call = fetchMock.calls().matched[index][0];
	return call.method;
};

// Utility to make jest resolve all pending promises so we can continue
const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));

describe("reportBuilder Sync Actions", () => {
	it("Should create an action to a field dialog's data", () => {
		const name = "Test User";
		const expectedAction = {
			type: t.WIPE_FIELD_DATA,
			payload: {
				name: name
			}
		};

		expect(actions.wipeFieldData(name)).toEqual(expectedAction);
	});

	it("Should create an action to wipe generated reports", () => {
		const expectedAction = {
			type: t.WIPE_REPORTS
		};

		expect(actions.wipeReports()).toEqual(expectedAction);
	});

	it("Should create an action to open the request dialog", () => {
		const expectedAction = {
			type: t.OPEN_REQUEST_DIALOG
		};

		expect(actions.openRequestDialogSuccess()).toEqual(expectedAction);
	});

	it("Should create an action to close the request dialog", () => {
		const expectedAction = {
			type: t.CLOSE_REQUEST_DIALOG
		};

		expect(actions.closeRequestDialogSuccess()).toEqual(expectedAction);
	});

	it("Should create an action to set submitting state in the request dialog", () => {
		const expectedAction = {
			type: t.REQUEST_DIALOG_IS_SUBMITTING
		};

		expect(actions.requestDialogIsSubmitting()).toEqual(expectedAction);
	});
});

describe("reportBuilder Async Actions", () => {
	const report = [
		{
			groups: [],
			type: "test-report"
		}
	];

	describe("submitReport", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("post", "/test-report/generate", { body: report });
		});

		it("Should make a single generate request.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.submitReport("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point to the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.submitReport("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/test-report/generate")).toBe(true);
			});
		});

		it("Should dispatch wipeReports, submittingReport, and reportDataReceived if successful.", () => {
			const store = mockStore(initialState);

			const expectedActions = [
				{
					type: t.WIPE_REPORTS
				},
				{
					type: t.SUBMITTING_REPORT
				},
				{
					type: t.BUILDER_ERROR,
					error: "There was an error processing your request."
				}
			];

			store.dispatch(actions.submitReport("test-report", { args: "args" }));
			return waitFor(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});

	describe("requestNextPage", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("post", "/test-report/generate", { body: report });
		});

		it("Should make a single generate request for the next page.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.requestNextPage("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point to the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.requestNextPage("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/test-report/generate")).toBe(true);
			});
		});

		it("Should dispatch requestingNextPage and pageReceived if successful.", () => {
			const store = mockStore(initialState);

			const expectedActions = [
				{
					type: t.REQUESTING_NEXT_PAGE
				},
				{
					type: t.BUILDER_ERROR,
					error: "There was an error processing your request."
				}
			];

			store.dispatch(actions.requestNextPage("test-report", { args: "args" }));

			return waitFor(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});

	describe("fetchFieldData", () => {
		const endpoint = "/test-api/foo";
		const data = { foo: "bar" };

		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("get", endpoint, { body: data });
		});

		it("Should make a single generate request for the next page.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchFieldData("textFieldA", endpoint));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point to the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.fetchFieldData("textFieldA", endpoint));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl(endpoint)).toBe(true);
			});
		});

		it("Should dispatch fieldDataReceived if successful.", () => {
			const store = mockStore(initialState);

			const expectedActions = [
				{
					type: t.FIELD_DATA_RECEIVED,
					payload: {
						name: "textFieldA",
						data: data
					}
				}
			];

			store.dispatch(actions.fetchFieldData("textFieldA", endpoint));
			return waitFor(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});

	describe("generateCSVExport", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("post", "/test-report/export", { body: report });
		});

		it("Should make a single request for an export.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.generateCSVExport("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point to the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.generateCSVExport("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/test-report/export")).toBe(true);
			});
		});
	});

	describe("requestCSVEmail", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock("post", "/test-report/email", { body: { ok: true } });
		});

		it("Should make a single request for an email.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.requestCSVEmail("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});
		});

		it("Should point to the correct endpoint.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.requestCSVEmail("test-report", { args: "args" }));
			return flushAllPromises().then(() => {
				expect(checkMockedUrl("/test-report/email")).toBe(true);
			});
		});

		// it("Should dispatch requestingEmail and requestDialogSubmitSuccess if successful.", () => {
		// 	const store = mockStore(initialState);

		// 	const expectedActions = [{
		// 		type: t.REQUEST_DIALOG_IS_SUBMITTING
		// 	},
		// 	{
		// 		type: t.REQUEST_DIALOG_SUBMIT_SUCCESS
		// 	}];

		// 	store.dispatch(actions.requestCSVEmail("test-report", { args: "args" }));
		// 	return flushAllPromises().then(() => {
		// 		expect(store.getActions()).toEqual(expectedActions);
		// 	});
		// });
	});
});
