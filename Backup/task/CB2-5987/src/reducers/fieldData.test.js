import * as t from "../actionTypes";
import * as reportBuilderActions from "../ReportBuilder/reportBuilderActions";

import { default as reducer, initialState as seedState } from "./reportBuilder";

describe("fieldData reducer", () => {
	it("should initialize with expected initial state", () => {
		expect(reducer(undefined, {})).toEqual(seedState);
	});

	describe("Should handle WIPE_FIELD_DATA", () => {
		it("Should correctly empty corresponding fieldData", () => {
			const action = reportBuilderActions.wipeFieldData("text");
			const initialState = {
				...seedState,
				fieldData: {
					text: [{}, {}, {}]
				}
			};
			const expectedState = {
				...seedState,
				fieldData: {
					text: []
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change fieldData if already empty", () => {
			const action = reportBuilderActions.wipeFieldData("text");
			const initialState = {
				...seedState,
				fieldData: {
					text: []
				}
			};
			const expectedState = {
				...seedState,
				fieldData: {
					text: []
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change other properties on fieldData", () => {
			const action = reportBuilderActions.wipeFieldData("text");
			const initialState = {
				...seedState,
				fieldData: {
					text: [123],
					other: [21],
					thing: [23]
				}
			};
			const expectedState = {
				...seedState,
				fieldData: {
					text: [],
					other: [21],
					thing: [23]
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});
});
