import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { restClient } from "client-app-core";
import { TextField } from "orion-components/CBComponents";
import SearchSelectField from "../../../shared/components/SearchSelectField";
import {
	Fab,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Typography
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import debounce from "debounce";
import { validate } from "../../../shared/utility/validate";

const propTypes = {
	barges: PropTypes.array.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired
};

const BargeFields = ({ barges, handleUpdate }) => {
	const [vesselTypes, setVesselTypes] = useState([]);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [queryBy, setQueryBy] = useState("");
	useEffect(() => {
		restClient.exec_get(
			"/berth-schedule-app/api/vesselTypes",
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					setVesselTypes(response);
				}
			}
		);
	}, [setVesselTypes]);
	useEffect(() => {
		restClient.exec_get(
			`/berth-schedule-app/api/barges/query/byBargeData?searchProps=${queryBy}&searchString=${query}`,
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
	}, [query, queryBy]);
	const newBarge = {
		grt: "",
		loa: "",
		name: "",
		registry: "",
		type: ""
	};
	const handleAddBarge = () => {
		const newBargeData = [...barges, newBarge];
		handleUpdate("barges", newBargeData);
	};
	const handleUpdateBarge = (index, key) => e => {
		const newBargeData = [...barges];
		newBargeData[index] = { ...newBargeData[index], [key]: e.target.value };
		handleUpdate("barges", newBargeData);
	};
	const handleRemoveBarge = i => {
		const newBargeData = barges.filter((barge, index) => index !== i);
		handleUpdate("barges", newBargeData);
	};
	const handleSelect = index => id => {
		const newBargeData = [...barges];
		const newBarge = results.find(result => result.id === id);
		newBargeData[index] = newBarge;
		handleUpdate("barges", newBargeData);
	};
	const search = value => {
		setQuery(value);
	};
	const handleSearch = debounce(search, 200);
	const handleQuery = (index, key) => e => {
		const newBargeData = [...barges];
		newBargeData[index] = { ...newBargeData[index], [key]: e.target.value };
		handleUpdate("barges", newBargeData);
		handleSearch(e.target.value);
		if (!e.target.value) {
			newBargeData[index] = newBarge;
			handleUpdate("barges", newBargeData);
		}
	};
	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				Barge Information
			</Typography>
			<Grid style={{ padding: "0px 16px 24px 16px" }} container spacing={3}>
				{barges.length ? (
					barges.map((barge, index) => {
						const { grt, id, loa, name, registry, type } = barge;
						return (
							<Fragment key={index}>
								<Grid
									onFocus={() => setQueryBy("name")}
									item
									style={{ paddingBottom: 0 }}
									sm={4}
									xs={12}
								>
									<SearchSelectField
										key="barge-name"
										id="barge-name"
										label="Barge Name"
										value={name}
										handleSearch={handleQuery(index, "name")}
										handleSelect={handleSelect(index)}
										results={results}
										required={true}
										disabled={!!id}
										autoFocus={true}
									/>
								</Grid>
								<Grid
									onFocus={() => setQueryBy("registry")}
									item
									style={{ paddingBottom: 0 }}
									sm={4}
									xs={12}
								>
									<SearchSelectField
										key="barge-number"
										id="barge-number"
										label="Barge IMO / Official Num"
										value={registry}
										handleSearch={handleQuery(index, "registry")}
										handleSelect={handleSelect(index)}
										results={results.map(result => {
											return { id: result.id || index, name: result.registry };
										})}
										required={true}
										disabled={!!id}
									/>
								</Grid>
								<Grid
									onFocus={() => setQueryBy("type")}
									item
									style={{ paddingBottom: 0 }}
									sm={4}
									xs={12}
								>
									<FormControl margin="normal" fullWidth>
										<InputLabel>Barge Type</InputLabel>
										<Select
											value={type}
											onChange={handleUpdateBarge(index, "type")}
										>
											{vesselTypes.map(type => {
												const { id, name } = type;
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
									<TextField
										id="loa"
										label="LOA (ft)"
										value={loa}
										handleChange={handleUpdateBarge(index, "loa")}
										error={!validate("loa", loa)}
										required={true}
									/>
								</Grid>
								<Grid item style={{ paddingBottom: 0 }} sm={4} xs={12}>
									<TextField
										id="grt"
										label="GRT"
										value={grt}
										handleChange={handleUpdateBarge(index, "grt")}
										error={!validate("grt", grt)}
									/>
								</Grid>
								<Grid
									item
									style={{
										display: "flex",
										alignItems: "flex-end",
										paddingBottom: 0
									}}
									sm={4}
									xs={12}
								>
									<IconButton
										style={{ height: 48 }}
										onClick={() => handleRemoveBarge(index)}
									>
										<Delete />
									</IconButton>
								</Grid>
							</Fragment>
						);
					})
				) : (
					<Grid item xs={12}>
						<Typography
							style={{ paddingTop: 16 }}
							align="center"
							variant="caption"
						>
							Click button to add barge information
						</Typography>
					</Grid>
				)}
				<Grid item style={{ paddingBottom: 0 }} xs={12}>
					<div
						style={{
							marginRight: "auto",
							display: "flex",
							alignItems: "center"
						}}
					>
						<Fab
							onClick={handleAddBarge}
							style={{ height: 30, width: 30, minHeight: "unset" }}
							color="primary"
							size="small"
						>
							<Add fontSize="small" />
						</Fab>
						<Typography variant="body1" style={{ marginLeft: 8 }}>
							Add Barge
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
};

BargeFields.propTypes = propTypes;

export default memo(BargeFields);
