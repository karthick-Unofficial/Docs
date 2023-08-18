import React, { useCallback } from "react";

import { Drawer, List, ListItem, Toggle } from "material-ui";
import { Divider, Typography, Collapse } from "@material-ui/core";
import TileOptions from "./components/TileOptions";
import SpotlightProximity from "./components/SpotlightProximity";
import { CBSlider } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { useSelector, useDispatch } from "react-redux";
import { updatePersistedState, updateGlobalUserAppSettings } from "./optionsDrawerActions";
import {
	mapSettingsSelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import _ from "lodash";

const OptionsDrawer = ({
	open,
	toggleClosed,
	baseMaps
}) => {
	const dispatch = useDispatch();

	const settings = useSelector(state => mapSettingsSelector(state));
	const globalState = useSelector(state => state.appState.global);
	const clientConfig = useSelector(state => state.clientConfig);
	const { nauticalChartsEnabled, weatherEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	const entityLabelsVisible = settings.entityLabelsVisible || false;
	const nauticalChartsVisible = settings.nauticalChartsVisible || false;
	const roadsVisible = settings.roadsVisible || false;
	const weatherVisible = settings.weatherVisible || false;
	const mapLabel = settings.mapStyle;
	const mapName = settings.mapStyle;
	const nauticalChartLayerOpacity = useSelector(state => nauticalChartLayerOpacitySelector(state));
	const roadAndLabelLayerOpacity = useSelector(state => roadAndLabelLayerOpacitySelector(state));
	const weatherRadarLayerOpacity = useSelector(state => weatherRadarLayerOpacitySelector(state));
	const dir = useSelector(state => getDir(state));

	const handleSettingsUpdate = keyVal => {
		dispatch(updatePersistedState("cameras-app", "mapSettings", keyVal));
	};

	const handleSliderChange =
		(event, value, layer) => {
			if (layer === "nauticalCharts") {
				dispatch(updatePersistedState("cameras-app", "nauticalChartLayerOpacity", {
					nauticalChartLayerOpacity: value
				}));
			} else if (layer === "roadAndLabels") {
				dispatch(updatePersistedState("cameras-app", "roadAndLabelLayerOpacity", {
					roadAndLabelLayerOpacity: value
				}));
			} else if (layer === "weatherRadar") {
				dispatch(updatePersistedState("cameras-app", "weatherRadarLayerOpacity", {
					weatherRadarLayerOpacity: value
				}));
			}
		};



	const styles = {
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
		}
	};
	return (
		<Drawer
			className="options-drawer"
			docked={false}
			width={300}
			open={open}
			onRequestChange={toggleClosed}
			containerStyle={{ backgroundColor: "#1F1F21" }}
			overlayStyle={{
				background: (dir === "rtl" ? "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" : "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)")
			}}
			openSecondary={dir === "rtl" ? true : false}
		>
			<section>
				<Typography variant="subtitle1"><Translate value="appBar.optionDrawer.baseMap" /></Typography>
				<TileOptions
					mapLabel={mapLabel}
					mapName={mapName}
					setMapStyle={handleSettingsUpdate}
					baseMaps={baseMaps}
					dir={dir}
				/>
			</section>
			<Divider />
			<List>
				<ListItem
					className={`option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"}`}
					primaryText={getTranslation("appBar.optionDrawer.mapLabels")}
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
			</List>

			<Divider />

			<List>
				<Typography style={dir === "rtl" ? { marginRight: 16 } : { marginLeft: 16 }} variant="subtitle1">
					<Translate value="appBar.optionDrawer.mapOverlays" />
				</Typography>
				{!nauticalChartsEnabled ? null : <><ListItem
					className={`option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"}`}
					primaryText={getTranslation("appBar.optionDrawer.nauticalCharts")}
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
							value={nauticalChartLayerOpacity}
							min={0}
							max={1}
							step={0.1}
							onChange={(e, value) => handleSliderChange(e, value, "nauticalCharts")}
						/>
					</Collapse></>}
				<ListItem
					className={`option-label ${roadsVisible ? "toggle-on" : "toggle-off"}`}
					primaryText={getTranslation("appBar.optionDrawer.roadsLabels")}
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
						value={roadAndLabelLayerOpacity}
						min={0}
						max={1}
						step={0.1}
						onChange={(e, v) => handleSliderChange(e, v, "roadAndLabels")}
					/>
				</Collapse>
				{!weatherEnabled ? null : <><ListItem
					className={`option-label ${weatherVisible ? "toggle-on" : "toggle-off"}`}
					primaryText={getTranslation("appBar.optionDrawer.weatherRadar")}
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
							value={weatherRadarLayerOpacity}
							min={0}
							max={1}
							step={0.1}
							onChange={(e, value) => handleSliderChange(e, value, "weatherRadar")}
						/>
					</Collapse></>}
			</List>
			<Divider />
			<SpotlightProximity
				globalState={globalState}
				updateGlobalSettings={updateGlobalUserAppSettings}
				dir={dir}
			/>
		</Drawer>
	);
};

export default OptionsDrawer;
