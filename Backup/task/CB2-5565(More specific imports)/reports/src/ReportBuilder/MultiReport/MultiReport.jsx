import React, { useEffect, useRef, useState } from "react";

import MultiReportField from "./components/MultiReportField";
import MultiReportLongField from "./components/MultiReportLongField";
import MultiReportSection from "./components/MultiReportSection";
import EventList from "./components/EventList";
import { UserTime } from "orion-components/SharedComponents";
// Material Ui
import {
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	CircularProgress,
	Button
} from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";



const MultiReport = ({
	report,
	handlePDFExport,
	eventName,
	time
}) => {

	const reportData = useSelector(state => state.appState.reportViewer.reports.filter(reportItem => {
		return reportItem.type === report.id;
	}));
	const isGeneratingFile = useSelector(state => state.appState.reportViewer.isGeneratingFile);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);

	const [data, setData] = useState(null);
	const [formatData, setFormatData] = useState(null);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevFormatData = usePrevious(formatData);
	const prevReportData = usePrevious(reportData);

	let display = null;

	useEffect(() => {
		if (reportData !== prevReportData) {
			setData(reportData[0].data);
		}
	}, [reportData]);

	useEffect(() => {

		if (prevFormatData !== formatData) {
			setFormatData(report.type.multi);
		}
	}, [report]);

	const rowRenderer = (row, component, index, handle) => {
		const columns = component.columns;
		return (
			<TableRow selectable={false} key={index}>
				{columns.map((column, index) => {
					const prop = column.property;
					let time = "";
					if (prop === "time") {
						const timeFormat = timeFormatPreference ? `full_${timeFormatPreference}` : "full_12-hour";
						time = <UserTime time={row[prop]} format={timeFormat} />;
					}

					const td = (
						<TableCell
							colSpan={column.width ? column.width : 1}
							key={index}
							style={{
								whiteSpace: "initial",
								padding: "10px 24px",
								fontSize: "13px",
								backgroundColor: "#fff"
							}}
						>
							{prop === "email" ?
								<a
									style={{ textDecoration: "none" }}
									href={`mailto:${row[prop]}`}
								>
									{row[prop]}
								</a>
								:
								prop === "time" ?
									time
									:
									component.header && component.header.toLowerCase() === "files" && prop === "name"
										?
										<a
											style={{ textDecoration: "none" }}
											href={`/_download?handle=${handle}`}
											download={row[prop]}
										>
											{row[prop].slice(0, row[prop].indexOf("."))}
										</a>
										:
										prop === "pdfDownloadData" ?
											""
											:
											row[prop]
							}
						</TableCell>
					);
					return td;
				})}
			</TableRow>
		);
	};

	const listRenderer = lists => {
		const returnTables = lists.map((list, index) => {
			const rows = [];
			if (list.rows && list.rows.length > 0) {
				list.rows.forEach((row, index) => {
					rows.push(rowRenderer(row, list, index));
				});
			}

			return (
				<EventList key={`event-list-${index}`} index={index} list={list} timeFormatPreference={timeFormatPreference} />
			);
		});

		return returnTables;
	};

	const handleExport = () => {
		const reportData = { eventName: eventName ? eventName : "", creationTime: time, formatData: report.type.multi };
		handlePDFExport(reportData);
	};


	const componentArray = {};
	if (data && data.length > 0) {
		data.forEach((data, index) => {
			componentArray[index] = {
				fields: [],
				longFields: [],
				sections: [],
				tables: []
			};
			const tables = componentArray[index].tables;
			const fields = componentArray[index].fields;
			const longFields = componentArray[index].longFields;
			const sections = componentArray[index].sections;
			formatData.forEach((component, index) => {
				switch (component.type) {
					case "field": {
						if (data[component.property] && data[component.property].value)
							fields.push(
								<MultiReportField
									key={"multi-report-field-" + index}
									value={data[component.property].value}
									template={component}
									timeFormatPreference={timeFormatPreference}
								/>
							);
						break;
					}
					case "section": {
						if (data[component.property] && data[component.property].value)
							sections.push(
								<MultiReportSection
									key={"mutli-report-section-" + index}
									value={data[component.property].value}
									template={component}
									timeFormatPreference={timeFormatPreference}
								/>
							);
						break;
					}
					case "long-field": {
						if (data[component.property] && data[component.property].value)
							longFields.push(
								<MultiReportLongField
									key={"mutli-report-long-field-" + index}
									value={data[component.property].value}
									template={component}
								/>
							);
						break;
					}
					case "table": {
						if (data[component.property] && (data[component.property].value.rows || data[component.property].value)) {
							if (component.property === "lists") {
								const listComponentArr = listRenderer(data[component.property].value);
								listComponentArr.forEach(item => {
									tables.push(item);
								});
							} else {
								const groups = data[component.property].value;
								const rows = [];
								if (groups.rows) {
									groups.rows.forEach((row, index) => {
										const handle = data[component.property].handles ? data[component.property].handles[index] : "";
										rows.push(rowRenderer(row, component, index, handle));
									});
									tables.push(
										<div className="mr-table-container" key={"mr-table-container-" + index} style={{ marginBottom: 40 }}>
											<h4 style={{ color: "black", marginBottom: 10, marginLeft: 10, fontSize: 16 }}>{component.header}</h4>
											<Paper>
												<Table selectable={false} fixedHeader={true} >
													<TableHead
														style={{ backgroundColor: "#cccccc" }}
														adjustForCheckbox={false}
														displaySelectAll={false}
													>
														<TableRow selectable={false}>
															{component.columns.map(column => {
																return (
																	<TableCell
																		colSpan={column.width}
																		key={column.property}
																		style={{ padding: "10px 24px", fontSize: "12px" }}
																	>
																		{column.displayName}
																	</TableCell>
																);
															})}
														</TableRow>
													</TableHead>
													<TableBody displayRowCheckbox={false}>
														{rows}
													</TableBody>
												</Table>
											</Paper>
										</div>
									);
								}
							}
						}
						break;
					}
					default:

				}
			});
		});
		display = data.map((entity, index) => {
			return (
				<div key={`table-${index}`}>
					{index > 0 ? <hr></hr> : ""}
					<div className="mr-fields" style={{ marginBottom: 30, display: "flex", justifyContent: "space-between" }}>
						{componentArray[index].fields}
					</div>
					<div className="mr-fields" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
						{componentArray[index].sections}
					</div>
					<div className="mr-long-fields" style={{ marginBottom: 20 }}>
						{componentArray[index].longFields}
					</div>
					<div className="mr-tables" >
						{componentArray[index].tables}
					</div>
				</div>
			);
		});
	}




	const finalReport = (
		<div className="multi-report" >
			{!report.disablePDF &&
				<div className="mb5" style={{ textAlign: "right", marginBottom: 35 }}>
					{!isGeneratingFile ?
						<Button
							onClick={handleExport}
							style={{ color: "#ffffff", backgroundColor: "#4eb5f3" }}
							variant="contained"
						><FileDownload />{getTranslation("reportBuilder.components.multiReport.downloadPdf")}</Button> : (
							<div
								style={{
									width: "25%",
									marginLeft: "auto",
									marginRight: 0,
									textAlign: "right",
									padding: "0 18px",
									marginBottom: 35
								}}
							>
								<CircularProgress size={30} />
							</div>
						)
					}
				</div>
			}

			<div id="download">
				{display}
			</div>
		</div>);

	return finalReport;

};

export default MultiReport;