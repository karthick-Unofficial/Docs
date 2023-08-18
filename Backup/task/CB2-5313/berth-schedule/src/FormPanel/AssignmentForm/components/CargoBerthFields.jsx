import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { restClient } from "client-app-core";
import { TextField, SelectField } from "orion-components/CBComponents";
import { FocusInput, SearchSelectField } from "../../../shared/components";
import {
	Checkbox,
	Fab,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Translate, getTranslation } from "orion-components/i18n";
import { withStyles } from "@mui/styles";


const propTypes = {
	berth: PropTypes.object.isRequired,
	berths: PropTypes.array.isRequired,
	cargo: PropTypes.array.isRequired,
	cargoDirectionEnabled: PropTypes.bool,
	footmark: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	footmarkAssignment: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired,
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const styles = {
	icon: {
		right: "unset!important",
		left: "0!important"
	}
};

const defaultProps = {
	footmark: "",
	footmarkAssignment: "bow"
};

const CargoBerthFields = ({
	berth,
	berths,
	cargo,
	cargoDirectionEnabled,
	footmark,
	footmarkAssignment,
	handleChange,
	handleUpdate,
	dir,
	classes
}) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [debouncer, setDebouncer] = useState(null);
	const debounce = (fn, delay) => {
		if (debouncer) {
			clearTimeout(debouncer);
		}

		setDebouncer(setTimeout(() => {
			fn();
			setDebouncer(null);
		}, delay));
	};

	useEffect(() => {
		if (query != "") {
			restClient.exec_get(
				`/berth-schedule-app/api/shippersReceivers/query/byShipperReceiverData?searchProps=company&searchString=${query}`,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
					} else {
						if (Array.isArray(response)) {
							setResults(response);
						}
					}
				}
			);
		}
		else {
			setResults([]);
		}
	}, [query]);
	const newCargo = {
		commodity: "",
		shipperReceiver: { company: "" },
		weight: "",
		cargoDirection: cargoDirectionEnabled ? "inward" : null
	};
	const { id } = berth;
	const handleAddCargo = () => {
		const newCargoData = [...cargo, newCargo];
		handleUpdate("cargo", newCargoData);
	};
	const handleUpdateCargo = (index, key) => e => {
		const newCargoData = [...cargo];
		if (key === "shipperReceiver") {
			const newCompany = results.find(result => result.id === e);
			newCargoData[index] = {
				...newCargoData[index],
				shipperReceiver: newCompany
			};
		} else {
			newCargoData[index] = { ...newCargoData[index], [key]: e.target.value };
		}
		handleUpdate("cargo", newCargoData);
	};
	const handleRemoveCargo = i => {
		const newCargoData = cargo.filter((cargo, index) => index !== i);
		handleUpdate("cargo", newCargoData);
	};
	const search = value => {
		setQuery(value);
	};
	const handleQuery = index => e => {
		const newCargoData = [...cargo];
		const searchString = e.target.value;
		newCargoData[index] = {
			...newCargoData[index],
			shipperReceiver: { company: searchString }
		};
		handleUpdate("cargo", newCargoData);

		debounce(() => {
			search(searchString);
		}, 400);
	};
	const selectedBerth = berths.find(b => b.id === berth.id);
	const sortedBerths = [...berths].sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);

	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				<Translate value="formPanel.cargoBerthAssg.title" />
			</Typography>
			<Grid container style={{ padding: "0px 16px 24px", margin: "-12px", width: "calc(100% + 24px)" }}>
				<Grid item style={{ padding: "12px 12px 0 12px" }} sm={4} xs={12}>
					<SelectField
						label={getTranslation("formPanel.cargoBerthAssg.fieldLabel.berth")}
						handleChange={handleChange("id", "berth")}
						value={id}
						inputProps={{ style: { fontSize: 14 } }}
						dir={dir}
					>
						{sortedBerths.map(berth => {
							const { id, name } = berth;
							return (
								<MenuItem key={id} value={id}>
									{name}
								</MenuItem>
							);
						})}
					</SelectField>
				</Grid>
				<Grid item style={{ padding: "12px 12px 0 12px" }} sm={4} xs={12}>
					<Typography style={{ marginTop: 16 }} variant="caption">
						<Translate value="formPanel.cargoBerthAssg.fieldLabel.footmarkAssg" />
					</Typography>
					<FormGroup style={{ flexWrap: "nowrap" }} row>
						<FormControlLabel
							className="themedCheckBox"
							control={
								<Checkbox
									value="stern"
									checked={footmarkAssignment === "stern"}
									color="primary"
									onChange={handleChange("footmarkAssignment")}
								/>
							}
							label={getTranslation("formPanel.cargoBerthAssg.fieldLabel.stern")}
							style={dir == "rtl" ? { marginRight: "-11px", marginLeft: "16px" } : {}}
						/>
						<FormControlLabel
							className="themedCheckBox"
							control={
								<Checkbox
									value="bow"
									checked={footmarkAssignment === "bow"}
									color="primary"
									onChange={handleChange("footmarkAssignment")}
								/>
							}
							label={getTranslation("formPanel.cargoBerthAssg.fieldLabel.bow")}
							style={dir == "rtl" ? { marginRight: "-11px", marginLeft: "16px" } : {}}
						/>
					</FormGroup>
				</Grid>
				<Grid item style={{ padding: "12px 12px 0 12px" }} sm={4} xs={12}>
					<TextField
						id="footmark"
						label={getTranslation("formPanel.cargoBerthAssg.fieldLabel.footmark")}
						value={footmark}
						handleChange={handleChange("footmark")}
						error={
							!!isNaN(footmark) ||
							(selectedBerth && footmark > selectedBerth.endFootmark) ||
							(selectedBerth && footmark < selectedBerth.beginningFootmark)
						}
						helperText={
							isNaN(footmark) ? getTranslation("formPanel.cargoBerthAssg.helperText.mustBeNumber") : selectedBerth ? `${getTranslation("formPanel.cargoBerthAssg.helperText.betweenValues")} ${selectedBerth.beginningFootmark} ${getTranslation("formPanel.cargoBerthAssg.helperText.and")} ${selectedBerth.endFootmark}` : ""
						}
						required={true}
						dir={dir}
						inputLabelStyle={{ fontSize: 14, color: "#B5B9BE" }}
						/>
				</Grid>
				{cargo.length ? (
					<Grid item style={{ padding: "12px 12px 0 12px" }} lg={12}>
						<Table>
							<TableHead>
								<TableRow style={{ height: "auto" }}>
									<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", paddingRight: 16, color: "#fff", fontSize: "12px" }}><Translate value="formPanel.cargoBerthAssg.table.head.cargo" /> </TableCell>
									{cargoDirectionEnabled && (<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", paddingRight: 16, color: "#fff", fontSize: "12px" }}><Translate value="formPanel.cargoBerthAssg.table.head.direction" /></TableCell>)}
									<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", paddingRight: 16, color: "#fff", fontSize: "12px" }}><Translate value="formPanel.cargoBerthAssg.table.head.weight" /></TableCell>
									<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", paddingRight: 16, color: "#fff", fontSize: "12px" }}><Translate value="formPanel.cargoBerthAssg.table.head.shipper" /></TableCell>
									<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", padding: "4px 0px 4px 12px", color: "#fff", fontSize: "12px" }}>
										<Translate value="formPanel.cargoBerthAssg.table.head.delete" />
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody style={{ border: "1px solid #515151" }}>
								{cargo.map((c, index) => {
									const { commodity, shipperReceiver, weight, cargoDirection } = c;
									return (
										<TableRow key={index}>
											<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", borderRight: "1px solid #515151", paddingRight: 16 }}>
												<FocusInput
													value={commodity}
													handleChange={handleUpdateCargo(index, "commodity")}
												/>
											</TableCell>
											{cargoDirectionEnabled && (
												<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", borderRight: "1px solid #515151", paddingRight: 16 }}>
													<SelectField
														handleChange={handleUpdateCargo(index, "cargoDirection")}
														value={cargoDirection}
														inputProps={{ style: { fontSize: 14 } }}
														dir={dir}
													>
														<MenuItem key="inward" value="inward"><Translate value="formPanel.cargoBerthAssg.fieldLabel.inward" /></MenuItem>
														<MenuItem key="outward" value="outward"><Translate value="formPanel.cargoBerthAssg.fieldLabel.outward" /></MenuItem>
													</SelectField>
												</TableCell>
											)}
											<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", borderRight: "1px solid #515151", paddingRight: 16 }}>
												<FocusInput
													value={weight}
													handleChange={handleUpdateCargo(index, "weight")}
													type="number"
												/>
											</TableCell>
											<TableCell style={{ textAlign: dir == "rtl" ? "right" : "left", paddingRight: 16 }}>
												<SearchSelectField
													id="shipper-receiver"
													value={shipperReceiver.company}
													handleSelect={handleUpdateCargo(
														index,
														"shipperReceiver"
													)}
													handleSearch={handleQuery(index)}
													results={results.map(result => {
														return { id: result.id, name: result.company };
													})}
													dir={dir}
												/>
											</TableCell>
											<TableCell
												style={{
													padding: 0,
													border: "1px solid #515151",
													textAlign: dir == "rtl" ? "right" : "left"
												}}
											>
												<IconButton onClick={() => handleRemoveCargo(index)}>
													<Delete />
												</IconButton>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Grid>
				)
					:
					(
						<Grid item xs={12} style={{ padding: "12px 12px 0 12px" }}>
							<Typography style={{ paddingTop: 16 }} align="center" variant="caption">
								<Translate value="formPanel.cargoBerthAssg.clickToAdd" />
							</Typography>
						</Grid>
					)}
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={12}>
					<div style={dir == "rtl" ? { marginLeft: "auto", display: "flex", alignItems: "center" } : { marginRight: "auto", display: "flex", alignItems: "center" }}>
						<Fab style={{ height: 30, width: 30, minHeight: "unset" }} color="primary" size="small" onClick={handleAddCargo} >
							<Add fontSize="small" />
						</Fab>
						<Typography variant="body1" style={dir == "rtl" ? { marginRight: 8 } : { marginLeft: 8 }}>
							<Translate value="formPanel.cargoBerthAssg.addCargoBtn" />
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
};

CargoBerthFields.propTypes = propTypes;
CargoBerthFields.defaultProps = defaultProps;

export default memo(withStyles(styles)(CargoBerthFields));