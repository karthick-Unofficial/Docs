import * as t from "../actionTypes";
import * as appActions from "../appActions";
import * as reportBuilderActions from "../ReportBuilder/reportBuilderActions";

import { default as reducer, initialState as seedState } from "./reportBuilder";

describe("appState reducer", () => {
	it("should initialize with expected initial state", () => {
		expect(reducer(undefined, {})).toEqual(seedState);
	});

	describe("Should handle SUBMITTING_REPORT", () => {
		it("Should correctly change isSubmitting to true from false", () => {
			const action = reportBuilderActions.submittingReport();
			const initialState = { ...seedState, isSubmitting: false };
			const expectedState = { ...seedState, isSubmitting: true };
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isSubmitting if already true", () => {
			const action = reportBuilderActions.submittingReport();
			const initialState = { ...seedState, isSubmitting: true };
			const expectedState = { ...seedState, isSubmitting: true };
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle REPORT_DATA_RECEIVED", () => {
		it("Should correctly change isSubmitting to false from true", () => {
			const action = reportBuilderActions.reportDataReceived();
			const initialState = { ...seedState, isSubmitting: true };
			const expectedState = { ...seedState, isSubmitting: false };
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isSubmitting if already false", () => {
			const action = reportBuilderActions.reportDataReceived();
			const initialState = { ...seedState, isSubmitting: false };
			const expectedState = { ...seedState, isSubmitting: false };
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle WIPE_REPORTS", () => {
		it("Should correctly change isSubmitting to false from true", () => {
			const action = reportBuilderActions.wipeReports();
			const initialState = { ...seedState, isSubmitting: true };
			const expectedState = { ...seedState, isSubmitting: false };
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isSubmitting if already false", () => {
			const action = reportBuilderActions.wipeReports();
			const initialState = { ...seedState, isSubmitting: false };
			const expectedState = { ...seedState, isSubmitting: false };
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle OPEN_REQUEST_DIALOG", () => {
		it("Should correctly change isOpen to false from true", () => {
			const action = reportBuilderActions.openRequestDialogSuccess();
			const initialState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, isOpen: false }
			};
			const expectedState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, isOpen: true }
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isOpen if already true", () => {
			const action = reportBuilderActions.openRequestDialogSuccess();
			const initialState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, isOpen: true }
			};
			const expectedState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, isOpen: true }
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle CLOSE_REQUEST_DIALOG", () => {
		it("Should correctly change isOpen to true to false", () => {
			const action = reportBuilderActions.closeRequestDialogSuccess();
			const initialState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, isOpen: true }
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isOpen: false,
					toast: false
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isOpen if already false", () => {
			const action = reportBuilderActions.closeRequestDialogSuccess();
			const initialState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, isOpen: false }
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isOpen: false,
					toast: false
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle REQUEST_DIALOG_IS_SUBMITTING", () => {
		it("Should correctly change isSubmitting to false to true", () => {
			const action = reportBuilderActions.requestDialogIsSubmitting();
			const initialState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: false
				}
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: true
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isSubmitting if already false", () => {
			const action = reportBuilderActions.requestDialogIsSubmitting();
			const initialState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: true
				}
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: true
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle REQUEST_DIALOG_SUBMIT_SUCCESS", () => {
		it("Should correctly change isSubmitting to true to false", () => {
			const action = reportBuilderActions.requestDialogSubmitSuccess();
			const initialState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: true
				}
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: false,
					toast: true
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});

		it("Should not change isSubmitting if already false", () => {
			const action = reportBuilderActions.requestDialogSubmitSuccess();
			const initialState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: false
				}
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					isSubmitting: false,
					toast: true
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});

	describe("Should handle REQUEST_DIALOG_SUBMIT_ERROR", () => {
		it("Should correctly set error", () => {
			const error = new Error({
				message: "Bad Request"
			});

			const action = reportBuilderActions.requestDialogSubmitError(error);
			const initialState = {
				...seedState,
				requestDialog: { ...seedState.requestDialog, error: null }
			};
			const expectedState = {
				...seedState,
				requestDialog: {
					...seedState.requestDialog,
					error: new Error("There was an error processing your request.")
				}
			};
			expect(reducer(initialState, action)).toEqual(expectedState);
		});
	});
});
