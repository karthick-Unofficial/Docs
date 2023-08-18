import React from "react";
import ReactHtmlParser from "react-html-parser";

const MultiReportLongField = ({ template, value }) => {
	let result = "";
	switch (template.property) {
		case "notes":
			result = (
				<div className="notes">
					{template.largeHeader ? <h3>{template.header}</h3> : <h6>{template.header}</h6>}
					<div className="ql-editor">{ReactHtmlParser(value)}</div>
				</div>
			);
			break;
		case "driveCamVid": {
			const src = value;
			result = (
				<div>
					<video style={{ height: 150 }} controls id="video" preload="auto">
						<source src={src} type={"video/mp4"} />
					</video>
				</div>
			);
			break;
		}

		default:
			result = (
				<div>
					<h6>{template.header}</h6>
					<span>{value}</span>
				</div>
			);
			break;
	}
	return (
		<div className="multi-report-long-field" style={{ width: 100 + "%", marginBottom: 30 }}>
			{result}
		</div>
	);
};

export default MultiReportLongField;
