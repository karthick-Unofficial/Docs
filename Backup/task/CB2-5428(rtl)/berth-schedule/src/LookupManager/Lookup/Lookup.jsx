import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	Button,
	Divider,
	IconButton,
	InputAdornment,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography
} from "@mui/material";
import Row from "./Row/Row";
import { Cancel, Search } from "@mui/icons-material";
import { restClient } from "client-app-core";
import _ from "lodash";
import { Translate } from "orion-components/i18n";

const propTypes = {
	endpoint: PropTypes.string.isRequired,
	fields: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	canManage: PropTypes.bool.isRequired,
	dir: PropTypes.string
};

const Lookup = ({ type, endpoint, fields, canManage, dir }) => {
	const [data, setData] = useState([]);
	const [searchString, setSearchString] = useState("");
	const [query, setQuery] = useState("");
	const [vesselTypes, setVesselTypes] = useState([]);
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

	const newData = {
		..._.mapValues(fields, () => ""),
		adding: true
	};

	useEffect(() => {
		if (Object.keys(fields).includes("type")) {
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
		}
	}, [fields]);

	useEffect(() => {
		restClient.exec_get(
			`/berth-schedule-app/api/${endpoint}/query/by${_.upperFirst(
				type
			)}Data?searchProps=${_.filter(
				_.keys(fields),
				key => fields[key].searchBy
			).join(",")}&searchString=${query}`,
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					if (Array.isArray(response)) {
						setData(response);
					}
				}
			}
		);
	}, [endpoint, fields, query, type]);

	const handleAdd = () => {
		setData([newData, ...data]);
	};

	const handleRemove = useCallback(
		i => {
			setData(data.filter((datum, index) => index !== i));
		},
		[data]
	);

	const search = value => {
		setQuery(value);
	};

	const handleQuery = e => {
		const searchString = e.target.value;
		setSearchString(searchString);
		debounce(() => {
			search(searchString);
		}, 400);
	};

	const localTypeSingle = _.startCase(type);
	// -- if this is something we do often, we might want to look into the NPM library 'pluralize' - CD
	const localTypePlural = `${localTypeSingle.endsWith("y") ? `${localTypeSingle.substring(0, localTypeSingle.length - 1)}ies` : `${localTypeSingle}s`}`;
	const filteredValues = _.filter(fields, field => field.searchBy);

	const styles = {
		typography: {
			...(dir == "rtl" ? { marginLeft: 24 } : { marginRight: 24 })
		},
		inputLabelProps: {
			fontSize: "14px",
			...(dir && dir == "rtl" && { left: "unset", transformOrigin: "top right" })
		},
		tableCell: {
			color: "#fff",
			fontSize: "12px",
			...(dir == "rtl" && { textAlign: "right" })
		}
	};

	return (
		<Fragment>
			<div style={{ paddingBottom: 12, display: "flex", alignItems: "center" }}>
				<Typography style={styles.typography} variant="h5">
					{<Translate value="lookupManager.lookUp.manageType" count={localTypePlural} />}
				</Typography>
				{canManage ? (
					<Button
						onClick={handleAdd}
						color="primary"
						style={{ textTransform: "none" }}
					>
						{<Translate value="lookupManager.lookUp.addRecord" count={localTypeSingle} />}
					</Button>
				) : (
					null
				)}
			</div>
			<Divider />
			<div style={{ width: 400, paddingBottom: 36 }}>
				<TextField
					fullWidth
					margin="normal"

					label={
						<div>
							<Translate value="lookupManager.lookUp.searchBy" />{" "}
							{_.map(filteredValues, (field, key) => {
								const { display } = field;
								return (
									<span>
										{display}
										{key < filteredValues.length - 1 ? ", " : ""}
									</span>
								);
							})}
						</div>
					}
					autoFocus={true}
					value={searchString}
					onChange={handleQuery}
					variant="standard"
					InputProps={{
						endAdornment: (
							<InputAdornment position={dir == "rtl" ? "start" : "end"}>
								<IconButton
									disabled={searchString.length === 0}
									onClick={() => {
										setQuery("");
										setSearchString("");
									}}
								>
									{searchString.length > 0 ? <Cancel /> : <Search />}
								</IconButton>
							</InputAdornment>
						)
					}}
					InputLabelProps={{
						style: styles.inputLabelProps
					}}
				/>
			</div>
			{!!data.length && (
				<Fragment>
					<Typography style={{ paddingBottom: 24 }} variant="caption">
						<Translate value="lookupManager.lookUp.requiredFields" />
					</Typography>
					<Table>
						<TableHead>
							<TableRow style={{ height: "auto" }}>
								{_.map(fields, (field, key) => {
									const { display, required } = field;
									return (
										<TableCell key={key} style={styles.tableCell}>
											{display}
											{required && "*"}
										</TableCell>
									);
								})}
								{canManage ? (
									<TableCell style={{ ...styles.tableCell, padding: "4px 0px 4px 12px" }}>
										<Translate value="lookupManager.lookUp.delete" />
									</TableCell>
								) : (
									null
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((datum, index) => {
								const { id } = datum;
								return (
									<Row
										fields={fields}
										endpoint={endpoint}
										key={id || index}
										datum={datum}
										index={index}
										remove={handleRemove}
										vesselTypes={vesselTypes}
										canManage={canManage}
										dir={dir}
									/>
								);
							})}
						</TableBody>
					</Table>
				</Fragment>
			)}
		</Fragment>
	);
};

Lookup.propTypes = propTypes;

export default memo(Lookup);
