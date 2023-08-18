import React, { Fragment, useState } from "react";
import { restClient } from "client-app-core";
import PropTypes from "prop-types";
import { Add, Delete } from "@mui/icons-material";
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
	Select,
	MenuItem
} from "@mui/material";
import Typeahead from "../Typeahead/Typeahead";
import { Translate } from "orion-components/i18n";
import { makeStyles } from "@mui/styles";

const propTypes = {
	cargo: PropTypes.array.isRequired,
	updateCargo: PropTypes.func.isRequired,
	removeCargo: PropTypes.func.isRequired,
	cargoDirectionEnabled: PropTypes.bool,
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const defaultProps = {
	cargo: [],
	updateCargo: () => { },
	removeCargo: () => { }
};

const useStyles = makeStyles({
	icon: {
		right: "unset!important",
		left: "0!important"
	},
	select: {
		paddingRight: "0!important"
	}
});

const CargoTable = ({
	cargo,
	updateCargo,
	cargoDirectionEnabled,
	removeCargo,
	dir
}) => {
	const classes = useStyles();

	const [shipperReceiverResults, setShipperReceiverResults] = useState([]);
	const [debouncer, setDebouncer] = useState(null);

	const debounce = (fn, delay) => {

		if (debouncer) {
			clearTimeout(debouncer);
		}
		setDebouncer({
			debouncer: setTimeout(() => {
				fn();
				setDebouncer(null);
			}, delay)
		});

	};

	const handleAddCargo = () => {
		const cargoTemplate = {
			id: cargo.length,
			commodity: "",
			shipperReceiver: { company: "" },
			weight: 0,
			cargoDirection: cargoDirectionEnabled ? "inward" : null
		};
		const newCargoData = [...cargo, cargoTemplate];
		updateCargo(newCargoData);
	};

	const handleUpdateCargo = (index, key, select) => e => {
		const newCargoData = [...cargo];
		if (select) {
			newCargoData[index] = {
				...newCargoData[index],
				shipperReceiver: e
			};
		}
		else if (key === "shipperReceiver") {
			const value = e.target.value;
			newCargoData[index] = { ...newCargoData[index], shipperReceiver: { company: value } };
		}
		else {
			let value = e.target.value;

			if (key === "weight") {
				value = parseFloat(value);
			}
			newCargoData[index] = { ...newCargoData[index], [key]: value };
		}
		updateCargo(newCargoData);
	};

	const handleClearShipperReceiver = (index) => () => {
		const newCargoData = [...cargo];
		newCargoData[index].shipperReceiver = { company: "" };

		updateCargo(newCargoData);
	};

	const handleRemoveCargo = id => {
		removeCargo(id);
	};

	const queryShipperReceiver = (searchString) => {
		if (searchString !== "") {
			restClient.exec_get(
				`/berth-request-app/api/request/queryShipperReceiver?searchProps=company&searchString=${searchString}`,
				(err, res) => {
					if (err) {
						console.log("Shipper/Receiver query err", err);
					}
					else {
						const result = {};
						res.forEach(shipperReceiver => {
							result[shipperReceiver.id] = {
								searchString: `${shipperReceiver.company}`,
								label: `${shipperReceiver.company}`,
								id: shipperReceiver.id,
								fullData: shipperReceiver
							};
						});
						setShipperReceiverResults(result);
					}
				}
			);
		}
		else {
			setShipperReceiverResults({});
		}
	};

	const handleQuery = (searchString) => {
		debounce(() => {
			queryShipperReceiver(searchString);
		}, 400);
	};

	const styles = {
		border: {
			border: "1px solid #515151",
			...(dir === "rtl" && { textAlign: "right" })
		},
		buttonBox: {
			...(dir === "rtl" && { marginLeft: "auto" }),
			...(dir === "ltr" && { marginRight: "auto" }),
			display: "flex",
			alignItems: "center",
			marginBottom: "50px"
		},
		delete: {
			...(dir === "rtl" && { padding: "4px 7px 4px 0px" }),
			...(dir === "ltr" && { padding: "4px 0px 4px 7px" })
		},
		typography: {
			...(dir === "rtl" && { marginRight: 8 }),
			...(dir === "ltr" && { marginLeft: 8 })
		}
	};

	return (
		<Fragment>
			{cargo.length ? (
				<Grid item style={{ paddingBottom: 0, marginBottom: "20px" }} lg={12}>
					<Table>
						<TableHead>
							<TableRow style={{ height: "auto" }}>
								<TableCell style={styles.border}><Translate value="berthRequestForm.cargoTable.table.head.cargo" /></TableCell>
								{cargoDirectionEnabled && (<TableCell style={styles.border}><Translate value="berthRequestForm.cargoTable.table.head.direction" /></TableCell>)}
								<TableCell style={styles.border}><Translate value="berthRequestForm.cargoTable.table.head.weight" /></TableCell>
								<TableCell style={styles.border}><Translate value="berthRequestForm.cargoTable.table.head.shipper" /></TableCell>
								<TableCell style={{ ...styles.border, ...styles.delete }}>
									<Translate value="berthRequestForm.cargoTable.table.head.delete" />
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody style={styles.border}>
							{cargo.map((c, index) => {
								const { commodity, id, shipperReceiver, weight, cargoDirection } = c;
								return (
									<TableRow key={index}>
										<TableCell style={styles.border}>
											<TextField
												variant="standard"
												value={commodity}
												onChange={handleUpdateCargo(index, "commodity")}
											/>
										</TableCell>
										{cargoDirectionEnabled && (
											<TableCell style={styles.border}>
												<Select variant="standard" value={cargoDirection} onChange={handleUpdateCargo(index, "cargoDirection")} inputProps={{
													classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
												}}>
													<MenuItem key="inward" value="inward"><Translate value="berthRequestForm.cargoTable.fieldLabel.inward" /></MenuItem>
													<MenuItem key="outward" value="outward"><Translate value="berthRequestForm.cargoTable.fieldLabel.outward" /></MenuItem>
												</Select>
											</TableCell>
										)}
										<TableCell style={styles.border}>
											<TextField
												value={weight}
												type="number"
												variant="standard"
												onChange={handleUpdateCargo(index, "weight")}
											/>
										</TableCell>
										<TableCell
											style={styles.border}
										>
											<Typeahead
												closeOnSelect={true}
												id={`ship-receive-${index}`}
												items={shipperReceiverResults}
												selected={shipperReceiver ? shipperReceiver.company : null}
												updateState={handleUpdateCargo(index, "shipperReceiver")}
												handleSelect={handleUpdateCargo(index, "shipperReceiver", true)}
												clearSelected={handleClearShipperReceiver(index)}
												queryTypeahead={handleQuery}
												maxResults={5}
												placeholder=""
												dir={dir}
											/>
										</TableCell>
										<TableCell
											style={{ padding: 0, ...styles.border }}
										>
											<IconButton onClick={() => handleRemoveCargo(id)}>
												<Delete />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Grid>
			) : <Fragment />}
			<div style={styles.buttonBox}>
				<Fab
					style={{ height: 30, width: 30, minHeight: "unset", borderRadius: "50px", backgroundColor: "#3f51b5", color: "#fff" }}
					color="primary"
					size="small"
					onClick={handleAddCargo}
				>
					<Add fontSize="small" />
				</Fab>
				<Typography variant="body1" style={styles.typography}>
					<Translate value="berthRequestForm.cargoTable.addCargoBtn" />
				</Typography>
			</div>
		</Fragment>
	);

};

CargoTable.propTypes = propTypes;
CargoTable.defaultProps = defaultProps;

export default CargoTable;