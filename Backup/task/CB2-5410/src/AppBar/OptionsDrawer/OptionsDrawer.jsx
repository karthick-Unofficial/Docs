import React from "react";
import { Drawer, List, ListItem, ListItemText, Switch, Divider, Typography, Collapse } from "@mui/material";
import { CBSlider } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
	persistedState,
	mapSettingsSelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector,
	ssrRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { makeStyles } from "@mui/styles";
import { updatePersistedState, updateGlobalUserAppSettings, setLocalAppState } from "orion-components/AppState/Actions";

import TileOptions from "./components/TileOptions";
import SpotlightProximity from "./components/SpotlightProximity";
import LayerToggle from "./components/LayerToggle";
import { setMapStyle, setLayerState, hideFOVs, showFOVs } from "./optionsDrawerActions";
import PropTypes from "prop-types";

const propTypes = {
	open: PropTypes.bool,
	toggleClosed: PropTypes.func,
	spotlightProximity: PropTypes.bool,
	children: PropTypes.node,
	disableSliders: PropTypes.bool,
	settingsMenu: PropTypes.bool,
	cameraFeeds: PropTypes.object,
	cameraFOV: PropTypes.bool,
	ssrRadarOverlayEnabled: PropTypes.bool,
	toggleSsrRadarOverlay: PropTypes.func
};

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

