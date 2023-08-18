import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { restClient } from "client-app-core";
import { TextField, SelectField } from "orion-components/CBComponents";
import SearchSelectField from "../../../shared/components/SearchSelectField";
import {
	Fab,
	Grid,
	IconButton,
	MenuItem,
	Typography
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { validate } from "../../../shared/utility/validate";
import { Translate, getTranslation } from "orion-components/i18n";
import { makeStyles } from "@mui/styles";

const propTypes = {
	barges: PropTypes.array.isRequired,
	handleUpdate: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const BargeFields = ({ barges, handleUpdate, dir }) => {
	const [vesselTypes, setVesselTypes] = useState([]);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [queryBy, setQueryBy] = useState("");
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
		if (query != "") {
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
		}
		else {
			setResults([]);
		}
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

	const handleQuery = (index, key) => e => {
		const newBargeData = [...barges];
		const searchString = e.target.value;
		newBargeData[index] = { ...newBargeData[index], [key]: searchString };
		handleUpdate("barges", newBargeData);

		debounce(() => {
			search(searchString);
		}, 400);

		if (!searchString) {
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
				<Translate value="formPanel.bargeInfo.title" />
			</Typography>
			<Grid container style={{ padding: "0px 16px 24px", margin: "-12px", width: "calc(100% + 24px)" }}>
				{barges.length ? (
					barges.map((barge, index) => {
						const { grt, id, loa, name, registry, type } = barge;
						return (
							<Fragment key={index}>
								<Grid
									onFocus={() => setQueryBy("name")}
									item
									style={{ padding: "12px 12px 0 12px" }}
									sm={4}
									xs={12}
								>
									<SearchSelectField
										key="barge-name"
										id={`barge-name-${index}`}
										label={getTranslation("formPanel.bargeInfo.fieldLabel.bargeName")}
										value={name}
										handleSearch={handleQuery(index, "name")}
										handleSelect={handleSelect(index)}
										results={results}
										required={true}
										disabled={!!id}
										autoFocus={true}
										dir={dir}
									/>
								</Grid>
								<Grid
									onFocus={() => setQueryBy("registry")}
									item
									style={{ padding: "12px 12px 0 12px" }}
									sm={4}
									xs={12}
								>
									<SearchSelectField
										key="barge-number"
										id={`barge-number-${index}`}
										label={getTranslation("formPanel.bargeInfo.fieldLabel.bargeIMO")}
										value={registry}
										handleSearch={handleQuery(index, "registry")}
										handleSelect={handleSelect(index)}
										results={results.map(result => {
											return { id: result.id || index, name: result.registry };
										})}
										required={true}
										disabled={!!id}
										dir={dir}
									/>
								</Grid>
								<Grid
									onFocus={() => setQueryBy("type")}
									item
									style={{ padding: "12px 12px 0 12px" }}
									sm={4}
									xs={12}
								>
									<SelectField
										label={getTranslation("formPanel.bargeInfo.fieldLabel.bargeType")}
										handleChange={handleUpdateBarge(index, "type")}
										value={type}
										inputProps={{ style: { fontSize: 14 } }}
										dir={dir}
									>
										{vesselTypes.map(type => {
											const { id, name } = type;
											return (
												<MenuItem key={id} value={id}>
													{name}
												</MenuItem>
											);
										})}
									</SelectField>
								</Grid>
								<Grid item style={{ padding: "12px 12px 0 12px" }} sm={4} xs={12}>
									<TextField
										id="loa"
										label={getTranslation("formPanel.bargeInfo.fieldLabel.loa")}
										value={loa}
										handleChange={handleUpdateBarge(index, "loa")}
										error={!validate("loa", loa)}
										required={true}
										dir={dir}
										inputLabelStyle={{ fontSize: 14, color: "#B5B9BE" }}
									/>
								</Grid>
								<Grid item style={{ padding: "12px 12px 0 12px" }} sm={4} xs={12}>
									<TextField
										id="grt"
										label="GRT"
										value={grt}
										handleChange={handleUpdateBarge(index, "grt")}
										error={!validate("grt", grt)}
										dir={dir}
										inputLabelStyle={{ fontSize: 14, color: "#B5B9BE" }}
									/>
								</Grid>
								<Grid
									item
									style={{
										display: "flex",
										alignItems: "flex-end",
										padding: "12px 12px 0 12px"
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
					<Grid item xs={12} style={{ padding: "12px 12px 0 12px" }}>
						<Typography
							style={{ paddingTop: 16 }}
							align="center"
							variant="caption"
						>
							<Translate value="formPanel.bargeInfo.clickToAdd" />
						</Typography>
					</Grid>
				)}
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={12}>
					<div
						style={dir == "rtl" ? {
							marginLeft: "auto",
							display: "flex",
							alignItems: "center"
						} : {
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
						<Typography variant="body1" style={dir == "rtl" ? { marginRight: 8 } : { marginLeft: 8 }}>
							<Translate value="formPanel.bargeInfo.addBargeBtn" />
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
};

BargeFields.propTypes = propTypes;

export default memo(BargeFields);
