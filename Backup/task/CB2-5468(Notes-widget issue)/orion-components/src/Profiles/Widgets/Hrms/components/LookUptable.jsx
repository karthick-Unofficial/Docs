import React, { useEffect, useState, useRef, useCallback } from "react";
import { TableHead, TableCell, Table, TableRow, TableBody, Button, Checkbox, TableContainer } from "@mui/material";
import _ from "lodash";
import { eventService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";





const LookUpTable = ({
	contextId,
	lookupData,
	lookupType,
	assigned,
	available,
	closePopup,
	dir
}) => {
	const style = {
		tableHead: {
			color: "#969AA0",
			position: "sticky",
			background: "#2C2D2F",
			top: 0,
			zIndex: 1,
			borderBottom: "1px solid #969AA0"

		},
		cell: {
			color: "#D5D7D7",
			borderBottom: "1px solid #969AA0"
		}
	};
	const resourceRef = useRef();
	const equipmentRef = useRef();



	const [tableHeader, setTableheader] = useState([]);
	const [widgetData, setWidgetData] = useState([]);
	const [checkLookupData, setCheckLookupData] = useState(false);



	useEffect(() => {


		if (lookupType === "resources") {
			setTableheader(
				[{
					header: ""
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.shiftEnding")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.location")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.unit")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.rank")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.name")
				}
				]);

		}
		else {

			setTableheader([
				{
					header: ""
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.name")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.category")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.count")
				},
				{
					header: getTranslation("global.profiles.widgets.hrms.lookupTable.unit")
				}
			]);
		}
		if (assigned && !available) {
			let data = widgetData.filter(element => {
				return element.Selected == true;

			});
			setWidgetData(data);
		}
		else if (available && !assigned) {
			let data = widgetData.filter(element => {
				return element.AvailableNow == true;

			});
			setWidgetData(data);
		}
		else {
			if (lookupData) {
				if (lookupData !== undefined) {
					setWidgetData(lookupData);
					setCheckLookupData(true);
				}

			}

		}

	}, [lookupType, lookupData, assigned, available]);







	const actions = () => {
		const handleSave = () => {

			if (lookupType === "resources") {
				const resources = [];
				widgetData.find((data) => {
					if (data.Selected === true) {
						resources.push(data);
					}
				});

				const update = { additionalProperties: { resources } };
				eventService.updateEvent(contextId, update, (err, response) => {
					if (err) console.log(err);
					if (response) closePopup();
				});

			}
			else {
				const equipments = [];
				widgetData.find((data) => {
					if (data.Selected === true) {
						equipments.push(data);
					}
				});
				const update = { additionalProperties: { equipments } };
				eventService.updateEvent(contextId, update, (err, response) => {
					if (err) console.log(err);
					if (response) closePopup();
				});
			}
		};


		return (
			<div style={{ marginTop: "5%", float: "right", marginBottom: "5%" }}>
				<Button onClick={closePopup}>
					<Translate value="global.profiles.widgets.hrms.lookupTable.cancel" />
				</Button>
				<Button
					style={dir == "rtl" ? {
						width: "130px", padding: "5px 20px",
						marginRight: "20px", color: "white", background: "#4DB5F4",
						borderRadius: "5px"
					} : {
						width: "130px", padding: "5px 20px",
						marginLeft: "20px", color: "white", background: "#4DB5F4",
						borderRadius: "5px"
					}}


					onClick={handleSave}
				>
					<Translate value="global.profiles.widgets.hrms.lookupTable.done" />
				</Button>
			</div>
		);
	};
	const handleCheck = (e, i) => {

		widgetData[i][`${e.target.name}`] = e.target.checked;

		setWidgetData([...widgetData]);

	};
	const onResourceRefChange = useCallback(node => {
		if (node !== null) {
			resourceRef.current = node;
			if (resourceRef !== null) {

				if (document.getElementById("trowsScrollResource"))
					document.getElementById("trowsScrollResource").focus();

			}

		}
	}, []);

	const onEquipmentRefChange = useCallback(node => {
		if (node !== null) {
			equipmentRef.current = node;
			if (equipmentRef !== null) {
				document.getElementById("trowsScrollEquipment").focus();
			}

		}
	}, []);




	return (
		<div>
			{checkLookupData ?
				widgetData.length > 0 ?
					<div>
						<TableContainer style={{
							maxHeight: "40vh"
						}}>
							<Table>
								<colgroup>
									{tableHeader.map((row, index) => {
										if (index === 0) {
											return (
												<col width="5%" key={index} />
											);
										}
										else {
											<col width="25%" key={index} />;
										}

									})}
								</colgroup>
								<TableHead  >
									<TableRow style={{ background: "#2C2D2F" }}>
										{tableHeader.map((value, index) => {
											return (
												<TableCell style={style.tableHead} key={index} >
													{value.header}
												</TableCell>
											);
										})}

									</TableRow>
								</TableHead>
								<TableBody>
									{lookupType === "resources" ? widgetData.map((element, index) => {
										return (
											<TableRow key={index} tabIndex="0"
												ref={onResourceRefChange}
												id="trowsScrollResource">
												<TableCell style={style.cell}>
													<Checkbox name="Selected"
														checked={element.Selected}
														color="primary"
														style={{
															color: element.Selected ? "#4DB6F5" : "#55575A"
														}}
														onChange={e => handleCheck(e, index)} />
												</TableCell>
												<TableCell style={style.cell}>{element.ShiftEndTime}</TableCell>
												<TableCell style={style.cell}>{element.LocationName}</TableCell>
												<TableCell style={style.cell}>{element.UnitName}</TableCell>
												<TableCell style={style.cell}>{element.RankName}</TableCell>
												<TableCell style={style.cell}>{element.Name}</TableCell>
											</TableRow>
										);

									}) :
										widgetData.map((element, index) => {
											return (
												<TableRow key={index}
													ref={onEquipmentRefChange}
													tabIndex="0" id="trowsScrollEquipment">
													<TableCell style={style.cell}>
														<Checkbox name="Selected"
															checked={element.Selected}
															color="primary"
															style={{
																color: element.Selected ? "#4DB6F5" : "#55575A"
															}}
															onChange={e => handleCheck(e, index)} />
													</TableCell>
													<TableCell
														style={style.cell}>{element.Name}</TableCell>
													<TableCell style={style.cell}>{element.Category}</TableCell>
													<TableCell style={style.cell}>{element.ItemCount}</TableCell>
													<TableCell style={style.cell}>{element.UnitName}</TableCell>
												</TableRow>
											);

										})}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
					: <div /> : null}
			{actions()}
		</div>
	);
};
export default LookUpTable;