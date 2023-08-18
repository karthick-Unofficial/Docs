import * as t from "../actionTypes";
import * as reportBuilderActions from "../ReportBuilder/reportBuilderActions";

import {
	default as reducer,
	initialState as seedState
} from "./reportViewer.js";

describe("reports reducer", () => {

	it("should initialize with expected initial state", () => {
		expect(reducer(undefined, {})).toEqual(seedState);
	});

	describe("Should handle WIPE_REPORTS", () => {
		it("Should correctly reset reports to initial state", () => {

			const action = reportBuilderActions.wipeReports();
			const initialState = { ...seedState,
				reports: [{
					"name": "Report 1"
				}, {
					"name": "Report 2"
				}]
			};
			const expectedState = { ...seedState,
				reports: [...seedState.reports]
			};
			expect(reducer(initialState, action)).toEqual(
				expectedState
			);
		});

		it("Should not change reports if already empty", () => {


			const action = reportBuilderActions.wipeReports();
			const initialState = { ...seedState,
				reports: []
			};
			const expectedState = { ...seedState,
				reports: [...seedState.reports]
			};
			expect(reducer(initialState, action)).toEqual(
				expectedState
			);
		});

	});
});