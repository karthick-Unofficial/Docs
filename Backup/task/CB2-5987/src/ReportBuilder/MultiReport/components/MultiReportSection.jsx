import React from "react";
import { timeConversion } from "client-app-core";
import ReactHtmlParser from "react-html-parser";
const MultiReportSection = ({ value, template, timeFormatPreference = null }) => {
	const rows = template.rows.map((row) => {
		let displayValue = [];
		if (Array.isArray(value[row.property])) {
			value[row.property].forEach((data) => {
				let time = "";
				if (row.property.toLowerCase().includes("time")) {
					const timeFormat = timeFormatPreference ? `full_${timeFormatPreference}` : "full_12-hour";
					time = timeConversion.convertToUserTime(value[row.property], timeFormat);
				}
				displayValue.push(time ? time : <div>{data}</div>);
			});
		} else {
			let time = "";
			if (row.property.toLowerCase().includes("time")) {
				const timeFormat = timeFormatPreference ? `full_${timeFormatPreference}` : "full_12-hour";
				time = timeConversion.convertToUserTime(value[row.property], timeFormat);
			}
			if (row.property.toLowerCase().includes("notes")) {
				displayValue = (
					<div className="notes">
						<div
							style={{
								boxSizing: "border-box",
								lineHeight: "1.42",
								overflowY: "auto",
								textAlign: "left",
								whiteSpace: "pre-wrap"
							}}
						>
							{ReactHtmlParser(value[row.property])}
						</div>
					</div>
				);
			} else displayValue = <div>{row.display + (time ? time : value[row.property])}</div>;
		}
		const returnValue = row.header ? (
			<h3 style={{ color: "black" }}>{row.display + (row.property ? value[row.property] : "")}</h3>
		) : (
			displayValue
		);

		return returnValue;
	});
	return (
		<div className="multi-report-field" style={{ marginBottom: 20 }}>
			{rows}
		</div>
	);
};

export default MultiReportSection;
