import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	Button,
	Divider,
	FormControl,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import Row from "./Row/Row";
import { Cancel, Search } from "@material-ui/icons";
import { restClient } from "client-app-core";
import _ from "lodash";

const propTypes = {
	endpoint: PropTypes.string.isRequired,
	fields: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	canManage: PropTypes.bool.isRequired
};

const Lookup = ({ type, endpoint, fields, canManage }) => {
	const [data, setData] = useState([]);
	const [query, setQuery] = useState("");
	const [vesselTypes, setVesselTypes] = useState([]);
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
	const handleSearch = e => {
		setQuery(e.target.value);
	};
	const localTypeSingle = _.startCase(type);
	// -- if this is something we do often, we might want to look into the NPM library 'pluralize' - CD
	const localTypePlural = `${localTypeSingle.endsWith("y") ? `${localTypeSingle.substring(0, localTypeSingle.length-1)}ies` : `${localTypeSingle}s`}`;
	return (
		<Fragment>
			<div style={{ paddingBottom: 12, display: "flex", alignItems: "center" }}>
				<Typography style={{ marginRight: 24 }} variant="h5">
					{`Manage ${localTypePlural}`}
				</Typography>
				{canManage ? (
					<Button
						onClick={handleAdd}
						color="primary"
						style={{ textTransform: "none" }}
					>
						{`Add New ${localTypeSingle} Record`}
					</Button>
				):(
					null
				)}
			</div>
			<Divider />
			<div style={{ width: 400, paddingBottom: 36 }}>
				<FormControl fullWidth margin="normal">
					<InputLabel>{`Search by ${_.map(
						_.filter(fields, field => field.searchBy),
						field => field.display
					).join(", ")}`}</InputLabel>
					<Input
						autoFocus={true}
						value={query}
						onChange={handleSearch}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									disabled={query.length === 0}
									onClick={() => setQuery("")}
								>
									{query.length > 0 ? <Cancel /> : <Search />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</div>
			{!!data.length && (
				<Fragment>
					<Typography style={{ paddingBottom: 24 }} variant="caption">
						* Required fields
					</Typography>
					<Table>
						<TableHead>
							<TableRow style={{ height: "auto" }}>
								{_.map(fields, (field, key) => {
									const { display, required } = field;
									return (
										<TableCell key={key}>
											{display}
											{required && "*"}
										</TableCell>
									);
								})}
								{canManage ? (
									<TableCell style={{ padding: "4px 0px 4px 12px" }}>
										Delete
									</TableCell>
								):(
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
