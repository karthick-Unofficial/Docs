import React, { memo, useState, useEffect, Fragment } from "react";
import { feedService } from "client-app-core";
import PropTypes from "prop-types";
import { Translate, getTranslation } from "orion-components/i18n";
import isEmpty from "lodash/isEmpty";
// components
import { SelectField, Dialog, DateTimePicker } from "orion-components/CBComponents";
import ErrorBoundary from "orion-components/ErrorBoundary";
import LiveMap from "./LiveMap/LiveMap";
// material-ui
import { TextField, Button } from "@mui/material";
import moment from "moment";
// router
import { useNavigate } from "react-router-dom";
import { appendReducer } from "../../index.js";
import {
	dataByFeed
} from "orion-components/GlobalData/Reducers";
import { useDispatch, useSelector } from "react-redux";
import { getDir, getCultureCode } from "orion-components/i18n/Config/selector";

import * as actionCreators from "./newMapReplayActions";

const propTypes = {
	editing: PropTypes.bool,
	toggleEditing: PropTypes.func,
	params: PropTypes.object
};

const defaultProps = {
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
	editing,
	toggleEditing,
	params
}) => {

	const dispatch = useDispatch();

	const {
		toggleMapVisible,
		clearMapReference,
		subscribeFeed,
		getAllEvents,
		getGISServices,
		getEventTypes,
		subscribeExclusions
	} = actionCreators;
	const baseMap = useSelector(state => state.mapState.baseMap);
	const mapRef = baseMap.mapRef;
	const clientConfig = useSelector(state => state.clientConfig);
	const baseMaps = useSelector(state => state.baseMaps);
	const servicesReady = useSelector(state => state.servicesReady);
	const identity = useSelector(state => state.session.identity);
	const map = useSelector(state => state.mapState.baseMap.mapRef);
	const durationOptions = useSelector(state => state.clientConfig.durationOptions || [5, 10]);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => getCultureCode(state));
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);

	const navigate = useNavigate();
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
							dispatch(subscribeFeed(feed.intId));
						}
					});
				}
			});
		}
		getInts();
		dispatch(getAllEvents("intermediate", ["active"]));
		dispatch(getGISServices());
		dispatch(toggleMapVisible());
		dispatch(subscribeExclusions());
		dispatch(getEventTypes());
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
		if (params && !isEmpty(params)) {
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
		return diff.asHours() >= 1 ? `${parseInt(diff.asHours()).toLocaleString(locale)} ${getTranslation("newReplay.newMapReplay.hours")}` : `${parseInt(diff.asMinutes()).toLocaleString(locale)} ${getTranslation("newReplay.newMapReplay.minutes")}`;
	};


	return (
		<Dialog
			open={true}
			title={<h3>{getTranslation("newReplay.newMapReplay.title")}</h3>}
			titlePropStyles={{
				textAlign: "center"
			}}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: "15px",
				width: "1200px",
				maxWidth: "1200px"
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
						label={getTranslation("newReplay.newMapReplay.replayFrame")}
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
						items={[{ value: `${getTranslation("newReplay.newTrackReplay.clipDuration")}`, id: "clip-duration" }, { value: `${getTranslation("newReplay.newTrackReplay.dateRange")}`, id: "date-range" }]}
						dir={dir}
						open={replayFrameOpen}
						controlled={replayFrameOpen}
						inputProps={{ style: { fontSize: 14 } }}
					/>

					{replayFrameValue === "clip-duration" ? (
						<Fragment>
							<div style={{ marginTop: -16, width: 208 }}>
								<DateTimePicker
									maxDate={moment()}
									dir={dir}
									locale={locale}
									format={`full_${timeFormatPreference}`}
									handleChange={(time) => setBeginningDate(time)}
									value={beginningDate}
									label={getTranslation("newReplay.newMapReplay.startDate")}
									okLabel={getTranslation("newReplay.replayArchive.ok")}
									cancelLabel={getTranslation("newReplay.replayArchive.cancel")}
									clearLabel={getTranslation("newReplay.replayArchive.clear")}
								/>
							</div>
							<SelectField
								id="clip-duration"
								dir={dir}
								label={getTranslation("newReplay.newMapReplay.clipDuration")}
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
									return { value: `${option.toLocaleString(locale)} ${getTranslation("newReplay.newMapReplay.minutes")}`, id: option };
								})}
								open={clipDurationSelection}
								controlled={clipDurationSelection}
								inputProps={{ style: { fontSize: 14 } }}
							/>
						</Fragment>

					) : (
						<Fragment>
							<div style={{ marginTop: -16, width: 208 }}>
								<DateTimePicker
									format={`full_${timeFormatPreference}`}
									dir={dir}
									locale={locale}
									handleChange={(time) => setBeginningDate(time)}
									value={beginningDate}
									label={getTranslation("newReplay.newMapReplay.startDate")}
									okLabel={getTranslation("newReplay.replayArchive.ok")}
									cancelLabel={getTranslation("newReplay.replayArchive.cancel")}
									clearLabel={getTranslation("newReplay.replayArchive.clear")}
								/>
							</div>
							<div style={{ marginTop: -16, width: 208 }}>
								<DateTimePicker
									minDate={beginningDate}
									dir={dir}
									locale={locale}
									format={`full_${timeFormatPreference}`}
									handleChange={(time) => setEndDate(time)}
									value={endDate}
									label={getTranslation("newReplay.newMapReplay.endDate")}
									okLabel={getTranslation("newReplay.replayArchive.ok")}
									cancelLabel={getTranslation("newReplay.replayArchive.cancel")}
									clearLabel={getTranslation("newReplay.replayArchive.clear")}
								/>
							</div>
							<TextField
								variant="standard"
								id="duration"
								label={getTranslation("newReplay.newMapReplay.duration")}
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
							editing ? toggleEditing(false) : navigate(-1);
							dispatch(clearMapReference());
						}}
						style={{ height: 40, width: 130, color: "#B5B9BE" }}
					>
						<Translate value="newReplay.newMapReplay.cancel" />
					</Button>
					<Button onClick={() => {
						let startDate = "";
						let finalDate = "";
						if (replayFrameValue === "clip-duration") {
							startDate = moment.utc(beginningDate).locale("en").format();
							finalDate = moment.utc(beginningDate).add(clipDuration, "minutes").locale("en").format();
						} else {
							startDate = moment.utc(beginningDate).locale("en").format();
							finalDate = moment.utc(endDate).locale("en").format();
						}
						const location = `${window.location.origin}/replay-app/#/replay?type=map&coordinates=${mapCoordinates}&startDate=${startDate}&endDate=${finalDate}` + `${params && params.name && params.id ? `&name=${params.name}&id=${params.id}` : ""}`;
						if (editing) {
							window.location.replace(location);
							toggleEditing(false);
							dispatch(clearMapReference());
						}
						else {
							window.open(location);
						}
					}}
						style={{ height: 40, width: 130, color: "#fff" }}
						variant="contained"
					>
						<Translate value="newReplay.newMapReplay.loadReplay" />
					</Button>
				</div>
			</div>
			<div style={{ height: 800, width: "100%" }}>
				{servicesReady && (
					<ErrorBoundary>
						<LiveMap creatingReplay={true} updateMapCoordinates={updateMapCoordinates} baseMaps={baseMaps} />
					</ErrorBoundary>
				)}
			</div>

		</Dialog>

	);
};

NewMapReplay.propTypes = propTypes;
NewMapReplay.defaultProps = defaultProps;

export default memo(NewMapReplay);
