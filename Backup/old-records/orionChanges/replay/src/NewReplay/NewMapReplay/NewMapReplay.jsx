import React, { memo, useState, useEffect, Fragment } from "react";
import { feedService } from "client-app-core";
import PropTypes from "prop-types";
import _ from "lodash";
// components
import { SelectField, Dialog, DateTimePicker } from "orion-components/CBComponents";
import ErrorBoundary from "orion-components/ErrorBoundary";
import LiveMapContainer from "./LiveMap/LiveMapContainer";
// material-ui
import { TextField, Button } from "@material-ui/core";

import moment from "moment-timezone";
// router
import { browserHistory } from "react-router";
import { appendReducer } from "../../index.js";
import {
	dataByFeed
} from "orion-components/GlobalData/Reducers";

const propTypes = {
	servicesReady: PropTypes.bool,
	durationOptions: PropTypes.array,
	identity: PropTypes.object,
	open: PropTypes.bool,
	editing: PropTypes.bool,
	toggleEditing: PropTypes.func,
	map: PropTypes.object,
	toggleMapVisible: PropTypes.func,
	subscribeExclusions: PropTypes.func,
	subscribeFeed: PropTypes.func,
	getEventTypes: PropTypes.func,
	getAllEvents: PropTypes.func,
	getGISServices: PropTypes.func,
	params: PropTypes.object,
	clearMapReferenc: PropTypes.func,
	baseMaps: PropTypes.array.isRequired
};

const defaultProps = {
	durationOptions: [5, 10],
	editing: false,
	toggleEditing: () => { }
};

const styles = {
	selectDivStyles: {
		display: "flex",
		justifyContent: "space-between",
		maxWidth: "100%"
	}
};

