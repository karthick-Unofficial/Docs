import React, { Fragment, useState } from "react";
import { Translate, getTranslation } from "orion-components/i18n";
// Material Ui
import {
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	DialogTitle,
	DialogContent,
	DialogActions,
	Paper,
	Button,
	Dialog,
	CircularProgress
} from "@mui/material";
import { FileDownload } from "@mui/icons-material";

import { UserTime } from "orion-components/SharedComponents";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDir } from "orion-components/i18n/Config/selector";


import {
	requestNextPage, openRequestDialog,
	openPDFRequestDialog, closeRequestDialog,
	closePDFRequestDialog
} from "../reportBuilderActions";


const Report = ({
	reportData,
	nextPage,
	prevPage,
	time,
	handlePDFExportEmailRequest,
	handleExport,
	handlePDFExport,
	handleExportEmailRequest
}) => {


	const [scrollId, setScrollId] = useState(null);
	const [totalPages, setTotalPages] = useState(null);

	const dispatch = useDispatch();

	const report = useSelector(state => state.appState.reportViewer.reports.filter(report => {
		return report.type === reportData.id;
	}));
	const pagesLoaded = useSelector(state => state.appState.reportViewer.pagesLoaded);
	const isPaginating = useSelector(state => state.appState.reportViewer.isPaginating);
	const isGeneratingFile = useSelector(state => state.appState.reportViewer.isGeneratingFile);
	const pages = useSelector(state => state.appState.reportViewer.pages);
	const currentPage = useSelector(state => state.appState.reportViewer.page);
	const isOpen = useSelector(state => state.appState.dialog.openDialog === "request-dialog");
	const pdfIsOpen = useSelector(state => state.appState.dialog.openDialog === "pdf-request-dialog");
	const page = useSelector(state => state.appState.reportViewer.pages[state.appState.reportViewer.page - 1]);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const groups = page ? useSelector(state => state.appState.reportViewer.pages[state.appState.reportViewer.page - 1].groups) : [];
	const requestDialogOpen = useSelector(state => state.appState.reportBuilder.requestDialog.isOpen);
	const requestDialogSubmitting = useSelector(state => state.appState.reportBuilder.requestDialog.isSubmitting);
	const requestDialogError = useSelector(state => state.appState.reportBuilder.requestDialog.error);
	const requestDialogToast = useSelector(state => state.appState.reportBuilder.requestDialog.toast);
	const pdfRequestDialogToast = useSelector(state => state.appState.reportBuilder.pdfRequestDialog.toast);
	const pdfRequestDialogOpen = useSelector(state => state.appState.reportBuilder.pdfRequestDialog.isOpen);
	const pdfRequestDialogSubmitting = useSelector(state => state.appState.reportBuilder.pdfRequestDialog.isSubmitting);
	const pdfRequestDialogError = useSelector(state => state.appState.reportBuilder.pdfRequestDialog.error);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));

	const { columns } = reportData.type.table;

	const styles = {
		groupRendererTableCell: {
			fontWeight: "bold",
			height: "auto",
			padding: "10px 24px",
			fontSize: "13px",
			backgroundColor: "#fff",
			...(dir === "rtl" && { textAlign: "right" })
		},
		textRightAlign: {
			textAlign: "right"
		},
		rowRendererTableCell: {
			whiteSpace: "initial",
			padding: "10px 24px",
			fontSize: "13px",
			backgroundColor: "#fff",
			...(dir === "rtl" && { textAlign: "right" })
		},
		reportDataWrapperTableCell: {
			padding: "10px 24px", fontSize: "12px",
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	useEffect(() => {
		if (report) {
			setScrollId(report[0].scrollId);
			setTotalPages(report[0].pages);
		}
	}, [report]);

	const NextPage = () => {
		const body = { scrollId };
		if (isPaginating) {
			return;
		}
		if (currentPage === pagesLoaded) {
			dispatch(requestNextPage(reportData.id, body));
		} else {
			dispatch(nextPage());
		}
	};

	const previousPage = () => {
		if (currentPage > 1) {
			dispatch(prevPage());
		}
	};

	const PDFExport = () => {
		const reportData = {
			creationTime: time,
			columns: columns,
			...report
		};
		handlePDFExport(reportData);
	};

	const handlePDFEmailRequest = () => {
		const reportData = {
			creationTime: time,
			columns: columns,
			...report
		};
		handlePDFExportEmailRequest(reportData);
	};

	const groupRenderer = group => {
		return (
			<TableRow
				selectable={false}
				style={{
					paddingBottom: 0,
					marginTop: "1rem",
					height: "auto"
				}}
			>
				<TableCell
					colSpan={
						columns.length +
						columns.filter(a => a.property === "timestamp").length
					}
					style={styles.groupRendererTableCell}
				>
					{group.name}
				</TableCell>
			</TableRow>
		);
	};

	const rowRenderer = (row, index) => {
		const timeFormat = timeFormatPreference ? `full_${timeFormatPreference}` : "full_12-hour";
		return (
			<TableRow selectable={false} key={index}>
				{columns.map((column, index) => {
					const prop = column.property;
					let td;
					if (prop === "timestamp" || prop === "entered") {
						td = (
							<TableCell colSpan={column.width} key={index} style={styles.textRightAlign}>
								<UserTime time={row[prop]} format={timeFormat} />
							</TableCell>
						);
					} else {
						td = (
							<TableCell
								colSpan={column.width}
								key={index}
								style={styles.rowRendererTableCell}
							>
								{row[prop]}
							</TableCell>
						);
					}
					return td;
				})}
			</TableRow>
		);
	};

	const localizeDisplayName = (name) => {
		switch (name) {
			case "Dwell Duration":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.dwellDuration");
			case "Entry Time":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.entryTime");
			case "Callsign":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.callSign");
			case "IMO":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.imo");
			case "MMSID":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.mmsid");
			case "Vessel Name":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.vesselName");
			case "Position Date/Time":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.positionDateTime");
			case "Speed":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.speed");
			case "Heading":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.heading");
			case "Course":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.course");
			case "Latitude":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.latitude");
			case "Longitude":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.longitude");
			case "Event":
				return getTranslation("reportBuilder.reportBuilder_reports.report.displayName.event");
			default:
				return name;
		}
	};

	const submitButton = requestDialogSubmitting ? (
		<div
			style={{
				float: "right",
				padding: "0 18px"
			}}
		>
			<CircularProgress size={30} />
		</div>
	) : (
		<Button
			color="primary"
			onClick={handleExportEmailRequest}
		>
			{getTranslation("reportBuilder.reportBuilder_reports.report.request")}
		</Button>
	);

	const actions = requestDialogToast // If we've already completed submit
		? [
			<Button
				color="primary"
				onClick={() => dispatch(closeRequestDialog())}>
				{getTranslation("reportBuilder.reportBuilder_reports.report.close")}
			</Button>,
			null
		]
		: [
			<Button
				primary={true}
				onClick={() => dispatch(closeRequestDialog())}
				color="primary"
			>
				{getTranslation("reportBuilder.reportBuilder_reports.report.cancel")}
			</Button>,
			submitButton
		];

	const pdfSubmitButton = pdfRequestDialogSubmitting ? (
		<div
			style={{
				float: "right",
				padding: "0 18px"
			}}
		>
			<CircularProgress size={30} />
		</div>
	) : (
		<Button
			color="primary"
			onClick={handlePDFEmailRequest}
		>
			{getTranslation("reportBuilder.reportBuilder_reports.report.request")}
		</Button>
	);

	const pdfActions = pdfRequestDialogToast // If we've already completed submit
		? [
			<Button
				color="primary"
				onClick={() => dispatch(closePDFRequestDialog())}
			>
				{getTranslation("reportBuilder.reportBuilder_reports.report.close")}
			</Button>,
			null
		]
		: [
			<Button
				color="primary"
				onClick={() => dispatch(closePDFRequestDialog())}
			>
				{getTranslation("reportBuilder.reportBuilder_reports.report.cancel")}
			</Button>,
			pdfSubmitButton
		];
	return (
		<div>
			{totalPages !== 0 && (
				<div>
					{totalPages !== 0 && (
						<div className="report-export-button">
							{totalPages > 20 ? (
								<div>
									<Button
										style={{
											marginRight: 10,
											color: "#ffffff",
											backgroundColor: "#4eb5f3"
										}}
										onClick={() => dispatch(openRequestDialog())}

									>
										<FileDownload />{getTranslation("reportBuilder.reportBuilder_reports.report.requestCsv")}
									</Button>
									<Button
										onClick={() => dispatch(openPDFRequestDialog())}
										style={{
											color: "#ffffff",
											backgroundColor: "#4eb5f3"
										}}
									>
										<FileDownload />{getTranslation("reportBuilder.reportBuilder_reports.report.requestPdf")}
									</Button>
								</div>
							) : (

								<div>
									{!isGeneratingFile ? (
										<Fragment>
											<Button
												style={{
													marginRight: 10,
													backgroundColor: "#4eb5f3",
													color: "#ffffff"
												}}
												onClick={() => handleExport()}
												color="primary"
											>
												<FileDownload />{getTranslation("reportBuilder.reportBuilder_reports.report.downloadCsv")}
											</Button>
											<Button
												onClick={PDFExport}
												style={{ color: "#ffffff", backgroundColor: "#4eb5f3" }}
												color="primary"
											>
												<FileDownload />{getTranslation("reportBuilder.reportBuilder_reports.report.downloadPdf")}
											</Button>
										</Fragment>
									)
										:
										<CircularProgress size={30} />
									}
								</div>
							)}
						</div>
					)}
				</div>
			)}
			{totalPages > 0 ? (
				<div className="navigator">
					{currentPage > 1 && (
						// eslint-disable-next-line jsx-a11y/anchor-is-valid
						<a onClick={previousPage}> {"<"} </a>
					)}
					<p>
						{currentPage} / {totalPages}
					</p>
					{currentPage < totalPages && (
						// eslint-disable-next-line jsx-a11y/anchor-is-valid
						<a
							style={{ opacity: isPaginating ? 0.2 : 1 }}
							onClick={NextPage}
						>
							{" "}
							{">"}{" "}
						</a>
					)}
				</div>
			) : (
				<div className="navigator">
					<p><Translate value="reportBuilder.reportBuilder_reports.report.noResult" /></p>
				</div>
			)}
			<div className="report-data-wrapper">
				<Paper sx={{ backgroundColor: "#fff" }}>
					<Table selectable={false} fixedHeader={true} height={"550"}>
						<TableHead
							style={{ backgroundColor: "#cccccc" }}
							adjustForCheckbox={false}
							displaySelectAll={false}
						>
							<TableRow selectable={false}>
								{columns.map(column => {
									return (
										<TableCell
											colSpan={column.width}
											key={column.property}
											style={styles.reportDataWrapperTableCell}
										>
											{localizeDisplayName(column.displayName)}
										</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
						<TableBody >
							{groups.map(group => {
								const rows = [];

								if (reportData.groupedResults) {
									rows.push(groupRenderer(group));
								}

								group.rows.forEach((row, index) => {
									rows.push(rowRenderer(row));
								});
								return rows;
							})}
						</TableBody>
					</Table>
				</Paper>
			</div>
			<Dialog
				modal={false}
				open={requestDialogOpen && isOpen}
				onRequestClose={() => dispatch(closeRequestDialog())}
				PaperProps={
					{
						sx: { background: "#fff", color: "#9C9C9C", maxWidth: "720px" }
					}
				}
			>
				<DialogTitle
					sx={{ color: "#4B4B4B" }}
					variant="h3">
					{getTranslation("reportBuilder.reportBuilder_reports.report.requestCsv")}
				</DialogTitle>

				<DialogContent >

					{requestDialogToast ? (
						<div>
							<Translate value="reportBuilder.reportBuilder_reports.report.errorMessage" />
						</div>
					) : (
						<div>
							<Translate value="reportBuilder.reportBuilder_reports.report.reportMessage" />
						</div>
					)}
					{requestDialogError && (
						<span className="error-text cb2-font-b2 request-error-message">
							{requestDialogError.message}
						</span>
					)}
				</DialogContent>
				<DialogActions>
					{actions}
				</DialogActions>

			</Dialog>
			<Dialog
				modal={false}
				open={pdfRequestDialogOpen && pdfIsOpen}
				onRequestClose={() => dispatch(closePDFRequestDialog())}
				PaperProps={
					{
						sx: { background: "#fff", color: "#9C9C9C", maxWidth: "720px" }
					}
				}
			>
				<DialogTitle
					sx={{ color: "#4B4B4B" }}
					variant="h3">
					{getTranslation("reportBuilder.reportBuilder_reports.report.requestPdf")}
				</DialogTitle>
				<DialogContent>
					{pdfRequestDialogToast ? (
						<div>
							<Translate value="reportBuilder.reportBuilder_reports.report.errorMessage" />
						</div>
					) : (
						<div>
							<Translate value="reportBuilder.reportBuilder_reports.report.reportMessage" />
						</div>
					)}
					{pdfRequestDialogError && (
						<span className="error-text cb2-font-b2 request-error-message">
							{pdfRequestDialogError.message}
						</span>
					)}
				</DialogContent>
				<DialogActions>
					{pdfActions}
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Report;
