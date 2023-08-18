import React, { memo, useState, Fragment, useEffect } from "react";
// components
import { SelectField, Dialog, DateTimePicker } from "orion-components/CBComponents";
import SearchSelectField from "../../shared/components/SearchSelectField";
// material-ui
import { TextField, Button, Divider } from "@material-ui/core";

import { restClient } from "client-app-core";
import moment from "moment-timezone";
// router
import { browserHistory } from "react-router";

const propTypes = {
};

const defaultProps = {
};

const styles = {
	selectDivStyles: {
		display: "flex",
		justifyContent: "space-between",
		maxWidth: "100%"
	}
};




const NewZoneReplay = () => {
	const [replayFrameOpen, toggleReplayFrame] = useState(false);
	const [replayFrameValue, setReplayFrameValue] = useState("clip-duration");
	const [clipDurationSelection, toggleClipDurationSelection] = useState(false);
	const [clipDuration, setClipDuration] = useState(10);
	const [beginningDate, setBeginningDate] = useState(moment());
	const [endDate, setEndDate] = useState(moment());
	const [query, setQuery] = useState(null);
	const [shapeResults, setShapeResults] = useState([]);
	const [shape, setShape] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (query !== null) {
			restClient.exec_get(
				`/ecosystem/api/shapes/by-geo-type/polygon?excludeFOV=true&onlyPublic=true&name=${query}`,
				(err, response) => {
					console.log("response: ", response);
					if (err) {
						console.log("ERROR", err);
					} else {
						setShapeResults(response);
					}
				}
			);
		}
	}, [query]);
	const handleSearch = e => {
		setQuery(e.target.value);
	};
	const handleChange = name => e => {
		console.log(e);
	};
	const shapes = shapeResults.map(result => {
		const { id, entityData } = result;
		return { id, name: entityData.properties.name };
	});
	const shapeValue = !shape
		? ""
		: // Shape and Shape data - Full access
		shape && shape.entityData
			? shape.entityData.properties.name
			: // Otherwise, shape was hidden and will display "[Hidden Shape]" string
			shape;
	return (
		<Dialog
			open={true}
			title={<h3>Select zone and set time paramerters</h3>}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: 15,
				width: 600
			}}
		>
			<div style={{ width: "50%", marginBottom: 50}}>
				<SearchSelectField
					id={"zone-select"}
					value={shapeValue}
					label={"Search"}
					disabled={false}
					handleClear={() => console.log("clear")}
					handleSelect={handleChange("shapeId")}
					handleSearch={handleSearch}
					results={shapes}
				/>
			</div>

			<Divider />
			<div style={{
				width: "100%",				
				marginBottom: 30,
				marginTop: 35
			}}>
				<h3 style={{ marginBottom: 30 }}>Enter time parameters</h3>
				<SelectField
					id="authtype"
					label="Replay Frame"
					formControlProps={{
						style: {
							marginTop: 0,
							width: 120
						}
					}}
					handleChange={event => {
						setReplayFrameValue(event.target.value);
						toggleReplayFrame(!replayFrameOpen);
					}}
					handleOpen={() => toggleReplayFrame(!replayFrameOpen)}
					value={replayFrameValue}
					items={[{ value: "Clip Duration", id: "clip-duration" }, { value: "Date Range", id: "date-range" }]}
					open={replayFrameOpen}
					controlled={true}
				/>
				<div style={{ ...styles.selectDivStyles, marginTop: 30, width: replayFrameValue === "clip-duration" ? "70%" : "100%" }}>
					{replayFrameValue === "clip-duration" ? (
						<Fragment>
							<TextField
								id="date/time"
								label="Start Date/Time"
								style={{
									width: 170
								}}
								value={moment().subtract(clipDuration, "minutes").format("MMMM D, YYYY h:mm A")}
								InputProps={{
									readOnly: true
								}}
							/>

							<SelectField
								id="clip-duration"
								label="Clip Duration"
								formControlProps={{
									style: {
										marginTop: 0,
										width: 140

									}
								}}
								handleChange={event => {
									setClipDuration(event.target.value);
									toggleClipDurationSelection(!clipDurationSelection);
								}}
								handleOpen={() => toggleClipDurationSelection(!clipDurationSelection)}
								value={clipDuration}
								items={[{ value: "10 minutes", id: 10 }, { value: "15 minutes", id: 15 }]}
								open={clipDurationSelection}
								controlled={true}
							/>
						</Fragment>

					) : (
						<Fragment>
							<div style={{ marginTop: -16, width: 170 }}>
								<DateTimePicker format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setBeginningDate(time)} value={beginningDate} label={"Start Date/Time"} />
							</div>
							<div style={{ marginTop: -16, width: 170 }}>
								<DateTimePicker minDate={beginningDate} format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setEndDate(time)} value={endDate} label={"End Date/Time"} />
							</div>
							<TextField
								id="duration"
								label="Duration"
								style={{
									width: 120
								}}
								value={`${parseInt(moment.duration(endDate.diff(beginningDate)).asHours())} hours`}
								InputProps={{
									readOnly: true,
									disableUnderline: true
								}}
							/>
						</Fragment>
					)}
				</div>
				<div style={{ alignItems: "center", display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
					<Button onClick={() => browserHistory.goBack()} style={{ height: 40, width: 130 }}>
						Cancel
					</Button>
					<Button style={{ height: 40, width: 130 }} variant="contained" color="primary">
						Load Replay
					</Button>
				</div>
			</div>
		</Dialog>

	);
};

NewZoneReplay.propTypes = propTypes;
NewZoneReplay.defaultProps = defaultProps;

export default memo(NewZoneReplay);
