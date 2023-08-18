import React from "react";
import { Link, Navigate } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FileDocumentOutline as Report } from "mdi-material-ui";
import { getTranslation } from "orion-components/i18n";

const ReportItem = ({ report, eventName, eventId, id, dir }) => {
	const styles = {
		listItemText: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItem: {
			backgroundColor: "#41454A", marginBottom: "1rem"
		}
	};

	if (id && id === "sitrep" && id === report.id) {
		return (
			<Navigate
				state={{ id: report.id, name: report.name, eventId, eventName }}
				to={`/report-builder/${report.id}`}
				key={report.id}
			/>
		);
	} else
		return (
			<Link
				state={{ id: report.id, name: report.name }}
				to={`/report-builder/${report.id}`}
				key={report.id}
			>
				<ListItem
					style={styles.listItem}
				>
					<ListItemIcon>
						<Report fontSize="large" />
					</ListItemIcon>
					<ListItemText style={styles.listItemText} primary={getTranslation(report.pdfOnly ? "mainpage.list.eventTitle" : report.name)} secondary={getTranslation(report.desc)} />
				</ListItem>
			</Link>
		);
};

export default ReportItem;
