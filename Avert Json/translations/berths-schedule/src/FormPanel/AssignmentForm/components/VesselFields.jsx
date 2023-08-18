import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { restClient } from "client-app-core";
import { TextField } from "orion-components/CBComponents";
import SearchSelectField from "../../../shared/components/SearchSelectField";
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography
} from "@material-ui/core";
import debounce from "debounce";
import { validate } from "../../../shared/utility/validate";

const propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired,
	vessel: PropTypes.object.isRequired,
	primaryActivity: PropTypes.object,
	cargoDirectionEnabled: PropTypes.bool,
	cargoDirection: PropTypes.string,
	voyageNumberEnabled: PropTypes.bool.isRequired,
	voyageNumberRequired: PropTypes.bool,
	imoRequired: PropTypes.bool.isRequired,
	mmsiRequired: PropTypes.bool.isRequired
};

const defaultProps = {
	cargoDirection: ""
};

const VesselFields = ({
	handleChange,
	handleUpdate,
	vessel,
	primaryActivity,
	cargoDirectionEnabled,
	cargoDirection,
	voyageNumberEnabled,
	voyageNumberRequired,
	imoRequired,
	mmsiRequired
}) => {
	const [vesselTypes, setVesselTypes] = useState([]);
	const [vesselActivities, setVesselActivities] = useState([]);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [queryBy, setQueryBy] = useState("");
	const { grt, loa, mmsid, imo, name, type, draft, voyageNumber } = vessel;
	const primaryActivityId = primaryActivity ? primaryActivity.id : "";
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
			"/berth-schedule-app/api/vesselActivities",
			(err, response) => {
				if (err) {
					console.log("ERROR", err);
				} else {
					setVesselActivities(response);
				}
			}
		);
	}, [setVesselActivities]);
	useEffect(() => {
		restClient.exec_get(
			`/berth-schedule-app/api/vessels/query/byVesselData?searchProps=${queryBy}&searchString=${query}&limit=10`,
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
	const search = value => {
		setQuery(value);
	};
	const handleSearch = debounce(search, 200);
	const handleQuery = (key, type) => e => {
		handleChange(key, type)(e);
		handleSearch(e.target.value);
	};
	const handleSelect = id => {
		const newVessel = results.find(result => result.id === id);
		handleUpdate("vessel", newVessel);
	};
	const imos = results.map(result => {
		const { id, imo } = result;
		return { id, name: imo };
	});
	const mmsids = results.map(result => {
		const { id, mmsid } = result;
		return { id, name: mmsid };
	});
	const vesselSelected = !!(name && mmsid && mmsid.length === 9);
	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				Vessel Information
			</Typography>
			<Grid style={{ padding: "0px 16px 24px 16px" }} container spacing={3}>
				{cargoDirectionEnabled && (
					<Grid item style={{ paddingBottom: 0 }} xs={12}>
						<FormGroup style={{ flexWrap: "nowrap" }} row>
							<FormControlLabel
								control={
									<Checkbox
										value="inward"
										checked={cargoDirection === "inward"}
										color="primary"
										onChange={handleChange("cargoDirection")}
									/>
								}
								label="Inward"
								value={cargoDirection}
							/>
							<FormControlLabel
								control={
									<Checkbox
										value="outward"
										checked={cargoDirection === "outward"}
										color="primary"
										onChange={handleChange("cargoDirection")}
									/>
								}
								label="Outward"
								value={cargoDirection}
							/>
						</FormGroup>
					</Grid>
				)}
				<Grid
					onFocus={() => setQueryBy("name")}
					item
					style={{ paddingBottom: 0 }}
					sm={4}
					xs={12}
				>
					<SearchSelectField
						disabled={vesselSelected}
						key="vessel-name"
						id="vessel-name"
						label="Vessel or Tug Name"
						value={name}
						handleSelect={handleSelect}
						handleSearch={handleQuery("name", "vessel")}
						results={results}
						required={true}
						autoFocus={true}
					/>
				</Grid>
				<Grid
					onFocus={() => setQueryBy("imo")}
					item
					style={{ paddingBottom: 0 }}
					sm={4}
					xs={12}
				>
					<SearchSelectField
						key="imo"
						id="imo"
						label="IMO / Official Number"
						value={imo}
						handleSelect={handleSelect}
						handleSearch={handleQuery("imo", "vessel")}
						results={imos}
						error={!validate("number", imo)}
						required={imoRequired}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={3} xs={12}>
					<FormControl margin="normal" fullWidth>
						<InputLabel>Vessel Type</InputLabel>
						<Select value={type} onChange={handleChange("type", "vessel")}>
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
				<Grid item style={{ paddingBottom: 0 }} sm={voyageNumberEnabled ? 2 : 3} xs={12}>
					<TextField
						id="loa"
						label="LOA (ft)"
						value={loa}
						handleChange={handleChange("loa", "vessel")}
						required={true}
						error={!validate("loa", loa)}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={voyageNumberEnabled ? 2 : 3} xs={12}>
					<TextField
						id="grt"
						label="GRT"
						value={grt}
						handleChange={handleChange("grt", "vessel")}
						error={!validate("grt", grt)}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={voyageNumberEnabled ? 2 : 3} xs={12}>
					<TextField
						id="draft"
						label="Draft (ft)"
						value={draft}
						handleChange={handleChange("draft", "vessel")}
						error={!validate("draft", draft)}
					/>
				</Grid>
				{voyageNumberEnabled &&
					<Grid item style={{ paddingBottom: 0 }} sm={3} xs={12}>
						<TextField
							id="voyage-number"
							label="Voyage Number"
							value={voyageNumber ? voyageNumber : ""}
							handleChange={handleChange("voyageNumber", "vessel")}
							required={voyageNumberRequired}
							error={!validate("voyageNumber", voyageNumber)}
						/>
					</Grid>
				}
				<Grid
					onFocus={() => setQueryBy("mmsid")}
					item
					style={{ paddingBottom: 0 }}
					sm={4}
					xs={12}
				>
					<SearchSelectField
						disabled={vesselSelected}
						key="mmsid"
						id="mmsid"
						label="MMSI Number"
						value={mmsid}
						handleSelect={handleSelect}
						handleSearch={handleQuery("mmsid", "vessel")}
						results={mmsids}
						required={mmsiRequired}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={4} xs={12}>
					<FormControl margin="normal" fullWidth>
						<InputLabel>Primary Vessel Activity</InputLabel>
						<Select value={primaryActivityId} onChange={handleChange("id", "primaryActivity")}>
							{vesselActivities.map(vesselActivity => {
								const { id, activity } = vesselActivity;
								return (
									<MenuItem key={id} value={id}>
										{activity}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
		</Fragment>
	);
};

VesselFields.propTypes = propTypes;
VesselFields.defaultProps = defaultProps;

export default memo(VesselFields);
