import {
	restClient
} from "client-app-core";

import * as t from "../actionTypes";


export const toggleGeneratingPdf = () => {
	return {
		type: t.TOGGLE_GENERATING_PDF
	};
};

export const exportError = (err) => {
	return {
		type: t.EXPORT_ERROR,
		error: new Error(err ? err.message ? err.message : err : "There was an error processing your request.")
	};
};

export const generatePDFExport = (assignmentId, vesselName, berthName, exportTime) => {
	return async (dispatch) => {
		dispatch(toggleGeneratingPdf());

		restClient.exec_get(
			`/berth-schedule-app/api/berthAssignments/export/${assignmentId}`,
			(err, response) => {
				dispatch(toggleGeneratingPdf());
				if (err) {
					dispatch(exportError(err));
				} else {
					if (!response.ok) {
						const error = response.message;
						if (error && error.toLowerCase() === "request timeout") {
							dispatch(exportError("There was a timeout while generating your report."));
						} else {
							dispatch(exportError(error));
						}
					} else {
						const pdf = response.data;

						// -- make names filename-friendly
						const fileVesselName = vesselName.replaceAll(/[/\\?%*:|"<>]/g, "").replaceAll(" ", "-");
						const fileBerthName = berthName ? `${berthName.replaceAll(/[/\\?%*:|"<>]/g, "").replaceAll(" ", "-")}_` : "";
						const timeString = exportTime.toISOString().split(".")[0].replaceAll(":", "-");
						const fileTitle = `Berth-Assignment_${fileVesselName}_${fileBerthName}${timeString}`;

						const exportedFilename = fileTitle + ".pdf" || "assignment.pdf";
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
			}
		);
	};
};