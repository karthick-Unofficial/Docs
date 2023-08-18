import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Switch,
	Divider
} from "@mui/material";
import { GISControl } from "orion-components/Map/Controls";
import { Translate, getTranslation } from "orion-components/i18n";
import {
	userFeedsSelector,
	gisDataSelector,
	gisStateSelector,
	userFeedsByTypeSelector
} from "orion-components/GlobalData/Selectors";
import AppBar from "orion-components/AppBar/AppBar";
import {
	mapObject,
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";

import {
	createService,
	getGISLayers,
	turnOffGISLayer,
	updateVisibleGIS,
	resetGISRequest,
	updateGISService,
	deleteGISService,
	selectFloorPlanOn,
	updatePersistedState
} from "./mapAppBarActions";
import { makeStyles } from "@mui/styles";
import includes from "lodash/includes";
import concat from "lodash/concat";
import pull from "lodash/pull";
import OptionsDrawer from "orion-components/AppBar/OptionsDrawer/OptionsDrawer";
import ErrorBoundary from "orion-components/ErrorBoundary";

const useStyles = makeStyles({
	thumbOff: {
		backgroundColor: "#ffffff"
	},
	trackOff: {
		backgroundColor: "#828283",
		opacity: 1
	},
	thumbSwitched: {
		backgroundColor: "#29B6F6"
	},
	trackSwitched: {
		backgroundColor: "#bee1f1!important",
		opacity: "1!important"
	}
});

const MapAppBar = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const userFeeds = useSelector((state) => userFeedsSelector(state));
	const floorPlansWithFacilityFeed = useSelector(
		(state) => state.globalData.floorPlanWithFacilityFeedId.floorPlans
	);

	const gisData = useSelector((state) => gisDataSelector(state));
	const gisState = useSelector((state) => gisStateSelector(state));
	const map = useSelector((state) => mapObject(state));

	const disabledFeeds = useSelector((state) => disabledFeedsSelector(state));
	const ssrRadarOverlayEnabled = useSelector(
		(state) => !!state.clientConfig.ssrRadarOverlayEnabled
	);
	const dir = useSelector((state) => getDir(state));
	const cameraFeeds = useSelector(
		(state) => userFeedsByTypeSelector("camera")(state),
		shallowEqual
	);

	const [optionsOpen, setOptionsOpen] = useState(false);

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	const handleSettingsUpdate = (keyVal) => {
		dispatch(updatePersistedState("map-app", "mapSettings", keyVal));
	};

	const toggleSsrRadarOverlay = (keyVal) => {
		handleSettingsUpdate(keyVal);
	};

	const handleLayerToggle = (layerRef) => {
		let update = [...disabledFeeds];

		if (includes(update, layerRef)) {
			pull(update, layerRef);
		} else {
			update = concat(update, layerRef);
		}

		dispatch(
			updatePersistedState("map-app", "disabledFeeds", {
				disabledFeeds: update
			})
		);
	};

	const styles = {
		textAlignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		drawer: {
			...(dir === "rtl" && {
				background:
					"linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)"
			}),
			...(dir === "ltr" && {
				background:
					"linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)"
			})
		},
		listSubHeader: {
			backgroundColor: "#1F1F21",
			...(dir === "rtl" && { paddingLeft: 0, paddingRight: 16 })
		}
	};

	return (
		<div style={{ height: 48 }}>
			<AppBar
				titleText="Map"
				toggleOptionsDrawer={toggleOptionsDrawer}
				map={map}
				selectFloorPlanOn={selectFloorPlanOn}
				floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
				isMenu={true}
			/>
			<ErrorBoundary>
				<OptionsDrawer
					open={optionsOpen}
					toggleClosed={toggleOptionsDrawer}
					cameraFeeds={cameraFeeds}
					cameraFOV={true}
					ssrRadarOverlayEnabled={ssrRadarOverlayEnabled}
					toggleSsrRadarOverlay={toggleSsrRadarOverlay}
				>
					<GISControl
						app="map-app"
						gisData={gisData}
						gisState={gisState}
						createService={createService}
						getLayers={getGISLayers}
						turnOffLayer={turnOffGISLayer}
						resetRequest={resetGISRequest}
						updateVisibleGIS={updateVisibleGIS}
						updateGISService={updateGISService}
						deleteGISService={deleteGISService}
						dir={dir}
					/>

					<Divider
						style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
					/>

					<List
						className="customList"
						subheader={
							<ListSubheader
								className="subheader"
								style={styles.listSubHeader}
							>
								<Translate value="mapAppBar.subHeader.feeds" />
							</ListSubheader>
						}
					>
						{userFeeds
							.filter((feed) => {
								return (
									!includes(feed.feedId, "shapes") &&
									feed.canView === true
								);
							})
							.map((feed) => {
								return (
									<ListItem
										key={feed.feedId}
										style={styles.textAlignRight}
									>
										<ListItemText
											primary={feed.name}
											primaryTypographyProps={{
												style: { fontSize: 16 },
												className: `option-label ${
													!disabledFeeds.includes(
														feed.feedId
													)
														? "toggle-on"
														: "toggle-off"
												}`
											}}
										/>
										<Switch
											edge="end"
											onChange={() =>
												handleLayerToggle(
													feed.feedId,
													feed.source
												)
											}
											checked={
												!disabledFeeds.includes(
													feed.feedId
												)
											}
											classes={{
												thumb: !disabledFeeds.includes(
													feed.feedId
												)
													? classes.thumbSwitched
													: classes.thumbOff,
												track: !disabledFeeds.includes(
													feed.feedId
												)
													? classes.trackSwitched
													: classes.trackOff
											}}
										/>
									</ListItem>
								);
							})}
						<ListItem style={styles.textAlignRight}>
							<ListItemText
								primary={getTranslation(
									"mapAppBar.listItem.events"
								)}
								primaryTypographyProps={{
									style: { fontSize: 16 },
									className: `option-label ${
										!disabledFeeds.includes("Event")
											? "toggle-on"
											: "toggle-off"
									}`
								}}
							/>
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Event")}
								checked={!disabledFeeds.includes("Event")}
								classes={{
									thumb: !disabledFeeds.includes("Event")
										? classes.thumbSwitched
										: classes.thumbOff,
									track: !disabledFeeds.includes("Event")
										? classes.trackSwitched
										: classes.trackOff
								}}
							/>
						</ListItem>
						<ListItem style={styles.textAlignRight}>
							<ListItemText
								primary={getTranslation(
									"mapAppBar.listItem.points"
								)}
								primaryTypographyProps={{
									style: { fontSize: 16 },
									className: `option-label ${
										!disabledFeeds.includes("Point")
											? "toggle-on"
											: "toggle-off"
									}`
								}}
							/>
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Point")}
								checked={!disabledFeeds.includes("Point")}
								classes={{
									thumb: !disabledFeeds.includes("Point")
										? classes.thumbSwitched
										: classes.thumbOff,
									track: !disabledFeeds.includes("Point")
										? classes.trackSwitched
										: classes.trackOff
								}}
							/>
						</ListItem>
						<ListItem style={styles.textAlignRight}>
							<ListItemText
								primary={getTranslation(
									"mapAppBar.listItem.polygons"
								)}
								primaryTypographyProps={{
									style: { fontSize: 16 },
									className: `option-label ${
										!disabledFeeds.includes("Polygon")
											? "toggle-on"
											: "toggle-off"
									}`
								}}
							/>
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Polygon")}
								checked={!disabledFeeds.includes("Polygon")}
								classes={{
									thumb: !disabledFeeds.includes("Polygon")
										? classes.thumbSwitched
										: classes.thumbOff,
									track: !disabledFeeds.includes("Polygon")
										? classes.trackSwitched
										: classes.trackOff
								}}
							/>
						</ListItem>
						<ListItem style={styles.textAlignRight}>
							<ListItemText
								primary={getTranslation(
									"mapAppBar.listItem.lines"
								)}
								primaryTypographyProps={{
									style: { fontSize: 16 },
									className: `option-label ${
										!disabledFeeds.includes("Line")
											? "toggle-on"
											: "toggle-off"
									}`
								}}
							/>
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Line")}
								checked={!disabledFeeds.includes("Line")}
								classes={{
									thumb: !disabledFeeds.includes("Line")
										? classes.thumbSwitched
										: classes.thumbOff,
									track: !disabledFeeds.includes("Line")
										? classes.trackSwitched
										: classes.trackOff
								}}
							/>
						</ListItem>
					</List>

					{/* Removing Mapbox toggle until functionality is sorted out */}

					{/* <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

					<List>
						<Subheader className="subheader">MAPBOX</Subheader>
						<ListItem
							className={`option-label ${
								userAppState.useMapbox ? "toggle-on" : "toggle-off"
							}`}
							primaryText="Use Mapbox maps"
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={userAppState.useMapbox}
									onClick={() => toggleMapboxServer(userAppState.useMapbox)}
								/>
							}
						/>
					</List> */}
				</OptionsDrawer>
			</ErrorBoundary>
		</div>
	);
};

export default MapAppBar;
