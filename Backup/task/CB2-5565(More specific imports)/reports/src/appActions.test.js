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
const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

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
