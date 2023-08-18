import React from "react";

import { Table, TableBody, TableHead, TableRow, TableCell, Paper } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { grey, green } from "@mui/material/colors";
import ReactHtmlParser from "react-html-parser";
import { UserTime } from "orion-components/SharedComponents";
import { Translate } from "orion-components/i18n";

const green500 = green[500];
const grey500 = grey[500];

const EventList = ({ list, index, timeFormatPreference }) => {
	const listRowRenderer = (row, list, index) => {
		const columns = list.columns;
		return (
			<TableRow selectable={false} key={index}>
				{columns.map((column, index) => {
					const prop = column.id;
					let td = "";
					if (prop === "completed") {
						const body = (
							<div style={{ marginLeft: 15 }}>
								<CheckCircle color={row.data[prop] ? green500 : grey500} />
							</div>
						);
						td = (
							<TableCell
								key={index}
								style={{
									backgroundColor: "#fff",
									fontSize: "13px",
									padding: "10px 24px"
								}}
							>
								{body}
							</TableCell>
						);
					} else {
						let time = "";
						if ((prop === "time" || (column && column.type === "date-time")) && row.data[prop]) {
							const timeFormat =
								column.type === "date-time" && column.includeTime
									? timeFormatPreference
										? `full_${timeFormatPreference}`
										: "full_12-hour"
									: "MM/DD/YYYY";
							time = <UserTime time={row.data[prop]} format={timeFormat} />;
						}
						td = (
							<TableCell
								style={
									column.type === "notes"
										? {
												overflowWrap: "break-word",
												whiteSpace: "normal",
												background: "#fff",
												padding: "10px 24px",
												fontSize: "13px"
										  }
										: {
												background: "#fff",
												padding: "10px 24px",
												fontSize: "13px"
										  }
								}
								colSpan={column.width ? column.width : 1}
								key={index}
							>
								{prop === "time" || (column && column.type === "date-time")
									? time
									: ReactHtmlParser(
											row.data[prop] && row.data[prop].name ? row.data[prop].name : row.data[prop]
									  )}
							</TableCell>
						);
					}
					return td;
				})}
			</TableRow>
		);
	};

	const rows = [];
	list.rows.forEach((row, index) => {
		rows.push(listRowRenderer(row, list, index));
	});

	return (
		<div className="mr-table-container" key={"lists-" + index} style={{ marginBottom: 40 }}>
			<h4
				style={{
					color: "black",
					marginBottom: 10,
					marginLeft: 10,
					fontSize: 16
				}}
			>
				{" "}
				<Translate value="reportBuilder.components.multiReport.list" />: {list.title}
			</h4>
			<Paper>
				<Table selectable={false} fixedHeader={true}>
					<TableHead
						style={{ backgroundColor: "#cccccc" }}
						adjustForCheckbox={false}
						displaySelectAll={false}
					>
						<TableRow selectable={false}>
							{list.columns.map((column, index) => {
								return (
									<TableCell
										key={`list-header-column-${index}`}
										colSpan={1}
										style={{
											width: !column.name ? 74 : "",
											backgroundColor: "#cccccc",
											padding: "10px 24px",
											fontSize: "12px"
										}}
									>
										{column.name}
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody displayRowCheckbox={false}>{rows}</TableBody>
				</Table>
			</Paper>
		</div>
	);
};

export default EventList;
