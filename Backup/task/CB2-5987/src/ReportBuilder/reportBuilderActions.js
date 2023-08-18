import { restClient } from "client-app-core";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";

import * as t from "../actionTypes";

export const reportDataReceived = (payload) => {
	return {
		type: t.REPORT_DATA_RECEIVED,
		payload: payload
	};
};

export const builderError = (err) => {
	const errorMessage = err ? (err.message ? err.message : err) : "";
	return {
		type: t.BUILDER_ERROR,
		error: errorMessage !== "" ? new Error(errorMessage) : "There was an error processing your request."
	};
};

export const nextPage = () => {
	return {
		type: t.NEXT_PAGE
	};
};

export const requestingNextPage = () => {
	return {
		type: t.REQUESTING_NEXT_PAGE
	};
};

export const pageReceived = (payload) => {
	return {
		type: t.PAGE_RECEIVED,
		payload: payload
	};
};

export const submittingReport = () => {
	return {
		type: t.SUBMITTING_REPORT
	};
};

export const wipeAllFieldData = () => {
	return {
		type: t.WIPE_ALL_FIELD_DATA
	};
};

export const wipeReports = () => {
	return {
		type: t.WIPE_REPORTS
	};
};

export const submitReport = (type, data) => {
	return (dispatch) => {
		dispatch(wipeReports());
		dispatch(submittingReport());
		const body = {
			...data,
			paginate: true
		};

		restClient.exec_post(`/reports-app/api/${type}/generate`, JSON.stringify(body), (err, res) => {
			if (err) {
				dispatch(builderError(err));
			} else {
				if (!res.ok) {
					const error = res.message;
					if (error && error.toLowerCase() === "request timeout") {
						dispatch(
							builderError(
								"There was a timeout while generating your report. The service will now attempt to send the report via email."
							)
						);
					} else {
						dispatch(builderError(error));
					}
				} else {
					dispatch(reportDataReceived(res.data));
				}
			}
		});
	};
};

export const requestNextPage = (type, data) => {
	return (dispatch) => {
		dispatch(requestingNextPage());
		const body = {
			...data,
			paginate: true
		};
		restClient.exec_post(`/reports-app/api/${type}/generate`, JSON.stringify(body), (err, res) => {
			if (err) {
				dispatch(builderError());
				console.log(err);
			} else {
				if ("ok" in res) {
					if (!res.ok) {
						const error = res.message;
						if (error && error.toLowerCase() === "request timeout") {
							dispatch(
								builderError(
									"There was a timeout while generating your report. The service will now attempt to send the report via email."
								)
							);
						} else {
							dispatch(builderError(error));
						}
					} else if ("data" in res) {
						dispatch(pageReceived(res.data));
					} else {
						dispatch(builderError());
					}
				} else {
					dispatch(builderError());
				}
			}
		});
	};
};

export const previousPage = () => {
	return {
		type: t.PREVIOUS_PAGE
	};
};

export const openPDFRequestDialogSuccess = () => {
	return {
		type: t.OPEN_PDF_REQUEST_DIALOG
	};
};

export const openPDFRequestDialog = () => {
	return (dispatch) => {
		dispatch(openPDFRequestDialogSuccess());
		dispatch(openDialog("pdf-request-dialog"));
	};
};

export const openRequestDialogSuccess = () => {
	return {
		type: t.OPEN_REQUEST_DIALOG
	};
};

export const openRequestDialog = () => {
	return (dispatch) => {
		dispatch(openRequestDialogSuccess());
		dispatch(openDialog("request-dialog"));
	};
};

export const closeRequestDialogSuccess = () => {
	return {
		type: t.CLOSE_REQUEST_DIALOG
	};
};

export const closeRequestDialog = () => {
	return (dispatch) => {
		dispatch(closeRequestDialogSuccess());
		dispatch(closeDialog("request-dialog"));
	};
};

export const closePDFRequestDialogSuccess = () => {
	return {
		type: t.CLOSE_PDF_REQUEST_DIALOG
	};
};

export const closePDFRequestDialog = () => {
	return (dispatch) => {
		dispatch(closePDFRequestDialogSuccess());
		dispatch(closeDialog("pdf-request-dialog"));
	};
};

export const requestDialogSubmitSuccess = () => {
	return {
		type: t.REQUEST_DIALOG_SUBMIT_SUCCESS
	};
};

export const requestPDFDialogSubmitSuccess = () => {
	return {
		type: t.PDF_REQUEST_DIALOG_SUBMIT_SUCCESS
	};
};

export const fieldDataReceived = (name, data) => {
	return {
		type: t.FIELD_DATA_RECEIVED,
		payload: {
			name: name,
			data: data
		}
	};
};

export const fetchFieldData = (name, endpoint) => {
	return (dispatch) => {
		restClient.exec_get("/" + endpoint, (err, res) => {
			if (err) {
				dispatch(builderError(err));
			} else {
				dispatch(fieldDataReceived(name, res));
			}
		});
	};
};

export const wipeFieldData = (name) => {
	return {
		type: t.WIPE_FIELD_DATA,
		payload: {
			name: name
		}
	};
};
export const toggleGeneratingFile = () => {
	return {
		type: t.TOGGLE_GENERATING_PDF
	};
};

