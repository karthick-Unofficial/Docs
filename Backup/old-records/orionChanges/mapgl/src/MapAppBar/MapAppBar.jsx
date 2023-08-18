import React, { Component } from "react";

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
import isEqual from "react-fast-compare";
import { Translate } from "orion-components/i18n/I18nContainer";

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
class ShapesAppBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			optionsOpen: false,
			baseMaps: []
		};
	}

	static getDerivedStateFromProps(props, state) {
		return {
			baseMaps: props.baseMaps
		};
	}

	toggleOptionsDrawer = () => {
		this.setState({
			optionsOpen: !this.state.optionsOpen
		});
	};

	toggleSsrRadarOverlay = (map, keyVal) => {
		const { updateSsrRadarTiles } = this.props;

		this.handleSettingsUpdate(keyVal);
		updateSsrRadarTiles(keyVal["ssrRadarVisible"], map);
	}

	handleSettingsUpdate = keyVal => {
		const { updatePersistedState } = this.props;
		updatePersistedState("map-app", "mapSettings", keyVal);
	};

	handleLayerToggle = (layerRef, source) => {
		const { disabledFeeds, updatePersistedState } = this.props;

		let update = [...disabledFeeds];

		if (_.includes(update, layerRef)) {
			_.pull(update, layerRef);
		} else {
			update = _.concat(update, layerRef);
		}

		updatePersistedState("map-app", "disabledFeeds", { disabledFeeds: update });
	};

	handleFOVToggle = () => {
		const { showAllFOVs, showFOVs, hideFOVs } = this.props;

		showAllFOVs ? hideFOVs() : showFOVs();
	};

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
		);
	}

	handleSliderChange = (layer, event, value) => {
		const { updatePersistedState } = this.props;

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

	render() {
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
			dir
		} = this.props;

		const { optionsOpen, baseMaps } = this.state;
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
					style={dir == "rtl" ? {
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
					iconStyleLeft={ dir == "rtl" ? { marginTop: 0, marginRight: -16, marginLeft: 8 } : { marginTop: 0 }}
					iconStyleRight={{
						margin: 0
					}}
					titleStyle={{
						lineHeight: "48px",
						fontSize: "20px"
					}}
					title={title == "Map" ? <Translate value="mapAppBar.title" /> : title}
					iconElementLeft={
						<IconButton onClick={this.toggleOptionsDrawer}>
							<NavigationMenu />
						</IconButton>
					}
					iconElementRight={
						<div className="appBarWrapperRight">
							<Dock
								map={this.props.map}
								shouldStreamCameras={true}
								shouldStreamNotifications={true}
							/>
							<AppMenu
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
					onRequestChange={this.toggleOptionsDrawer}
					overlayStyle={{
						background:(dir == "rtl" ? "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" : "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)")
					}}
					openSecondary={dir == "rtl" ? true : false}
				>
					<List style={{ paddingBottom: "1rem" }}>
						<Subheader className="subheader" style={dir == "rtl" ? {paddingLeft: 0, paddingRight: 16} : {}}><Translate value="mapAppBar.subHeader.baseMap" /></Subheader>
						<TileOptions
							mapLabel={mapLabel}
							mapName={mapName}
							setMapStyle={this.handleSettingsUpdate}
							baseMaps={baseMaps}
							dir={dir}
						/>
					</List>

					<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

					<List>
						<ListItem
							className={`option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.mapLabels" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={entityLabelsVisible}
									onClick={() =>
										this.handleSettingsUpdate({
											entityLabelsVisible: !entityLabelsVisible
										})
									}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							secondaryTextLines={2}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<ListItem
							className={`option-label ${showAllFOVs ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.cameraFOV" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={showAllFOVs}
									onClick={this.handleFOVToggle}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							secondaryTextLines={2}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
					</List>

					<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

					<List>
						<Subheader className="subheader" style={dir == "rtl" ? {paddingLeft: 0, paddingRight: 16} : {}}><Translate value="mapAppBar.subHeader.mapOverlays" /></Subheader>
						<ListItem
							className={`option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.nauticalCharts" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={nauticalChartsVisible}
									onClick={() =>
										this.handleSettingsUpdate({
											nauticalChartsVisible: !nauticalChartsVisible
										})
									}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<Collapse style={{ padding: "0px 16px" }} in={nauticalChartsVisible}>
							<CBSlider
								value={nauticalChartLayerOpacityVal}
								min={0}
								max={1}
								step={0.1}
								onChange={this.handleSliderChange.bind(this, "nauticalCharts")}
							/>
						</Collapse>
						<ListItem
							className={`option-label ${roadsVisible ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.roadsLabels" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={roadsVisible}
									onClick={() =>
										this.handleSettingsUpdate({
											roadsVisible: !roadsVisible
										})
									}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<Collapse style={{ padding: "0px 16px" }} in={roadsVisible}>
							<CBSlider
								value={roadAndLabelLayerOpacityVal}
								min={0}
								max={1}
								step={0.1}
								onChange={this.handleSliderChange.bind(this, "roadsAndLabels")}
							/>
						</Collapse>
						<ListItem
							className={`option-label ${weatherVisible ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.weatherRadar" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={weatherVisible}
									onClick={() =>
										this.handleSettingsUpdate({
											weatherVisible: !weatherVisible
										})
									}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<Collapse style={{ padding: "0px 16px" }} in={weatherVisible}>
							<CBSlider
								value={weatherRadarLayerOpacityVal}
								min={0}
								max={1}
								step={0.1}
								onChange={this.handleSliderChange.bind(this, "weatherRadar")}
							/>
						</Collapse>
						{ssrRadarOverlayEnabled && (
							<ListItem
								className={`option-label ${ssrRadarVisible ? "toggle-on" : "toggle-off"
									}`}
								primaryText={<Translate value="mapAppBar.listItem.ssrRadar" />}
								rightToggle={
									<Toggle
										thumbStyle={styles.thumbOff}
										trackStyle={styles.trackOff}
										thumbSwitchedStyle={styles.thumbSwitched}
										trackSwitchedStyle={styles.trackSwitched}
										toggled={ssrRadarVisible}
										onClick={() =>
											this.toggleSsrRadarOverlay(this.props.map, { ssrRadarVisible: !ssrRadarVisible })
										}
										style={dir == "rtl" ? {right: "unset", left: 8} : {}}
									/>
								}
								style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
							/>
						)}
						<Collapse style={{ padding: "0px 16px" }} in={ssrRadarVisible}>
							<CBSlider
								value={ssrRadarLayerOpacityVal}
								min={0}
								max={1}
								step={0.1}
								onChange={this.handleSliderChange.bind(this, "ssrRadar")}
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
						<Subheader className="subheader" style={dir == "rtl" ? {paddingLeft: 0, paddingRight: 16} : {}}><Translate value="mapAppBar.subHeader.feeds" /></Subheader>

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
													this.handleLayerToggle(feed.feedId, feed.source)
												}
												style={dir == "rtl" ? {right: "unset", left: 8} : {}}
											/>
										}
										style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
									/>
								);
							})}
						<ListItem
							className={`option-label ${!disabledFeeds.includes("Event") ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.events" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={!disabledFeeds.includes("Event")}
									onClick={() => this.handleLayerToggle("Event")}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<ListItem
							className={`option-label ${!disabledFeeds.includes("Point") ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.points" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={!disabledFeeds.includes("Point")}
									onClick={() => this.handleLayerToggle("Point")}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<ListItem
							className={`option-label ${!disabledFeeds.includes("Polygon") ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.polygons" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={!disabledFeeds.includes("Polygon")}
									onClick={() => this.handleLayerToggle("Polygon")}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
						/>
						<ListItem
							className={`option-label ${!disabledFeeds.includes("Line") ? "toggle-on" : "toggle-off"
								}`}
							primaryText={<Translate value="mapAppBar.listItem.lines" />}
							rightToggle={
								<Toggle
									thumbStyle={styles.thumbOff}
									trackStyle={styles.trackOff}
									thumbSwitchedStyle={styles.thumbSwitched}
									trackSwitchedStyle={styles.trackSwitched}
									toggled={!disabledFeeds.includes("Line")}
									onClick={() => this.handleLayerToggle("Line")}
									style={dir == "rtl" ? {right: "unset", left: 8} : {}}
								/>
							}
							style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
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
	}
}

export default ShapesAppBar;