const OptionsDrawer = ({
	open,
	toggleClosed,
	spotlightProximity,
	children,
	settingsMenu,
	cameraFeeds,
	cameraFOV,
	ssrRadarOverlayEnabled,
	toggleSsrRadarOverlay
}) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const settings = useSelector((state) => mapSettingsSelector(state), shallowEqual);
	const globalState = useSelector((state) => state.appState.global);
	const entityLabelsVisible = settings.entityLabelsVisible || false;
	const ssrRadarVisible = settings.ssrRadarVisible || false;
	const roadsVisible = settings.roadsVisible || false;
	const coordsOnCursor = settings.coordsOnCursor || false;
	const roadAndLabelLayerOpacity = useSelector((state) => roadAndLabelLayerOpacitySelector(state));
	const ssrRadarLayerOpacity = useSelector((state) => ssrRadarLayerOpacitySelector(state));
	const appId = useSelector((state) => state.application.appId);
	const showAllFOVs = useSelector((state) => persistedState(state).showAllFOVs || false);
	const dir = useSelector((state) => getDir(state));

	const overlays = useSelector((state) => state.mapState?.mapOverlays?.overlays);
	// const nauticalChartsEnabled = overlays && Boolean(overlays.find((overlay) => overlay.layerType === "nauticalCharts"));
	// const weatherEnabled = overlays && Boolean(overlays.find((overlay) => overlay.layerType === "weatherRadar"));
	// const nauticalChartsVisible = settings?.nauticalCharts?.visible || false;
	// const weatherVisible = settings?.weatherRadar?.visible || false;
	// const nauticalChartLayerOpacity = useSelector((state) => nauticalChartLayerOpacitySelector(state));
	// const weatherRadarLayerOpacity = useSelector((state) => weatherRadarLayerOpacitySelector(state));


	const ssrRadarLayerOpacityVal = ssrRadarLayerOpacity || 1;

	const handleSettingsUpdate = (keyVal) => {
		dispatch(updatePersistedState(appId, "mapSettings", keyVal));
	};

	const handleSliderChange = (event, value, layer) => {
		if (layer === "nauticalCharts") {
			dispatch(setLocalAppState("mapSettings", { ...settings, nauticalCharts: { ...settings.nauticalCharts, opacity: value } }));
		} else if (layer === "roadAndLabels") {
			dispatch(setLocalAppState("roadAndLabelLayerOpacity", value));
		} else if (layer === "weatherRadar") {
			dispatch(setLocalAppState("mapSettings", { ...settings, weatherRadar: { ...settings.weatherRadar, opacity: value } }));
		} else if (layer === "ssrRadar") {
			dispatch(setLocalAppState("ssrRadarLayerOpacity", value));
		}
	};

	const handleSliderChangeCommitted = (event, value, layer) => {
		if (layer === "nauticalCharts") {
			dispatch(
				updatePersistedState(appId, "mapSettings", {
					...settings,
					nauticalCharts: {
						...settings.nauticalCharts,
						opacity: value
					}
				})
			);
		} else if (layer === "roadAndLabels") {
			dispatch(
				updatePersistedState(appId, "roadAndLabelLayerOpacity", {
					roadAndLabelLayerOpacity: value
				})
			);
		} else if (layer === "weatherRadar") {
			dispatch(
				updatePersistedState(appId, "mapSettings", {
					...settings,
					weatherRadar: {
						...settings.weatherRadar,
						opacity: value
					}
				})
			);
		} else if (layer === "ssrRadar") {
			dispatch(
				updatePersistedState("map-app", "ssrRadarLayerOpacity", {
					ssrRadarLayerOpacity: value
				})
			);
		}
	};

	const handleFOVToggle = () => {
		showAllFOVs ? dispatch(hideFOVs()) : dispatch(showFOVs(cameraFeeds));
	};

	const styles = {
		listItem: {
			padding: "4px 16px",
			...(dir === "rtl" && { textAlign: "right" })
		},
		drawer: {
			...(dir === "rtl"
				? {
					background: "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)"
				}
				: {
					background: "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)"
				})
		},
		typography: {
			...(dir === "rtl" ? { marginRight: 16 } : { marginLeft: 16 })
		}
	};
	return (
		<Drawer
			className="options-drawer"
			docked={false}
			width={300}
			open={open}
			onClose={toggleClosed}
			style={styles.drawer}
			anchor={dir === "rtl" ? "right" : "left"}
			PaperProps={{
				style: { width: 300, backgroundColor: "#1F1F21" }
			}}
			BackdropProps={{ invisible: true }}
		>
			<section style={{ margin: 16, padding: 0 }}>
				<Typography variant="subtitle1" style={{ paddingBottom: 16 }}>
					<Translate value="global.appBar.optionsDrawer.baseMap" />
				</Typography>
				<TileOptions setMapStyle={setMapStyle} />
			</section>

			<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

			<List>
				{settingsMenu ? (
					<LayerToggle
						label={getTranslation("global.appBar.optionsDrawer.mapLabels")}
						updateKey="entityLabels"
						dir={dir}
						setLayerState={setLayerState}
					/>
				) : (
					<ListItem sx={styles.listItem}>
						<ListItemText
							primary={getTranslation("global.appBar.optionsDrawer.mapLabels")}
							primaryTypographyProps={{
								style: { fontSize: 16 },
								className: `option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"}`
							}}
						/>
						<Switch
							edge="end"
							onChange={() =>
								handleSettingsUpdate({
									entityLabelsVisible: !entityLabelsVisible
								})
							}
							checked={entityLabelsVisible}
							classes={{
								thumb: entityLabelsVisible ? classes.thumbSwitched : classes.thumbOff,
								track: entityLabelsVisible ? classes.trackSwitched : classes.trackOff
							}}
						/>
					</ListItem>
				)}
				{cameraFOV && (
					<ListItem style={styles.textAlignRight}>
						<ListItemText
							primary={getTranslation("mapAppBar.listItem.cameraFOV")}
							primaryTypographyProps={{
								style: { fontSize: 16 },
								className: `option-label ${showAllFOVs ? "toggle-on" : "toggle-off"}`
							}}
						/>
						<Switch
							edge="end"
							onChange={handleFOVToggle}
							checked={showAllFOVs}
							classes={{
								thumb: showAllFOVs ? classes.thumbSwitched : classes.thumbOff,
								track: showAllFOVs ? classes.trackSwitched : classes.trackOff
							}}
						/>
					</ListItem>
				)}
				<ListItem sx={styles.listItem}>
					<ListItemText
						primary={getTranslation("global.appBar.optionsDrawer.coordsOnCursor")}
						primaryTypographyProps={{
							style: { fontSize: 16 },
							className: `option-label ${coordsOnCursor ? "toggle-on" : "toggle-off"}`
						}}
					/>
					<Switch
						edge="end"
						onChange={() =>
							handleSettingsUpdate({
								coordsOnCursor: !coordsOnCursor
							})
						}
						checked={coordsOnCursor}
						classes={{
							thumb: coordsOnCursor ? classes.thumbSwitched : classes.thumbOff,
							track: coordsOnCursor ? classes.trackSwitched : classes.trackOff
						}}
					/>
				</ListItem>
			</List>

			<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

			<List>
				<Typography style={styles.typography} variant="subtitle1">
					<Translate value="global.appBar.optionsDrawer.mapOverlays" />
				</Typography>
				{overlays.length > 0 && overlays.map((overlay) =>
					<LayerToggle
						label={getTranslation(`global.appBar.optionsDrawer.${overlay.layerType}`)}
						updateKey={overlay.layerType}
						withOpacity={!overlay.defaultOpacity}
						dir={dir}
						setLayerState={setLayerState} />
				)}
				{/* {!nauticalChartsEnabled ? null : settingsMenu ? (
					<LayerToggle
						label={getTranslation("global.appBar.optionsDrawer.nauticalCharts")}
						updateKey="nauticalCharts"
						withOpacity={true}
						dir={dir}
						setLayerState={setLayerState}
					/>
				) : (
					<>
						<ListItem sx={styles.listItem}>
							<ListItemText
								primary={getTranslation("global.appBar.optionsDrawer.nauticalCharts")}
								primaryTypographyProps={{
									style: { fontSize: 16 },
									className: `option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"}`
								}}
							/>
							<Switch
								edge="end"
								onChange={() =>
									handleSettingsUpdate({
										nauticalCharts: {
											...settings.nauticalCharts,
											visible: !nauticalChartsVisible
										}
									})
								}
								checked={nauticalChartsVisible}
								classes={{
									thumb: nauticalChartsVisible ? classes.thumbSwitched : classes.thumbOff,
									track: nauticalChartsVisible ? classes.trackSwitched : classes.trackOff
								}}
							/>
						</ListItem>
						{disableSliders ? (
							<></>
						) : (
							<Collapse style={{ padding: "0px 16px" }} in={nauticalChartsVisible}>
								<CBSlider
									value={nauticalChartLayerOpacity}
									min={0}
									max={1}
									step={0.1}
									onChange={(e, value) => handleSliderChange(e, value, "nauticalCharts")}
									onChangeCommitted={(e, value) =>
										handleSliderChangeCommitted(e, value, "nauticalCharts")
									}
								/>
							</Collapse>
						)}
					</>
				)} */}
				<LayerToggle
					label={getTranslation("global.appBar.optionsDrawer.roadsLabels")}
					updateKey="roadsAndLabels"
					withOpacity={true}
					dir={dir}
					setLayerState={setLayerState}
				/>
				{/* {!weatherEnabled ? null : settingsMenu ? (
					<LayerToggle
						label={getTranslation("global.appBar.optionsDrawer.weatherRadar")}
						updateKey="weatherRadar"
						withOpacity={true}
						dir={dir}
						setLayerState={setLayerState}
					/>
				) : (
					<>
						<ListItem sx={styles.listItem}>
							<ListItemText
								primary={getTranslation("global.appBar.optionsDrawer.weatherRadar")}
								primaryTypographyProps={{
									style: { fontSize: 16 },
									className: `option-label ${weatherVisible ? "toggle-on" : "toggle-off"}`
								}}
							/>
							<Switch
								edge="end"
								onChange={() =>
									handleSettingsUpdate({
										weatherRadar: {
											...settings.weatherRadar,
											visible: !weatherVisible
										}
									})
								}
								checked={weatherVisible}
								classes={{
									thumb: weatherVisible ? classes.thumbSwitched : classes.thumbOff,
									track: weatherVisible ? classes.trackSwitched : classes.trackOff
								}}
							/>
						</ListItem>
						{disableSliders ? (
							<></>
						) : (
							<Collapse style={{ padding: "0px 16px" }} in={weatherVisible}>
								<CBSlider
									value={weatherRadarLayerOpacity}
									min={0}
									max={1}
									step={0.1}
									onChange={(e, value) => handleSliderChange(e, value, "weatherRadar")}
									onChangeCommitted={(e, value) =>
										handleSliderChangeCommitted(e, value, "weatherRadar")
									}
								/>
							</Collapse>
						)}
					</>
				)} */}
				{ssrRadarOverlayEnabled && (
					<ListItem style={styles.textAlignRight}>
						<ListItemText
							primary={getTranslation("mapAppBar.listItem.ssrRadar")}
							primaryTypographyProps={{
								style: { fontSize: 16 },
								className: `option-label ${ssrRadarVisible ? "toggle-on" : "toggle-off"}`
							}}
						/>
						<Switch
							edge="end"
							onChange={() =>
								toggleSsrRadarOverlay({
									ssrRadarVisible: !ssrRadarVisible
								})
							}
							checked={ssrRadarVisible}
							classes={{
								thumb: ssrRadarVisible ? classes.thumbSwitched : classes.thumbOff,
								track: ssrRadarVisible ? classes.trackSwitched : classes.trackOff
							}}
						/>
					</ListItem>
				)}
				<Collapse style={{ padding: "0px 16px" }} in={ssrRadarVisible}>
					<CBSlider
						value={ssrRadarLayerOpacityVal}
						min={0}
						max={1}
						step={0.1}
						onChange={(e, value) => handleSliderChange(e, value, "ssrRadar")}
						onChangeCommitted={(e, value) => handleSliderChangeCommitted(e, value, "ssrRadar")}
					/>
				</Collapse>
			</List>
			<Divider />
			{children}
			{spotlightProximity && (
				<SpotlightProximity
					globalState={globalState}
					updateGlobalSettings={updateGlobalUserAppSettings}
					dir={dir}
				/>
			)}
		</Drawer>
	);
};

OptionsDrawer.propTypes = propTypes;

export default OptionsDrawer;
