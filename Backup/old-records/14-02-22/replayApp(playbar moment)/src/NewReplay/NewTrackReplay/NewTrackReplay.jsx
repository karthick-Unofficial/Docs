import React, { memo, useState, Fragment, useEffect } from "react";
// components
import { SelectField, Dialog, DateTimePicker } from "orion-components/CBComponents";
import SearchSelectField from "../../shared/components/SearchSelectField";
// material-ui
import { Checkbox, FormControlLabel, TextField, Button, Divider, Slider } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";
import { restClient } from "client-app-core";
import moment from "moment-timezone";
// router
import { browserHistory } from "react-router";
import { renderToStaticMarkup } from "react-dom/server";
import debounce from "debounce";
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




const NewTrackReplay = () => {
	const [replayFrameOpen, toggleReplayFrame] = useState(false);
	const [replayFrameValue, setReplayFrameValue] = useState("clip-duration");
	const [clipDurationSelection, toggleClipDurationSelection] = useState(false);
	const [clipDuration, setClipDuration] = useState(10);
	const [beginningDate, setBeginningDate] = useState(moment());
	const [endDate, setEndDate] = useState(moment());
	const [query, setQuery] = useState(null);
	const [trackResults, setTrackResults] = useState([]);
	const [track, setTrack] = useState(null);
	const [error, setError] = useState(false);
	const [distanceBuffer, setDistanceBuffer] = useState(.50);
	const [allowDistanceBuffer, toggleDistanceBuffer] = useState(false);

	const placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value} />);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	useEffect(() => {
		if (query) {
			restClient.exec_get(
				`/ecosystem/api/feedEntities?q=${query}`,
				(err, response) => {
					if (err) {
						console.log("ERROR", err);
					} else {
						setTrackResults(response);
					}
				}
			);
		}
		if (!query && trackResults && trackResults.length) {
			setTrackResults([]);
		}
	}, [query, trackResults]);

	const handleQuery = e => {
		setQuery(e.target.value);
	};
	const handleChange = name => e => {
		console.log(e);
	};	
	const handleSearch = debounce(handleQuery, 500);
	const tracks = trackResults.map(result => {
		const { id, entityData } = result;
		return { id, name: entityData.properties.name };
	});
	const trackValue = !track
		? ""
		: // track and track data - Full access
		track && track.entityData
			? track.entityData.properties.name
			: // Otherwise, track was hidden and will display "[Hidden track]" string
			track;
	return (
		<Dialog
			open={true}
			title={<h3><Translate value="newReplay.newTrackReplay.buffer" /></h3>}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: 15,
				width: 600
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 50 }}>
				<div style={{ width: "50%" }}>
					<SearchSelectField
						id={"tack-select"}
						value={trackValue}
						label={<Translate value="newReplay.newTrackReplay.search" />}
						disabled={false}
						handleClear={() => console.log("clear")}
						handleSelect={handleChange("trackId")}
						handleSearch={handleSearch}
						results={tracks}
					/>
				</div>
				<div style={{ marginTop: 5, width: "40%" }}>
					<FormControlLabel
						control={<Checkbox color="primary" checked={allowDistanceBuffer} onChange={() => toggleDistanceBuffer(!allowDistanceBuffer)} />}
						label={<Translate value="newReplay.newTrackReplay.trackDistance" />}
					/>
					<Slider
						value={distanceBuffer}
						disabled={!allowDistanceBuffer}
						min={0}
						max={1}
						step={.05}
						onChange={(e, value) => setDistanceBuffer(value)} />
				</div>
			</div>
			<Divider />
			<div style={{
				width: "100%",
				marginBottom: 30,
				marginTop: 35
			}}>
				<h3 style={{ marginBottom: 30 }}><Translate value="newReplay.newTrackReplay.timeParams" /></h3>
				<SelectField
					id="authtype"
					label={<Translate value="newReplay.newTrackReplay.replayFrame" />}
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
					items={[{ value: `${placeholderConverter("newReplay.newTrackReplay.clipDuration")}`, id: "clip-duration" }, { value:`${placeholderConverter("newReplay.newTrackReplay.dateRange")}`, id: "date-range" }]}
					open={replayFrameOpen}
					controlled={true}
				/>
				<div style={{ ...styles.selectDivStyles, marginTop: 30, width: replayFrameValue === "clip-duration" ? "70%" : "100%" }}>

					{replayFrameValue === "clip-duration" ? (
						<Fragment>
							<TextField
								id="date/time"
								label={<Translate value="newReplay.newTrackReplay.startDate" />}
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
								label={<Translate value="newReplay.newTrackReplay.clipDuration" />}
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
								<DateTimePicker format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setBeginningDate(time)} value={beginningDate} label={<Translate value="newReplay.newTrackReplay.startDate" />} />
							</div>
							<div style={{ marginTop: -16, width: 170 }}>
								<DateTimePicker minDate={beginningDate} format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setEndDate(time)} value={endDate} label={<Translate value="newReplay.newTrackReplay.endDate" />} />
							</div>
							<TextField
								id="duration"
								label={<Translate value="newReplay.newTrackReplay.duration" />}
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
						<Translate value="newReplay.newTrackReplay.cancel" />
					</Button>
					<Button style={{ height: 40, width: 130 }} variant="contained" color="primary">
						<Translate value="newReplay.newTrackReplay.loadReplay" />
					</Button>
				</div>
			</div>
		</Dialog>

	);
};

NewTrackReplay.propTypes = propTypes;
NewTrackReplay.defaultProps = defaultProps;

export default memo(NewTrackReplay);
