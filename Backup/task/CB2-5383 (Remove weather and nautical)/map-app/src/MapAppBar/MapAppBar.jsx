import React, { useState } from "react";
import { useStore } from "react-redux";

import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import { List, ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import Toggle from "material-ui/Toggle";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import Divider from "material-ui/Divider";
import Collapse from "@material-ui/core/Collapse";

import TileOptions from "./components/TileOptions";

import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import { CBSlider } from "orion-components/CBComponents";
import { GISControl } from "orion-components/Map/Controls";

import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const styles = {
	block: {
		maxWidth: 250
	},
	toggle: {
		marginBottom: 16
	},
	thumbOff: {
		backgroundColor: "#ffffff"
	},
	trackOff: {
		backgroundColor: "#828283"
	},
	thumbSwitched: {
		backgroundColor: "#29B6F6"
	},
	trackSwitched: {
		backgroundColor: "#bee1f1"
	},
	labelStyle: {
		color: "red"
	}
};
const ShapesAppBar = (props) => {
	const store = useStore();
	const [optionsOpen, setOptionsOpen] = useState(false);

	const toggleOptionsDrawer = () => {
		setOptionsOpen(!optionsOpen);
	};

	const toggleSsrRadarOverlay = (map, keyVal) => {
		const { updateSsrRadarTiles } = props;

		handleSettingsUpdate(keyVal);
		updateSsrRadarTiles(keyVal["ssrRadarVisible"], map);
	};

	const handleSettingsUpdate = keyVal => {
		const { updatePersistedState } = props;
		updatePersistedState("map-app", "mapSettings", keyVal);
	};

	const handleLayerToggle = (layerRef, source) => {
		const { disabledFeeds, updatePersistedState } = props;

		let update = [...disabledFeeds];

		if (_.includes(update, layerRef)) {
			_.pull(update, layerRef);
		} else {
			update = _.concat(update, layerRef);
		}

		updatePersistedState("map-app", "disabledFeeds", { disabledFeeds: update });
	};

	const handleFOVToggle = () => {
		const { showAllFOVs, showFOVs, hideFOVs } = this.props;

		showAllFOVs ? hideFOVs() : showFOVs();
	};

	const handleSliderChange = (layer, event, value) => {
		const { updatePersistedState } = props;

		if (layer === "nauticalCharts") {
			updatePersistedState("map-app", "nauticalChartLayerOpacity", {
				nauticalChartLayerOpacity: value
			});
		} else if (layer === "roadsAndLabels") {
			updatePersistedState("map-app", "roadAndLabelLayerOpacity", {
				roadAndLabelLayerOpacity: value
			});
		} else if (layer === "weatherRadar") {
			updatePersistedState("map-app", "weatherRadarLayerOpacity", {
				weatherRadarLayerOpacity: value
			});
		} else if (layer === "ssrRadar") {
			updatePersistedState("map-app", "ssrRadarLayerOpacity", {
				ssrRadarLayerOpacity: value
			});
		}
	};

	const {
		user,
		logOut,
		mapLabel,
		mapName,
		entityLabelsVisible,
		nauticalChartsVisible,
		roadsVisible,
		weatherVisible,
		ssrRadarVisible,
		showAllFOVs,
		userFeeds,
		disabledFeeds,
		gisData,
		gisState,
		createService,
		getGISLayers,
		turnOffGISLayer,
		updateVisibleGIS,
		resetGISRequest,
		updateGISService,
		deleteGISService,
		nauticalChartLayerOpacity,
		roadAndLabelLayerOpacity,
		weatherRadarLayerOpacity,
		ssrRadarLayerOpacity,
		ssrRadarOverlayEnabled,
		title,
		baseMaps,
		selectFloorPlanOn,
		floorPlansWithFacilityFeed,
		dir,
		nauticalChartsEnabled,
		weatherEnabled
	} = props;

	const nauticalChartLayerOpacityVal = nauticalChartLayerOpacity || 1;
	const roadAndLabelLayerOpacityVal = roadAndLabelLayerOpacity || 1;
	const weatherRadarLayerOpacityVal = weatherRadarLayerOpacity || 1;
	const ssrRadarLayerOpacityVal = ssrRadarLayerOpacity || 1;

	return (
		<div
			style={{
				height: 48
			}}
		>
			<AppBar
				style={dir === "rtl" ? {
					height: 48,
					lineHeight: "48px",
					backgroundColor: "#41454a",
					position: "relative",
					zIndex: 600,
					paddingLeft: 6
				} : {
					height: 48,
					lineHeight: "48px",
					backgroundColor: "#41454a",
					position: "relative",
					zIndex: 600,
					paddingRight: 6
				}}
				iconStyleLeft={dir === "rtl" ? { marginTop: 0, marginRight: -16, marginLeft: 8 } : { marginTop: 0 }}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontSize: "20px"
				}}
				title={title === "Map" ? getTranslation("mapAppBar.title") : title}
				iconElementLeft={
					<IconButton onClick={toggleOptionsDrawer}>
						<NavigationMenu />
					</IconButton>
				}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock
							map={props.map}
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						/>
						<AppMenu
							store={store}
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={logOut}
						/>
					</div>
				}
			/>

			<Drawer
				className="options-drawer"
				docked={false}
				width={300}
				open={optionsOpen}
				containerStyle={{ backgroundColor: "#1F1F21" }}
				onRequestChange={toggleOptionsDrawer}
				overlayStyle={{
					background: (dir === "rtl" ? "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" : "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)")
				}}
				openSecondary={dir === "rtl" ? true : false}
			>
				<List style={{ paddingBottom: "1rem" }}>
					<Subheader className="subheader" style={dir === "rtl" ? { paddingLeft: 0, paddingRight: 16 } : {}}><Translate value="mapAppBar.subHeader.baseMap" /></Subheader>
					<TileOptions
						mapLabel={mapLabel}
						mapName={mapName}
						setMapStyle={handleSettingsUpdate}
						baseMaps={baseMaps}
						dir={dir}
					/>
				</List>

				<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

				<List>
					<ListItem
						className={`option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.mapLabels")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={entityLabelsVisible}
								onClick={() =>
									handleSettingsUpdate({
										entityLabelsVisible: !entityLabelsVisible
									})
								}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						secondaryTextLines={2}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
					<ListItem
						className={`option-label ${showAllFOVs ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.cameraFOV")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={showAllFOVs}
								onClick={handleFOVToggle}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						secondaryTextLines={2}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
				</List>

				<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

				<List>
					<Subheader className="subheader" style={dir === "rtl" ? { paddingLeft: 0, paddingRight: 16 } : {}}><Translate value="mapAppBar.subHeader.mapOverlays" /></Subheader>
					{!nauticalChartsEnabled ? null : <><ListItem
						className={`option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"
							}`}
						primaryText={getTranslation("mapAppBar.listItem.nauticalCharts")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={nauticalChartsVisible}
								onClick={() =>
									handleSettingsUpdate({
										nauticalChartsVisible: !nauticalChartsVisible
									})
								}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
						<Collapse style={{ padding: "0px 16px" }} in={nauticalChartsVisible}>
							<CBSlider
								value={nauticalChartLayerOpacityVal}
								min={0}
								max={1}
								step={0.1}
								onChange={handleSliderChange.bind(this, "nauticalCharts")}
							/>
						</Collapse></>}
					<ListItem
						className={`option-label ${roadsVisible ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.roadsLabels")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={roadsVisible}
								onClick={() =>
									handleSettingsUpdate({
										roadsVisible: !roadsVisible
									})
								}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
					<Collapse style={{ padding: "0px 16px" }} in={roadsVisible}>
						<CBSlider
							value={roadAndLabelLayerOpacityVal}
							min={0}
							max={1}
							step={0.1}
							onChange={handleSliderChange.bind(this, "roadsAndLabels")}
						/>
					</Collapse>
					{!weatherEnabled ? null : <><ListItem
						className={`option-label ${weatherVisible ? "toggle-on" : "toggle-off"
							}`}
						primaryText={getTranslation("mapAppBar.listItem.weatherRadar")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={weatherVisible}
								onClick={() =>
									handleSettingsUpdate({
										weatherVisible: !weatherVisible
									})
								}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
						<Collapse style={{ padding: "0px 16px" }} in={weatherVisible}>
							<CBSlider
								value={weatherRadarLayerOpacityVal}
								min={0}
								max={1}
								step={0.1}
								onChange={handleSliderChange.bind(this, "weatherRadar")}
							/>
						</Collapse></>}
					{ssrRadarOverlayEnabled && (
						<ListItem
							className={`option-label ${ssrRadarVisible ? "toggle-on" : "toggle-off"
							}`}
							primaryText={getTranslation("mapAppBar.listItem.ssrRadar")}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={ssrRadarVisible}
									onClick={() =>
										toggleSsrRadarOverlay(props.map, { ssrRadarVisible: !ssrRadarVisible })
									}
									style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
								/>
							}
							style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
						/>
					)}
					<Collapse style={{ padding: "0px 16px" }} in={ssrRadarVisible}>
						<CBSlider
							value={ssrRadarLayerOpacityVal}
							min={0}
							max={1}
							step={0.1}
							onChange={handleSliderChange.bind(this, "ssrRadar")}
						/>
					</Collapse>
				</List>

				<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
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

				<List>
					<Subheader className="subheader" style={dir === "rtl" ? { paddingLeft: 0, paddingRight: 16 } : {}}><Translate value="mapAppBar.subHeader.feeds" /></Subheader>

					{userFeeds
						.filter(feed => {
							return (
								!_.includes(feed.feedId, "shapes") && feed.canView === true
							);
						})
						.map(feed => {
							return (
								<ListItem
									key={feed.feedId}
									className={`option-label ${!disabledFeeds.includes(feed.feedId)
										? "toggle-on"
										: "toggle-off"
									}`}
									primaryText={feed.name}
									rightToggle={
										<Toggle
											thumbStyle={styles.thumbOff}
											trackStyle={styles.trackOff}
											thumbSwitchedStyle={styles.thumbSwitched}
											trackSwitchedStyle={styles.trackSwitched}
											toggled={!disabledFeeds.includes(feed.feedId)}
											onClick={() =>
												handleLayerToggle(feed.feedId, feed.source)
											}
											style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
										/>
									}
									style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
								/>
							);
						})}
					<ListItem
						className={`option-label ${!disabledFeeds.includes("Event") ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.events")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={!disabledFeeds.includes("Event")}
								onClick={() => handleLayerToggle("Event")}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
					<ListItem
						className={`option-label ${!disabledFeeds.includes("Point") ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.points")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={!disabledFeeds.includes("Point")}
								onClick={() => handleLayerToggle("Point")}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
					<ListItem
						className={`option-label ${!disabledFeeds.includes("Polygon") ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.polygons")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={!disabledFeeds.includes("Polygon")}
								onClick={() => handleLayerToggle("Polygon")}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir === "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
					<ListItem
						className={`option-label ${!disabledFeeds.includes("Line") ? "toggle-on" : "toggle-off"
						}`}
						primaryText={getTranslation("mapAppBar.listItem.lines")}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={!disabledFeeds.includes("Line")}
								onClick={() => handleLayerToggle("Line")}
								style={dir === "rtl" ? { right: "unset", left: 8 } : {}}
							/>
						}
						style={dir == "rtl" ? { padding: "16px 16px 16px 72px" } : {}}
					/>
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
			</Drawer>
		</div>
	);
};

export default ShapesAppBar;