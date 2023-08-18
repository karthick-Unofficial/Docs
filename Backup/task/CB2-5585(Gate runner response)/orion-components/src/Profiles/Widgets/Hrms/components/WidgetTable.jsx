import React, { useEffect, useState } from "react";
import { TableHead, TableCell, Table, TableRow, TableBody, TableContainer } from "@mui/material";
import { getTranslation } from "orion-components/i18n";

const WidgetTable = ({
	tableData,
	WidgetType,
	expanded,
	dir
}) => {
	const style = {
		cell: {
			color: "#D5D7D7",
			borderBottom: "1px solid #969AA0",
			...(dir === "rlt" && { textAlign: "right" })
		}
	};
	const [tableHeader, setTableheader] = useState([]);
	const [widgetData, setWidgetData] = useState([]);


	useEffect(() => {
		if (WidgetType === "resources") {
			setTableheader(
				[
					{
						header: getTranslation("global.profiles.widgets.hrms.widgetTable.name")
					},
					{
						header: getTranslation("global.profiles.widgets.hrms.widgetTable.rank")
					},
					{
						header: getTranslation("global.profiles.widgets.hrms.widgetTable.location")
					},
					{
						header: getTranslation("global.profiles.widgets.hrms.widgetTable.unit")
					}


				]);
		}
		else {

			setTableheader([
				{
					header: getTranslation("global.profiles.widgets.hrms.widgetTable.name")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.widgetTable.category")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.widgetTable.unit")
				}
			]);
		}
		tableData.sort((a, b) => a.Name.localeCompare(b.Name));
		setWidgetData(tableData);
	}, [WidgetType, tableData]);


	return (
		<div>
			{widgetData.length > 0 ?
				<div>
					<TableContainer style={{ maxHeight: "auto", overflow: !expanded ? "hidden" : "auto" }}>
						<Table>
							<colgroup>
								{tableHeader.map((row, index) => {
									return (
										<col width="34%" key={index} />
									);
								})}
							</colgroup>
							<TableHead>
								<TableRow>
									{tableHeader.map((value, index) => {
										return (
											<TableCell
												style={{
													position: "sticky",
													color: "#969AA0",
													backgroundColor: expanded ? "#35383C" : "#2C2D2F"
												}}
												key={index} >
												{value.header}
											</TableCell>
										);
									})}

								</TableRow>
							</TableHead>
							<TableBody>
								{WidgetType === "resources" ? widgetData.map((element, index) => {
									return (
										<TableRow key={index} tabIndex="0" id="widgetScrollResource">
											<TableCell style={style.cell}>{element.Name}</TableCell>
											<TableCell style={style.cell}>{element.RankName}</TableCell>
											<TableCell style={style.cell}>{element.LocationName}</TableCell>
											<TableCell style={style.cell}>{element.UnitName}</TableCell>
										</TableRow>
									);

								}) :
									widgetData.map((element, index) => {
										return (
											<TableRow key={index} tabIndex="0" id="widgetScrollEquipment">
												<TableCell style={style.cell}>{element.Name}</TableCell>
												<TableCell style={style.cell}>{element.Category}</TableCell>
												<TableCell style={style.cell}>{element.UnitName}</TableCell>
											</TableRow>
										);

									})}

							</TableBody>
						</Table>
					</TableContainer>
				</div>
				: <div />}
		</div>
	);
};
export default WidgetTable;