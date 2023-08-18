import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Add, Delete } from "@material-ui/icons";
import {
	Fab,
	Typography,
	Grid,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	FormControl,
	MenuItem,
	Select
} from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";
import { withStyles } from "@material-ui/core/styles";

const propTypes = {
	assignmentCargoDirection: PropTypes.string,
	cargo: PropTypes.array.isRequired,
	updateCargo: PropTypes.func.isRequired,
	removeCargo: PropTypes.func.isRequired,
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const defaultProps = {
	cargo: [],
	updateCargo: () => { },
	removeCargo: () => { }
};

const styles = {
	border: { border: "1px solid #515151" },
	buttonBox: { marginRight: "auto", display: "flex", alignItems: "center", marginBottom: "40px" },
	buttonBoxRTL: { marginLeft: "auto", display: "flex", alignItems: "center", marginBottom: "40px" },
	icon: {
		right: "unset!important",
		left: "0!important"
	},
	select: {
		paddingRight: "0!important"
	}
};

const VesselReportCargoTable = ({ cargo, updateCargo, removeCargo, dir, classes, assignmentCargoDirection }) => {

	const handleAddCargo = () => {
		const cargoTemplate = {
			id: cargo.length,
			commodity: "",
			weight: 0,
			cargoDirection: ""
		};
		const newCargoData = [...cargo, cargoTemplate];
		updateCargo(newCargoData);
	};

	const handleUpdateCargo = (index, key) => e => {
		const newCargoData = [...cargo];
		let value = e.target.value;
		if (key === "weight") {
			value = parseFloat(value);
		}
		newCargoData[index] = { ...newCargoData[index], [key]: value };
		updateCargo(newCargoData);
	};

	const handleRemoveCargo = id => {
		removeCargo(id);
	};

	return (
		<Fragment>
			{cargo.length ? (
				<Grid item style={{ paddingBottom: 0, marginBottom: "20px" }} lg={12}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell colSpan="4" style={{ ...styles.border, textAlign: "center", fontSize: "16px", fontWeight: "800", padding: "5px" }}>
									<Translate value="vesselReport.vesselReportCargoTable.table.head.totalCargoWeight" />
								</TableCell>
							</TableRow>
							<TableRow style={{ height: "auto" }}>
								<TableCell style={{ ...styles.border, fontSize: "16px" }}><Translate value="vesselReport.vesselReportCargoTable.table.head.cargo" /></TableCell>
								<TableCell style={{ ...styles.border, width: "15%", fontSize: "16px" }}><Translate value="vesselReport.vesselReportCargoTable.table.head.inboundOutbound" /></TableCell>
								<TableCell style={{ ...styles.border, width: "15%", fontSize: "16px" }}><Translate value="vesselReport.vesselReportCargoTable.table.head.weight" /></TableCell>
								<TableCell style={{ ...styles.border, padding: dir == "rtl" ? "4px 7px 4px 0px" : "4px 0px 4px 7px", fontSize: "16px" }}>
									<Translate value="vesselReport.vesselReportCargoTable.table.head.delete" />
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody style={styles.border}>
							{cargo.map((c, index) => {
								console.log("Cargo", c);
								const { commodity, id, weight, cargoDirection } = c;
								return (
									<TableRow key={index}>
										<TableCell style={styles.border}>
											<TextField
												value={commodity}
												onChange={handleUpdateCargo(index, "commodity")}
											/>
										</TableCell>
										<TableCell style={{ ...styles.border, width: "15%" }}>
											<FormControl margin="normal" fullWidth>
												<Select
													value={cargoDirection ? cargoDirection : (assignmentCargoDirection ? assignmentCargoDirection : null)}
													onChange={handleUpdateCargo(index, "cargoDirection")}
													inputProps={{
														classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
													}}
												>
													<MenuItem key={"inward"} value={"inward"}>
														<Translate value="vesselReport.vesselReportCargoTable.fieldLabel.inward" />
													</MenuItem>
													<MenuItem key={"outward"} value={"outward"}>
														<Translate value="vesselReport.vesselReportCargoTable.fieldLabel.outward" />
													</MenuItem>
												</Select>
											</FormControl>
										</TableCell>
										<TableCell style={{ ...styles.border, width: "15%" }}>
											<TextField
												value={weight}
												type="number"
												onChange={handleUpdateCargo(index, "weight")}
											/>
										</TableCell>
										<TableCell
											style={{
												padding: 0,
												...styles.border
											}}
										>
											<IconButton onClick={() => handleRemoveCargo(id)}>
												<Delete />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
							<TableRow key={"999"}>
								<TableCell style={dir == "rtl" ? {
									...styles.border,
									textAlign: "start",
									fontWeight: "800",
									fontSize: "16px",
									paddingLeft: "10px"
								} : {
									...styles.border,
									textAlign: "end",
									fontWeight: "800",
									fontSize: "16px",
									paddingRight: "10px"
								}} colSpan={2}>
									<Translate value="vesselReport.vesselReportCargoTable.totalPounds" />
								</TableCell>
								<TableCell style={{ ...styles.border, fontSize: "16px" }}>
									{cargo.reduce((cur, acc) => { return cur + acc.weight; }, 0)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
			) : <Fragment />}
			<div style={dir == "rtl" ? styles.buttonBoxRTL : styles.buttonBox}>
				<Fab
					style={{ height: 30, width: 30, minHeight: "unset" }}
					color="primary"
					size="small"
					onClick={handleAddCargo}
				>
					<Add fontSize="small" />
				</Fab>
				<Typography variant="body1" style={dir == "rtl" ? { marginRight: 8 } : { marginLeft: 8 }}>
					<Translate value="vesselReport.vesselReportCargoTable.addCargoBtn" />
				</Typography>
			</div>
		</Fragment>
	);
};

VesselReportCargoTable.propTypes = propTypes;
VesselReportCargoTable.defaultProps = defaultProps;

export default withStyles(styles)(VesselReportCargoTable);