export const generatePDFExport = (type, data) => {
	return async (dispatch, getState) => {
		dispatch(toggleGeneratingFile());
		const timeFormatPreference = getState().appState.global.timeFormat;
		data.timeFormatPreference = timeFormatPreference ? timeFormatPreference : "12-hour";
		restClient.exec_post(`/reports-app/api/${type}/export-pdf`, JSON.stringify(data), (err, response) => {
			dispatch(toggleGeneratingFile());
			if (err) {
				dispatch(builderError(err));
			} else {
				if (!response.ok) {
					const error = response.message;
					if (error && error.toLowerCase() === "request timeout") {
						dispatch(
							builderError(
								"There was a timeout while generating your report. The service will now attempt to send the report via email."
							)
						);
					} else {
						dispatch(builderError(error));
					}
				} else {
					const pdf = response.data;
					const fileTitle = data.eventName ? data.eventName : `${type}`;

					const exportedFilename = fileTitle + ".pdf" || "sitrep.pdf";
					const buffer = new Uint8Array(pdf.data);
					const blob = new Blob([buffer], {
						type: "application/pdf"
					});
					if (navigator.msSaveBlob) {
						// IE 10+
						navigator.msSaveBlob(blob, exportedFilename);
					} else {
						const link = document.createElement("a");
						if (link.download !== undefined) {
							// feature detection
							// Browsers that support HTML5 download attribute
							const url = URL.createObjectURL(blob);
							link.setAttribute("href", url);
							link.setAttribute("download", exportedFilename);
							link.style.visibility = "hidden";
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						}
					}
				}
			}
		});
	};
};

export const generateCSVExport = (type, data) => {
	return async (dispatch, getState) => {
		// Request full report
		dispatch(toggleGeneratingFile());
		const timeFormatPreference = getState().appState.global.timeFormat;
		data.timeFormatPreference = timeFormatPreference ? timeFormatPreference : "12-hour";
		restClient.exec_post(`/reports-app/api/${type}/export`, JSON.stringify(data), (err, response) => {
			dispatch(toggleGeneratingFile());
			if (err) {
				dispatch(builderError(err));
			} else {
				if (!response.ok) {
					const error = response.message;
					if (error.toLowerCase() === "request timeout") {
						dispatch(
							builderError(
								"There was a timeout while generating your report. The service will now attempt to send the report via email."
							)
						);
					} else {
						dispatch(builderError(error));
					}
				} else {
					const csv = response.CSV;

					const fileTitle = type;

					const exportedFilename = fileTitle + ".csv" || "export.csv";

					const blob = new Blob([csv], {
						type: "text/csv;charset=utf-8;"
					});
					if (navigator.msSaveBlob) {
						// IE 10+
						navigator.msSaveBlob(blob, exportedFilename);
					} else {
						const link = document.createElement("a");
						if (link.download !== undefined) {
							// feature detection
							// Browsers that support HTML5 download attribute
							const url = URL.createObjectURL(blob);
							link.setAttribute("href", url);
							link.setAttribute("download", exportedFilename);
							link.style.visibility = "hidden";
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						}
					}
				}
			}
		});
	};
};

export const requestDialogIsSubmitting = () => {
	return {
		type: t.REQUEST_DIALOG_IS_SUBMITTING
	};
};

export const requestDialogSubmitError = () => {
	return {
		type: t.REQUEST_DIALOG_SUBMIT_ERROR,
		payload: new Error("There was an error processing your request."),
		error: true
	};
};

export const requestPDFDialogIsSubmitting = () => {
	return {
		type: t.PDF_REQUEST_DIALOG_IS_SUBMITTING
	};
};

export const requestPDFDialogSubmitError = () => {
	return {
		type: t.PDF_REQUEST_DIALOG_SUBMIT_ERROR,
		payload: new Error("There was an error processing your request."),
		error: true
	};
};

export const requestCSVEmail = (type, data) => {
	return async (dispatch, getState) => {
		// Request full report
		dispatch(requestDialogIsSubmitting());
		const timeFormatPreference = getState().appState.global.timeFormat;
		data.timeFormatPreference = timeFormatPreference ? timeFormatPreference : "12-hour";
		restClient.exec_post(`/reports-app/api/${type}/email`, JSON.stringify(data), (err, response) => {
			if (err) {
				console.log(err);
				dispatch(requestDialogSubmitError(err));
			} else {
				console.log("Request done!");
				setTimeout(() => dispatch(requestDialogSubmitSuccess()), 4000);
				setTimeout(() => dispatch(closeRequestDialog()), 5000);
			}
		});
	};
};

export const requestPDFEmail = (type, data) => {
	return async (dispatch, getState) => {
		// Request full report
		dispatch(requestPDFDialogIsSubmitting());
		const timeFormatPreference = getState().appState.global.timeFormat;
		data.timeFormatPreference = timeFormatPreference ? timeFormatPreference : "12-hour";
		restClient.exec_post(`/reports-app/api/${type}/pdf-email`, JSON.stringify(data), (err, response) => {
			if (err) {
				console.log(err);
				dispatch(requestPDFDialogSubmitError(err));
			} else {
				console.log("Request done!");
				dispatch(requestPDFDialogSubmitSuccess());
				setTimeout(() => dispatch(closePDFRequestDialog()), 2500);
			}
		});
	};
};
