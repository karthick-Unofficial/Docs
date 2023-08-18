import React, { PureComponent } from "react";

import { Drawer, List, ListItem, Toggle } from "material-ui";
import { Divider, Typography, Collapse } from "@material-ui/core";
import TileOptions from "./components/TileOptions";
import SpotlightProximity from "./components/SpotlightProximity";
import { CBSlider } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";

class OptionsDrawer extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleSettingsUpdate = keyVal => {
		const { updatePersistedState } = this.props;
		updatePersistedState("cameras-app", "mapSettings", keyVal);
	};

	handleSliderChange = (layer, event, value) => {
		const { updatePersistedState } = this.props;

		if (layer === "nauticalCharts") {
			updatePersistedState("cameras-app", "nauticalChartLayerOpacity", {
				nauticalChartLayerOpacity: value
			});
		} else if (layer === "roadAndLabels") {
			updatePersistedState("cameras-app", "roadAndLabelLayerOpacity", {
				roadAndLabelLayerOpacity: value
			});
		} else if (layer === "weatherRadar") {
			updatePersistedState("cameras-app", "weatherRadarLayerOpacity", {
				weatherRadarLayerOpacity: value
			});
		}
	};

	render() {
		const {
			open,
			toggleClosed,
			mapLabel,
			mapName,
			entityLabelsVisible,
			nauticalChartsVisible,
			roadsVisible,
			weatherVisible,
			globalState,
			updateGlobalUserAppSettings,
			nauticalChartLayerOpacity,
			roadAndLabelLayerOpacity,
			weatherRadarLayerOpacity,
			baseMaps,
			dir
		} = this.props;

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
					background:(dir == "rtl" ? "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" : "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)")
				}}
				openSecondary={dir == "rtl" ? true : false}
			>
				<section>
					<Typography variant="subtitle1"><Translate value="appBar.optionDrawer.baseMap"/></Typography>
					<TileOptions
						mapLabel={mapLabel}
						mapName={mapName}
						setMapStyle={this.handleSettingsUpdate}
						baseMaps={baseMaps}
						dir={dir}
					/>
				</section>
				<Divider />
				<List>
					<ListItem
						className={`option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionDrawer.mapLabels"/>}
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
				</List>

				<Divider />

				<List>
					<Typography style={dir == "rtl" ? { marginRight: 16 } : { marginLeft: 16 }} variant="subtitle1">
						<Translate value="appBar.optionDrawer.mapOverlays"/>
					</Typography>
					<ListItem
						className={`option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionDrawer.nauticalCharts"/>}
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
							value={nauticalChartLayerOpacity}
							min={0}
							max={1}
							step={0.1}
							onChange={this.handleSliderChange.bind(this, "nauticalCharts")}
						/>
					</Collapse>
					<ListItem
						className={`option-label ${roadsVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionDrawer.roadsLabels"/>}
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
							value={roadAndLabelLayerOpacity}
							min={0}
							max={1}
							step={0.1}
							onChange={this.handleSliderChange.bind(this, "roadAndLabels")}
						/>
					</Collapse>
					<ListItem
						className={`option-label ${weatherVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionDrawer.weatherRadar"/>}
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
							value={weatherRadarLayerOpacity}
							min={0}
							max={1}
							step={0.1}
							onChange={this.handleSliderChange.bind(this, "weatherRadar")}
						/>
					</Collapse>
				</List>
				<Divider />
				<SpotlightProximity
					globalState={globalState}
					updateGlobalSettings={updateGlobalUserAppSettings}
					dir={dir}
				/>
			</Drawer>
		);
	}
}

export default OptionsDrawer;