const NewMapReplay = ({
	servicesReady,
	identity,
	map,
	toggleMapVisible,
	subscribeFeed,
	subscribeExclusions,
	getEventTypes,
	getAllEvents,
	getGISServices,
	durationOptions,
	editing,
	toggleEditing,
	params,
	clearMapReference,
	baseMaps
}) => {
	const [replayFrameOpen, toggleReplayFrame] = useState(false);
	const [replayFrameValue, setReplayFrameValue] = useState("clip-duration");
	const [clipDurationSelection, toggleClipDurationSelection] = useState(false);
	const [clipDuration, setClipDuration] = useState(10);
	const [beginningDate, setBeginningDate] = useState(moment().subtract(clipDuration, "minutes"));
	const [endDate, setEndDate] = useState(moment());
	const [mapCoordinates, updateMapCoordinates] = useState([]);
	useEffect(() => {
		const { userId } = identity;
		async function getInts() {
			await feedService.getUserAppIntegration(userId, "map-app", (err, res) => {
				if (err) {
					console.log(err);
				}
				if (res) {
					res.forEach(feed => {
						if (feed.config.canView) {
							const geoName = "globalGeo." + feed.intId;
							const dataName = "globalData." + feed.intId;
							const geoReducer = dataByFeed(feed.intId, "globalGeo");
							const dataReducer = dataByFeed(feed.intId, "globalData");
							appendReducer(geoName, geoReducer);
							appendReducer(dataName, dataReducer);
							subscribeFeed(feed.intId);
						}
					});
				}
			});
		}
		getInts();
		getAllEvents("intermediate", ["active"]);
		getGISServices();
		toggleMapVisible();
		subscribeExclusions();
		getEventTypes();
	}, [getAllEvents, getEventTypes, getGISServices, identity, subscribeExclusions, subscribeFeed, toggleMapVisible]);

	useEffect(() => {
		if (map) {
			const mapBounds = map.getBounds();
			const northWest = mapBounds.getNorthWest();
			const southEast = mapBounds.getSouthEast();
			const coordinates = [
				[northWest.lng, northWest.lat],
				[southEast.lng, southEast.lat]
			];
			updateMapCoordinates(coordinates);
		}
	}, [map]);

	useEffect(() => {
		if (params && !_.isEmpty(params)) {
			const bd = moment(params.startDate);
			const ed = moment(params.endDate);

			setBeginningDate(bd);
			setEndDate(ed);
			updateMapCoordinates(params.coordinates);

			const minuteDiff = ed.diff(bd, "minutes");
			if (durationOptions.includes(minuteDiff)) {
				// -- set to clip duration and set value appropriately
				setReplayFrameValue("clip-duration");
				setClipDuration(minuteDiff);
			} else {
				// -- set to date range
				setReplayFrameValue("date-range");
			}
		} else {
			if (durationOptions.length) {
				setClipDuration(durationOptions[0]);
			}
		}
	}, [params, durationOptions]);

	const getDurationString = (startDate, endDate) => {
		const diff = moment.duration(endDate.diff(startDate));
		return diff.asHours() >= 1 ? `${parseInt(diff.asHours())} hours` : `${parseInt(diff.asMinutes())} minutes`;
	};

	return (
		<Dialog
			open={true}
			title={<h3>Choose time parameters. Zoom/Pan map to set Replay selection area</h3>}
			titlePropStyles={{
				textAlign: "center"
			}}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: 15,
				width: 1200,
				maxWidth: 1200
			}}
		>
			<div style={{
				display: "flex",
				justifyContent: "space-between",
				marginBottom: 30,
				marginTop: 30
			}}>
				<div style={{ ...styles.selectDivStyles, width: replayFrameValue === "clip-duration" ? "50%" : "100%" }}>
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

					{replayFrameValue === "clip-duration" ? (
						<Fragment>
							<div style={{ marginTop: -16, width: 208 }}>
								<DateTimePicker maxDate={moment()} format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setBeginningDate(time)} value={beginningDate} label={"Start Date/Time"} />
							</div>

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
								items={durationOptions.map(option => {
									return { value: `${option} minutes`, id: option };
								})}
								open={clipDurationSelection}
								controlled={true}
							/>
						</Fragment>

					) : (
						<Fragment>
							<div style={{ marginTop: -16, width: 208 }}>
								<DateTimePicker format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setBeginningDate(time)} value={beginningDate} label={"Start Date/Time"} />
							</div>
							<div style={{ marginTop: -16, width: 208 }}>
								<DateTimePicker minDate={beginningDate} format={"MMMM D, YYYY h:mm A"} handleChange={(time) => setEndDate(time)} value={endDate} label={"End Date/Time"} />
							</div>
							<TextField
								id="duration"
								label="Duration"
								style={{
									width: 120
								}}
								value={getDurationString(beginningDate, endDate)}
								InputProps={{
									readOnly: true,
									disableUnderline: true
								}}
							/>
						</Fragment>
					)}
				</div>
				<div style={{ alignItems: "center", display: "flex", paddingRight: 30 }}>
					<Button
						onClick={() => {
							editing ? toggleEditing(false) : browserHistory.goBack();
							clearMapReference();
						}}
						style={{ height: 40, width: 130 }}
					>
						Cancel
					</Button>
					<Button onClick={() => {
						let startDate = "";
						let finalDate = "";
						if (replayFrameValue === "clip-duration") {
							startDate = moment.utc(beginningDate).format();
							finalDate = moment.utc(beginningDate).add(clipDuration, "minutes").format();
						} else {
							startDate = moment.utc(beginningDate).format();
							finalDate = moment.utc(endDate).format();
						}
						const location = `${window.location.origin}/replay-app/#/replay?type=map&coordinates=${mapCoordinates}&startDate=${startDate}&endDate=${finalDate}` + `${params && params.name && params.id ? `&name=${params.name}&id=${params.id}` : ""}`;
						if (editing) {
							window.location.replace(location);
							toggleEditing(false);
							clearMapReference();
						}
						else {
							window.open(location);
						}
					}}
					style={{ height: 40, width: 130 }}
					variant="contained"
					color="primary">
						Load Replay
					</Button>
				</div>
			</div>
			<div style={{ height: 800, width: "100%" }}>
				{servicesReady && (
					<ErrorBoundary>
						<LiveMapContainer creatingReplay={true} updateMapCoordinates={updateMapCoordinates} baseMaps={baseMaps} />
					</ErrorBoundary>
				)}
			</div>

		</Dialog>

	);
};

NewMapReplay.propTypes = propTypes;
NewMapReplay.defaultProps = defaultProps;

export default memo(NewMapReplay);
