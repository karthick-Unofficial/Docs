import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { restClient } from "client-app-core";
import { TextField } from "orion-components/CBComponents";
import { FocusInput, SearchSelectField } from "../../../shared/components";
import {
	Checkbox,
	Fab,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import debounce from "debounce";

const propTypes = {
	berth: PropTypes.object.isRequired,
	berths: PropTypes.array.isRequired,
	cargo: PropTypes.array.isRequired,
	cargoDirectionEnabled: PropTypes.bool,
	footmark: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	footmarkAssignment: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired
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
	handleUpdate
}) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	useEffect(() => {
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
		console.log("handleUpdateCargo", index, key, e);
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
	const handleSearch = debounce(search, 200);
	const handleQuery = index => e => {
		const newCargoData = [...cargo];
		newCargoData[index] = {
			...newCargoData[index],
			shipperReceiver: { company: e.target.value }
		};
		handleUpdate("cargo", newCargoData);
		handleSearch(e.target.value);
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
				Cargo and Berth Assignment
			</Typography>
			<Grid style={{ padding: "0px 16px 24px 16px" }} container spacing={3}>
				<Grid item style={{ paddingBottom: 0 }} sm={4} xs={12}>
					<FormControl required={true} margin="normal" fullWidth>
						<InputLabel>Berth</InputLabel>
						<Select value={id} onChange={handleChange("id", "berth")}>
							{sortedBerths.map(berth => {
								const { id, name } = berth;
								return (
									<MenuItem key={id} value={id}>
										{name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={4} xs={12}>
					<Typography style={{ marginTop: 16 }} variant="caption">
						Footmark Assignment
					</Typography>
					<FormGroup style={{ flexWrap: "nowrap" }} row>
						<FormControlLabel
							control={
								<Checkbox
									value="stern"
									checked={footmarkAssignment === "stern"}
									color="primary"
									onChange={handleChange("footmarkAssignment")}
								/>
							}
							label="Stern"
						/>
						<FormControlLabel
							control={
								<Checkbox
									value="bow"
									checked={footmarkAssignment === "bow"}
									color="primary"
									onChange={handleChange("footmarkAssignment")}
								/>
							}
							label="Bow"
						/>
					</FormGroup>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={4} xs={12}>
					<TextField
						id="footmark"
						label="Footmark (ft)"
						value={footmark}
						handleChange={handleChange("footmark")}
						error={
							!!isNaN(footmark) ||
							(selectedBerth && footmark > selectedBerth.endFootmark) ||
							(selectedBerth && footmark < selectedBerth.beginningFootmark)
						}
						helperText={
							isNaN(footmark) ? "Footmark must be a number" : selectedBerth ? `Must be between ${selectedBerth.beginningFootmark} and ${selectedBerth.endFootmark}` : ""
						}
						required={true}
					/>
				</Grid>
				{cargo.length ? (
					<Grid item style={{ paddingBottom: 0 }} lg={12}>
						<Table>
							<TableHead>
								<TableRow style={{ height: "auto" }}>
									<TableCell style={{ paddingRight: 16 }}>Cargo</TableCell>
									{cargoDirectionEnabled && (<TableCell style={{ paddingRight: 16 }}>Direction</TableCell>)}
									<TableCell style={{ paddingRight: 16 }}>Weight (S/T)</TableCell>
									<TableCell style={{ paddingRight: 16 }}>Shipper / Receiver</TableCell>
									<TableCell style={{ padding: "4px 0px 4px 12px" }}>
										Delete
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody style={{ border: "1px solid #515151" }}>
								{cargo.map((c, index) => {
									const { commodity, shipperReceiver, weight, cargoDirection } = c;
									return (
										<TableRow key={index}>
											<TableCell style={{ borderRight: "1px solid #515151", paddingRight: 16 }}>
												<FocusInput
													value={commodity}
													handleChange={handleUpdateCargo(index, "commodity")}
												/>
											</TableCell>
											{cargoDirectionEnabled && (
												<TableCell style={{ borderRight: "1px solid #515151", paddingRight: 16 }}>
													<Select value={cargoDirection} onChange={handleUpdateCargo(index, "cargoDirection")}>
														<MenuItem key="inward" value="inward">Inward</MenuItem>
														<MenuItem key="outward" value="outward">Outward</MenuItem>
													</Select>
												</TableCell>
											)}
											<TableCell style={{ borderRight: "1px solid #515151", paddingRight: 16 }}>
												<FocusInput
													value={weight}
													handleChange={handleUpdateCargo(index, "weight")}
													type="number"
												/>
											</TableCell>
											<TableCell style={{ paddingRight: 16 }}>
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
												/>
											</TableCell>
											<TableCell
												style={{
													padding: 0,
													border: "1px solid #515151"
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
						<Grid item xs={12}>
							<Typography style={{ paddingTop: 16 }} align="center" variant="caption">
								Click button to add cargo information
							</Typography>
						</Grid>
					)}
				<Grid item style={{ paddingBottom: 0 }} xs={12}>
					<div style={{ marginRight: "auto", display: "flex", alignItems: "center" }}>
						<Fab style={{ height: 30, width: 30, minHeight: "unset" }} color="primary" size="small" onClick={handleAddCargo} >
							<Add fontSize="small" />
						</Fab>
						<Typography variant="body1" style={{ marginLeft: 8 }}>
							Add Cargo
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
};

CargoBerthFields.propTypes = propTypes;
CargoBerthFields.defaultProps = defaultProps;

export default memo(CargoBerthFields);
