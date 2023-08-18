import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
	wipeReports, generateCSVExport, generatePDFExport, requestCSVEmail,
	requestPDFEmail, submitReport, fieldDataReceived, fetchFieldData, wipeFieldData,
	nextPage, previousPage
}
	from "./reportBuilderActions";
import { Translate, getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";
// Components
import Field from "./components/Field";
import Report from "./Report/Report";
import MultiReport from "./MultiReport/MultiReport";

// Material UI
import { Button } from "@mui/material";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";


import moment from "moment";

const ReportBuilder = (props) => {
	//const id = state.routing.locationBeforeTransitions.state ? state.routing.locationBeforeTransitions.state.id : "sitrep";
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const stateRef = useRef({
		values: {}
	});
	const [submitted, setSubmitted] = useState(false);
	const [submittedFields, setSubmittedFields] = useState(false);
	const [creationTime, setCreationTime] = useState("");
	const [errorMessage, setErrorMessage] = useState({
		time: "",
		data: ""
	});
	const location = useLocation();
	const id = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	const user = useSelector((state) => state.session.user.profile);
	const userApps = user.applications;
	let eventsEnabled = false;

	userApps.forEach(app => {
		if (app.appId === "events-app") eventsEnabled = true;
	});


	const search = new URLSearchParams(location.search.slice(1));
	const eventId = search.get("eventId");
	const eventName = search.get("event");
	const reportTypes = useSelector((state) => state.globalData.reportTypes);
	let report = Object.values(reportTypes).filter(type => {
		return id === type.id;
	});

	report = report[0] ? report[0] : null;

	const fieldData = useSelector((state) => state.appState.reportBuilder.fieldData);
	const page = useSelector((state) => state.appState.reportViewer.page);
	const isGenerated = useSelector((state) => state.appState.reportViewer.pages[0] ? true : false);
	const isSubmitting = useSelector((state) => state.appState.reportBuilder.isSubmitting);
	const error = useSelector((state) => state.appState.reportBuilder.error);
	const isSubmittingEmailRequest = useSelector((state) => state.appState.reportBuilder.requestDialog.isSubmitting);
	const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const locale = useSelector((state) => state.i18n.locale);
	const dir = useSelector((state) => getDir(state));

	useEffect(() => {
		dispatch(wipeReports());

		if (eventId && eventName && report) {
			let values;
			report.fields.forEach(field => {
				values = getValues(field.name, [{ id: eventId, name: eventName }]);
			});
			handleSubmit("", values);
		}
	}, [report, reportTypes]);

	const handleExport = () => {
		dispatch(generateCSVExport(report.id, submittedFields));
	};

	const handlePDFExport = (reportData) => {
		if (submittedFields) {
			reportData = { ...reportData, ...submittedFields };
		}
		dispatch(generatePDFExport(report.id, reportData, submittedFields));
	};

	const handleExportEmailRequest = (r, valuesParam, reportParam) => {
		const rpt = reportParam ? reportParam : report;
		const vals = valuesParam ? valuesParam : stateRef.current.values;
		const data = submissionCheck(vals, rpt);
		if (data) {
			dispatch(requestCSVEmail(rpt.id, data));
		} else {
			return;
		}

	};

	const handlePDFExportEmailRequest = reportData => {
		if (submittedFields) {
			reportData = { ...reportData, ...submittedFields };
		}
		dispatch(requestPDFEmail(report.id, reportData, submittedFields));
	};

	const handleSubmit = (r, valuesParam, reportParam) => {
		const rpt = reportParam ? reportParam : report;
		const vals = valuesParam ? valuesParam : stateRef.current.values;
		const data = submissionCheck(vals, rpt);
		if (data) {
			dispatch(submitReport(rpt.id, data));
		} else {
			return;
		}

	};

	const submissionCheck = (values, report) => {

		// Set maxDate to current date
		const maxDate = new Date();
		const minDate = new Date();
		const newErrorMessage = {};
		let timeError = "";
		let fieldErrors = false;
		const fieldNames = [];
		report.fields.forEach(field => {
			fieldNames.push(field.name || "");
		});

		// Set default date range to 1 month
		minDate.setMonth(minDate.getMonth() - 1);

		// Set default date range if none is provided
		if (!values.startDate && fieldNames.includes("startDate")) {
			values.startDate = minDate;
		}

		if (!values.endDate && fieldNames.includes("endDate")) {
			values.endDate = maxDate;
		}

		// Check for valid date range
		if (Date.parse(values.startDate) > Date.parse(values.endDate)) {
			timeError = getTranslation("reportBuilder.reportBuilders.validTimeRange");
		}

		// Check that all fields have been completed
		if (report.fields.length !== Object.keys(values).length) {
			report.fields.forEach(field => {
				const name = field.name;
				newErrorMessage[name] = {
					data: !values[field.name] || !values[field.name].toString()[0] ? getTranslation("reportBuilder.reportBuilders.compelteAllFields") : ""
				};
			});
		}

		// Check that all fields have a valid value
		for (const value in values) {
			newErrorMessage[value] = {
				data: !values[value] || !values[value].toString()[0] ? getTranslation("reportBuilder.reportBuilders.compelteAllFields") : ""
			};
		}

		for (const field in newErrorMessage) {
			if (newErrorMessage[field].data) {
				fieldErrors = true;
			}
		}

		// Update all errors at once
		if (fieldErrors || timeError) {
			setErrorMessage({
				...errorMessage,
				time: timeError,
				...newErrorMessage
			});
			return false;
		} else {
			setErrorMessage({
				...errorMessage,
				time: timeError,
				...newErrorMessage
			});
		}


		const data = { id: report.id, fields: values };

		setSubmitted(true);
		setSubmittedFields(data);
		setCreationTime(moment.utc());
		setErrorMessage({ time: "", data: "" });

		return data;
	};

	const getValues = (field, values, wipeCheck) => {
		// const newValues = Object.assign({}, values);
		// newValues[field] = values;
		stateRef.current.values[field] = values;
		// setValues({ ...newValues });
		if (wipeCheck) {
			dispatch(fieldDataReceived(field, values));
		}
		//const returnValues = { ...newValues };
		return stateRef.current.values;
	};

	const redirect = (url) => {
		navigate(url);
	};

	const reportType = report ? Object.keys(report.type) : ["table"];
	const downloadOnly = report ? report.downloadOnly : false;

	/** 
		 * TODO: Develop a system for redirecting away from reports a user shouldn't have access to without hardcoding or ids
		 * Idea -- Keep up to date app access in state --> use data to keep up to date report access in state
		 * */
	// Prevent event sitrep loading if events app is disabled. Prevents user from using URL to navigate to report they shouldn't have.
	if (report && report.category === "event-report" && !eventsEnabled) {
		redirect("/reports");
	}

	return (
		<div className="rb-wrapper" style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`, "overflow": "scroll" }}>
			<div className="rb-field-wrapper">
				{report &&
					report.fields.map(field => {
						return (
							<Field
								key={field.name}
								values={eventId ? [{ value: eventId, label: eventName }] : stateRef.current.values}
								field={field}
								sendValues={(field, values, wipeCheck) => getValues(field, values, wipeCheck)}
								dispatch={dispatch}
								fetchFieldData={fetchFieldData}
								wipeFieldData={wipeFieldData}
								fieldData={fieldData[field.name]}
								errorMessage={errorMessage}
								timeFormatPreference={timeFormatPreference}
								locale={locale}
								checkPosition={dir === "rtl" ? "right" : "left"}
								dir={dir}
							/>
						);
					})}
				<div className="rb-submit-button">
					<Button
						disabled={downloadOnly ? isSubmittingEmailRequest ? true : false : false}
						style={{ color: "#ffffff", backgroundColor: "#4eb5f3" }}
						onClick={downloadOnly ? handleExportEmailRequest : handleSubmit}
					>
						{downloadOnly ? <Translate value="reportBuilder.reportBuilders.requestCsv" /> : getTranslation("reportBuilder.reportBuilders.submit")}
					</Button>
				</div>
			</div>
			{error &&
				<span className="cb-font-b2 error-text">{error.message}</span>
			}
			{isSubmitting ? (
				<div className="rb-report-wrapper">
					<div className="rb-default-message">
						<Translate value="reportBuilder.reportBuilders.loading" />
					</div>
				</div>
			) : isGenerated ?
				reportType[0] === "table" ? (
					<div>
						<div className="rb-report-wrapper">
							<ErrorBoundary>
								<Report
									reportData={report}
									nextPage={nextPage}
									prevPage={previousPage}
									handleExport={handleExport}
									time={creationTime}
									handlePDFExport={handlePDFExport}
									handleExportEmailRequest={handleExportEmailRequest}
									handlePDFExportEmailRequest={handlePDFExportEmailRequest} />

							</ErrorBoundary>
						</div>
					</div>
				) : (
					<div>
						<div className="rb-multi-report-wrapper">
							<ErrorBoundary>
								<MultiReport
									eventName={stateRef.current.values.events ? stateRef.current.values.events[0].name : ""}
									time={creationTime}
									report={report}
									handlePDFExport={handlePDFExport}
									nextPage={nextPage}
									prevPage={previousPage}
									handleExport={handleExport}
									handleExportEmailRequest={handleExportEmailRequest} />
							</ErrorBoundary>
						</div>
					</div>
				)
				: (
					<div className="rb-default-message">
						{downloadOnly ?
							isSubmittingEmailRequest ?
								<Translate value="reportBuilder.reportBuilders.submitMessage" />
								:
								<Translate value="reportBuilder.reportBuilders.requestMessage" />
							:
							<Translate value="reportBuilder.reportBuilders.submitQuery" />
						}
					</div>
				)}
		</div>
	);
};

export default ReportBuilder;