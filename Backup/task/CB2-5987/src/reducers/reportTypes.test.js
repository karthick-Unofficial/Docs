import * as t from "../actionTypes";
import * as appActions from "../appActions";

import { default as reducer, initialState as seedState } from "./reportTypes.js";

describe("reportTypes reducer", () => {
	const reports = {
		"health-report": {
			app: "health-app"
		},
		"zone-report": {
			app: "shapes-app"
		}
	};

	const singleReport = {
		"user-report": {
			app: "health-app"
		}
	};

	it("should initialize with expected initial state", () => {
		expect(reducer(undefined, {})).toEqual(seedState);
	});

	describe("Should handle reportTypesReceived", () => {
		it("Should add incoming reports correctly to empty reporttypes state", () => {
			const action = appActions.reportTypesReceived(reports);
			const initialState = { ...seedState };
			const expectedState = { ...seedState, reports: reports };
			expect(reducer(initialState, action).isHydrated).toEqual(expectedState.isHydrated);
		});

		it("Should add incoming reports correctly to empty reporttypes state", () => {
			const action = appActions.reportTypesReceived(singleReport);
			const initialState = { ...seedState, ...reports };
			const expectedState = {
				"health-report": {
					app: "health-app"
				},
				"zone-report": {
					app: "shapes-app"
				},
				"user-report": {
					app: "health-app"
				}
			};

			expect(reducer(initialState, action).isHydrated).toEqual(expectedState.isHydrated);
		});
	});
});
