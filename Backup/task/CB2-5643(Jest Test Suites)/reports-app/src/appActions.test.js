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

// Utility to make jest resolve all pending promises so we can continue
const flushAllPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe("App Sync Actions", () => {
	it("Should create an action to for received report types", () => {
		const reports = {
			"zone-report": {
				"app": "shapes-app"
			}
		};
		const expectedAction = {
			type: t.REPORT_TYPES_RECEIVED,
			payload: reports
		};

		expect(actions.reportTypesReceived(reports)).toEqual(expectedAction);
	});
});

describe("App Async Actions", () => {
	describe("discoverReportTypes", () => {
		afterEach(() => {
			fetchMock.reset();
			fetchMock.restore();
		});
		beforeEach(() => {
			safelyMock(
				"get",
				"/reports-app/api/reportTypes",
				[]
			);
		});

		it("Should call get a single time.", () => {
			const store = mockStore(initialState);

			store.dispatch(actions.discoverReportTypes());
			return flushAllPromises().then(() => {
				expect(fetchMock.calls().matched.length).toEqual(1);
			});

		});

		it("Should dispatch REPORT_TYPES_RECEIVED on successful get", () => {
			const store = mockStore(initialState);

			const expectedActions = [{
				type: t.REPORT_TYPES_RECEIVED,
				payload: {}
			}];

			store.dispatch(actions.discoverReportTypes());
			return flushAllPromises().then(() => {
				expect(store.getActions()).toEqual(expectedActions);
			});
		});
	});
});