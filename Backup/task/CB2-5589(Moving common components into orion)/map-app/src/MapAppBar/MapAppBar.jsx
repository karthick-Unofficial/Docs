import React, { Fragment, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { List, ListItem, ListItemText, AppBar, Drawer, ListSubheader, Switch, IconButton, Divider, Collapse, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import TileOptions from "orion-components/SharedComponents/TileOptions/TileOptions";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import { CBSlider } from "orion-components/CBComponents";
import { GISControl } from "orion-components/Map/Controls";
import { Translate, getTranslation } from "orion-components/i18n";
import {
	userFeedsSelector,
	gisDataSelector,
	gisStateSelector,
	userFeedsByTypeSelector
} from "orion-components/GlobalData/Selectors";

import {
	mapObject,
	mapSettingsSelector,
	persistedState,
	disabledFeedsSelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector,
	ssrRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";

import {
	logOut,
	createService,
	getGISLayers,
	turnOffGISLayer,
	updateVisibleGIS,
	resetGISRequest,
	updateGISService,
	deleteGISService,
	selectFloorPlanOn,
	updateSsrRadarTiles,
	updatePersistedState,
	hideFOVs,
	showFOVs
} from "./mapAppBarActions";
import { makeStyles } from "@mui/styles";
import includes from "lodash/includes";
import concat from "lodash/concat";
import pull from "lodash/pull";
import OptionsDrawer from "orion-components/SharedComponents/OptionsDrawer/OptionsDrawer";
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


const ShapesAppBar = (props) => {

	const dispatch = useDispatch();
	const classes = useStyles();

	const title = useSelector(state => state.application?.name ?? "Map");

	const baseMaps = useSelector(state => state.baseMaps);
	const userFeeds = useSelector(state => userFeedsSelector(state));
	const floorPlansWithFacilityFeed = useSelector(state => state.globalData.floorPlanWithFacilityFeedId.floorPlans);
	const nauticalChartsEnabled = useSelector(state => state.clientConfig.mapSettings?.nauticalChartsEnabled ?? true);
	const weatherEnabled = useSelector(state => state.clientConfig.mapSettings?.weatherEnabled ?? true);

	const user = useSelector(state => state.session.user);
	const gisData = useSelector(state => gisDataSelector(state));
	const settings = useSelector(state => mapSettingsSelector(state), shallowEqual);
	const gisState = useSelector(state => gisStateSelector(state));
	const map = useSelector(state => mapObject(state));

	const entityLabelsVisible = settings.entityLabelsVisible || false;
	const nauticalChartsVisible = settings.nauticalChartsVisible || false;
	const roadsVisible = settings.roadsVisible || false;
	const weatherVisible = settings.weatherVisible || false;
	const ssrRadarVisible = settings.ssrRadarVisible || false;
	const mapLabel = settings.mapStyle;
	const mapName = settings.mapStyle;

	const showAllFOVs = useSelector(state => persistedState(state).showAllFOVs || false);
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
	const nauticalChartLayerOpacity = useSelector(state => nauticalChartLayerOpacitySelector(state));
	const roadAndLabelLayerOpacity = useSelector(state => roadAndLabelLayerOpacitySelector(state));
	const weatherRadarLayerOpacity = useSelector(state => weatherRadarLayerOpacitySelector(state));
	const ssrRadarLayerOpacity = useSelector(state => ssrRadarLayerOpacitySelector(state));
	const ssrRadarOverlayEnabled = useSelector(state => !!state.clientConfig.ssrRadarOverlayEnabled);
	const dir = useSelector(state => getDir(state));
	const cameraFeeds = useSelector(state => userFeedsByTypeSelector("camera")(state), shallowEqual);

	const [optionsOpen, setOptionsOpen] = useState(false);

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	const handleSettingsUpdate = keyVal => {
		dispatch(updatePersistedState("map-app", "mapSettings", keyVal));
	};

	const toggleSsrRadarOverlay = (mapRef, keyVal) => {
		handleSettingsUpdate(keyVal);
	};

	const handleLayerToggle = (layerRef, source) => {
		let update = [...disabledFeeds];

		if (includes(update, layerRef)) {
			pull(update, layerRef);
		} else {
			update = concat(update, layerRef);
		}

		dispatch(updatePersistedState("map-app", "disabledFeeds", { disabledFeeds: update }));
	};

	const handleFOVToggle = () => {
		showAllFOVs ? dispatch(hideFOVs()) : dispatch(showFOVs(cameraFeeds));
	};

	const handleSliderChange = (layer, event, value) => {
		if (layer === "nauticalCharts") {
			dispatch(updatePersistedState("map-app", "nauticalChartLayerOpacity", {
				nauticalChartLayerOpacity: value
			}));
		} else if (layer === "roadsAndLabels") {
			dispatch(updatePersistedState("map-app", "roadAndLabelLayerOpacity", {
				roadAndLabelLayerOpacity: value
			}));
		} else if (layer === "weatherRadar") {
			dispatch(updatePersistedState("map-app", "weatherRadarLayerOpacity", {
				weatherRadarLayerOpacity: value
			}));
		} else if (layer === "ssrRadar") {
			dispatch(updatePersistedState("map-app", "ssrRadarLayerOpacity", {
				ssrRadarLayerOpacity: value
			}));
		}
	};


	const nauticalChartLayerOpacityVal = nauticalChartLayerOpacity || 1;
	const roadAndLabelLayerOpacityVal = roadAndLabelLayerOpacity || 1;
	const weatherRadarLayerOpacityVal = weatherRadarLayerOpacity || 1;
	const ssrRadarLayerOpacityVal = ssrRadarLayerOpacity || 1;

	const styles = {
		block: {
			maxWidth: 250
		},
		toggle: {
			marginBottom: 16
		},
		labelStyle: {
			color: "red"
		},
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			...(dir === "rtl" && { paddingLeft: 6 }),
			...(dir === "ltr" && { paddingRight: 6 })
		},
		appBarTitle: {
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",
			...(dir === "rtl" && { marginRight: "12px", paddingRight: "10px" }),
			...(dir === "ltr" && { marginLeft: "12px", paddingLeft: "10px", })
		},
		iconButton: {
			height: 48,
			...(dir === "rtl" && { marginLeft: 8, marginRight: - 16 }),
			...(dir === "ltr" && { marginRight: 8, marginLeft: -16 })
		},
		textAlignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		dockWrapper: {
			display: "flex",
			...(dir === "rtl" && { marginRight: "auto" }),
			...(dir === "ltr" && { marginLeft: "auto" })
		},
		drawer: {
			...(dir === "rtl" && { background: "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" }),
			...(dir === "ltr" && { background: "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" })
		},
		listSubHeader: {
			backgroundColor: "#1F1F21",
			...(dir === "rtl" && { paddingLeft: 0, paddingRight: 16 })
		}
	}

	return (
		<div style={{ height: 48 }}>
			<AppBar
				style={styles.appBar}
			>
				<div style={{ display: "flex" }}>
					<div style={styles.appBarTitle}>
						<div style={{ display: "flex" }}>
							<div style={styles.iconButton}>
								<IconButton onClick={toggleOptionsDrawer} style={{ color: "#FFF", width: 48 }}>
									<Menu />
								</IconButton>
							</div>
							{title === "Map" ? getTranslation("mapAppBar.title") : title}
						</div>
					</div>

					<div style={styles.dockWrapper}>
						<Dock
							map={map}
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						/>
						<AppMenu
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={logOut}
						/>
					</div>
				</div>

			</AppBar>
			<ErrorBoundary>
				<OptionsDrawer
					open={optionsOpen}
					toggleClosed={toggleOptionsDrawer}
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

					<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

					<List
						className="customList"
						subheader={
							<ListSubheader className="subheader" style={styles.listSubHeader}><Translate value="mapAppBar.subHeader.feeds" /></ListSubheader>
						}
					>
						{userFeeds
							.filter(feed => {
								return (
									!includes(feed.feedId, "shapes") && feed.canView === true
								);
							})
							.map(feed => {
								return (
									<ListItem
										key={feed.feedId}
										style={styles.textAlignRight}
									>
										<ListItemText
											primary={feed.name}
											primaryTypographyProps={{
												style: { fontSize: 16 }, className: `option-label ${!disabledFeeds.includes(feed.feedId) ? "toggle-on" : "toggle-off"}`
											}} />
										<Switch
											edge="end"
											onChange={() => handleLayerToggle(feed.feedId, feed.source)}
											checked={!disabledFeeds.includes(feed.feedId)}
											classes={{
												thumb: !disabledFeeds.includes(feed.feedId) ? classes.thumbSwitched : classes.thumbOff,
												track: !disabledFeeds.includes(feed.feedId) ? classes.trackSwitched : classes.trackOff
											}}
										/>
									</ListItem>
								);
							})}
						<ListItem
							style={styles.textAlignRight}
						>
							<ListItemText
								primary={getTranslation("mapAppBar.listItem.events")}
								primaryTypographyProps={{
									style: { fontSize: 16 }, className: `option-label ${!disabledFeeds.includes("Event") ? "toggle-on" : "toggle-off"}`
								}} />
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Event")}
								checked={!disabledFeeds.includes("Event")}
								classes={{
									thumb: !disabledFeeds.includes("Event") ? classes.thumbSwitched : classes.thumbOff,
									track: !disabledFeeds.includes("Event") ? classes.trackSwitched : classes.trackOff
								}}
							/>
						</ListItem>
						<ListItem
							style={styles.textAlignRight}
						>
							<ListItemText
								primary={getTranslation("mapAppBar.listItem.points")}
								primaryTypographyProps={{
									style: { fontSize: 16 }, className: `option-label ${!disabledFeeds.includes("Point") ? "toggle-on" : "toggle-off"}`
								}} />
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Point")}
								checked={!disabledFeeds.includes("Point")}
								classes={{
									thumb: !disabledFeeds.includes("Point") ? classes.thumbSwitched : classes.thumbOff,
									track: !disabledFeeds.includes("Point") ? classes.trackSwitched : classes.trackOff
								}}
							/>
						</ListItem>
						<ListItem
							style={styles.textAlignRight}
						>
							<ListItemText
								primary={getTranslation("mapAppBar.listItem.polygons")}
								primaryTypographyProps={{
									style: { fontSize: 16 }, className: `option-label ${!disabledFeeds.includes("Polygon") ? "toggle-on" : "toggle-off"}`
								}} />
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Polygon")}
								checked={!disabledFeeds.includes("Polygon")}
								classes={{
									thumb: !disabledFeeds.includes("Polygon") ? classes.thumbSwitched : classes.thumbOff,
									track: !disabledFeeds.includes("Polygon") ? classes.trackSwitched : classes.trackOff
								}}
							/>
						</ListItem>
						<ListItem
							style={styles.textAlignRight}
						>
							<ListItemText
								primary={getTranslation("mapAppBar.listItem.lines")}
								primaryTypographyProps={{
									style: { fontSize: 16 }, className: `option-label ${!disabledFeeds.includes("Line") ? "toggle-on" : "toggle-off"}`
								}} />
							<Switch
								edge="end"
								onChange={() => handleLayerToggle("Line")}
								checked={!disabledFeeds.includes("Line")}
								classes={{
									thumb: !disabledFeeds.includes("Line") ? classes.thumbSwitched : classes.thumbOff,
									track: !disabledFeeds.includes("Line") ? classes.trackSwitched : classes.trackOff
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
		</div >
	);
};

export default ShapesAppBar;