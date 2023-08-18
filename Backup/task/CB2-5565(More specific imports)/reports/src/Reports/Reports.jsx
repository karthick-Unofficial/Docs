import React, { useEffect } from "react";
import ReportType from "./components/ReportType";
import { getTranslation } from "orion-components/i18n";

// Material UI
import { List } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { wipeReports, wipeAllFieldData } from "../ReportBuilder/reportBuilderActions";

const Reports = () => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.session.user.profile);
	const userApps = user.applications;
	let eventsEnabled = false;
	const reportTypes = useSelector(state => Object.values(state.globalData.reportTypes));
	userApps.forEach(app => {
		if (app.appId === "events-app" && app.config && app.config.canView) eventsEnabled = true;
	});

	const categories = useSelector(state => state.globalData.reportCategories.filter(cat => {
		if (cat === "event-report" && !eventsEnabled) return false;
		return true;
	}));

	const typeAheadFilter = "";
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	useEffect(() => {
		dispatch(wipeReports());
		dispatch(wipeAllFieldData());
	}, []);

	const generateList = (category, index) => {
		// const urlParams = new URLSearchParams(window.location.href.slice(window.location.href.indexOf("?")+1));
		// const id = urlParams.get("id");
		// const event = urlParams.get("event");
		// const eventId = urlParams.get("eventId");
		const header = locale === "en" ? getTranslation(`mainpage.list.${category}`).toUpperCase() : getTranslation(`mainpage.list.${category}`);
		const filteredTypes = reportTypes
			.filter(report => {
				if (!typeAheadFilter) return report;
				else
					return report.name
						.toLowerCase()
						.includes(typeAheadFilter.toLowerCase());
			})
			.filter(report => {
				return report.category === category;
			});

		return (
			<List key={`report-category-${index}`}>
				<h3 className="report-cat-header">{header}</h3>
				{filteredTypes.map((report, index) => {
					return <ReportType key={`report-type-${index}`} report={report} dir={dir} />;
				})}
			</List>
		);
	};

	return (
		<div style={{ marginTop: 20 }} className="reports-list-wrapper">
			{categories.map((cat, index) => {
				return generateList(cat, index);
			})}
		</div>
	);
};

export default Reports;