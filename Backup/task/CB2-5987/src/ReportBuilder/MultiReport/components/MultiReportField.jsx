import React from "react";
import { UserTime } from "orion-components/SharedComponents";
import { getTranslation } from "orion-components/i18n";

const MultiReportField = ({ template, value, timeFormatPreference }) => {
	let time = "";
	if (template.property.toLowerCase().includes("time")) {
		const timeFormat = timeFormatPreference ? `time_${timeFormatPreference}` : "time_12-hour";
		time = <UserTime time={value} format={timeFormat} />;
	}
	if (template.property.toLowerCase().includes("date")) {
		time = <UserTime time={value} format={"L"} />;
	}
	const returnValue = time ? time : value;
	return (
		<div className="multi-report-field" style={{ marginTop: 20, marginBottom: 20 }}>
			<h6>{getTranslation(`mainpage.list.${template.header}`)}</h6>
			{returnValue}
		</div>
	);
};

export default MultiReportField;
