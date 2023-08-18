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
import { validate } from "../../../shared/utility/validate";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
	select: {
		paddingRight: "0!important"
	},
	icon: {
		right: "unset!important",
		left: "0!important"
	}
});

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
	mmsiRequired: PropTypes.bool.isRequired,
	dir: PropTypes.string
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
	mmsiRequired,
	dir
}) => {
	const [vesselTypes, setVesselTypes] = useState([]);
	const [vesselActivities, setVesselActivities] = useState([]);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [queryBy, setQueryBy] = useState("");
	const { grt, loa, mmsid, imo, name, type, draft, voyageNumber } = vessel;
	const primaryActivityId = primaryActivity ? primaryActivity.id : "";
	const classes = useStyles();

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
		if (query != "") {
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
		}
		else {
			setResults([]);
		}
	}, [query, queryBy]);
	const search = function (value) {
		setQuery(value);
	};

	const handleQuery = (key, type) => e => {
		handleChange(key, type)(e);
		
		const searchString = e.target.value;
		debounce(() => {
			search(searchString);
		}, 400);
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
				<Translate value="formPanel.vesselInfo.title" />
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
								label={getTranslation("formPanel.vesselInfo.fieldLabel.inward")}
								value={cargoDirection}
								style={dir == "rtl" ? { marginLeft: 16, marginRight: -11 } : {}}
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
								label={getTranslation("formPanel.vesselInfo.fieldLabel.outward")}
								value={cargoDirection}
								style={dir == "rtl" ? { marginLeft: 16, marginRight: -11 } : {}}
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
						label={getTranslation("formPanel.vesselInfo.fieldLabel.vesselName")}
						value={name}
						handleSelect={handleSelect}
						handleSearch={handleQuery("name", "vessel")}
						results={results}
						required={true}
						autoFocus={true}
						dir={dir}
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
						label={getTranslation("formPanel.vesselInfo.fieldLabel.officialNumber")}
						value={imo}
						handleSelect={handleSelect}
						handleSearch={handleQuery("imo", "vessel")}
						results={imos}
						error={!validate("number", imo)}
						required={imoRequired}
						dir={dir}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={3} xs={12}>
					<FormControl margin="normal" fullWidth>
						<InputLabel style={dir && dir == "rtl" ? { left: "unset", transformOrigin: "top right" } : {}}>{<Translate value="formPanel.vesselInfo.fieldLabel.vesselType" />}</InputLabel>
						<Select value={type} onChange={handleChange("type", "vessel")}
							inputProps={{
								classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
							}}>
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
						label={getTranslation("formPanel.vesselInfo.fieldLabel.loa")}
						value={loa}
						handleChange={handleChange("loa", "vessel")}
						required={true}
						error={!validate("loa", loa)}
						dir={dir}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={voyageNumberEnabled ? 2 : 3} xs={12}>
					<TextField
						id="grt"
						label={getTranslation("formPanel.vesselInfo.fieldLabel.grt")}
						value={grt}
						handleChange={handleChange("grt", "vessel")}
						error={!validate("grt", grt)}
						dir={dir}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={voyageNumberEnabled ? 2 : 3} xs={12}>
					<TextField
						id="draft"
						label={getTranslation("formPanel.vesselInfo.fieldLabel.draft")}
						value={draft}
						handleChange={handleChange("draft", "vessel")}
						error={!validate("draft", draft)}
						dir={dir}
					/>
				</Grid>
				{voyageNumberEnabled &&
					<Grid item style={{ paddingBottom: 0 }} sm={3} xs={12}>
						<TextField
							id="voyage-number"
							label={getTranslation("formPanel.vesselInfo.fieldLabel.voyageNumber")}
							value={voyageNumber ? voyageNumber : ""}
							handleChange={handleChange("voyageNumber", "vessel")}
							required={voyageNumberRequired}
							error={!validate("voyageNumber", voyageNumber)}
							dir={dir}
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
						label={getTranslation("formPanel.vesselInfo.fieldLabel.mmsiNumber")}
						value={mmsid}
						handleSelect={handleSelect}
						handleSearch={handleQuery("mmsid", "vessel")}
						results={mmsids}
						required={mmsiRequired}
						dir={dir}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} sm={4} xs={12}>
					<FormControl margin="normal" fullWidth>
						<InputLabel style={dir && dir == "rtl" ? { left: "unset", transformOrigin: "top right" } : {}}>{<Translate value="formPanel.vesselInfo.fieldLabel.primaryActivity" />}</InputLabel>
						<Select value={primaryActivityId} onChange={handleChange("id", "primaryActivity")} inputProps={{
							classes: (dir && dir == "rtl" ? { icon: classes.icon } : {})
						}}>
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
