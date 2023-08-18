import React, { Component } from "react";

import {
	Drawer,
	List,
	ListItem,
	Toggle,
	Subheader,
	Divider
} from "material-ui";

import TileOptions from "./components/TileOptions";
import { Translate } from "orion-components/i18n/I18nContainer";

class OptionsDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleSettingsUpdate = keyVal => {
		const { updatePersistedState } = this.props;		
		updatePersistedState("events-app", "mapSettings", keyVal);
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
				<List style={{ paddingBottom: "1rem" }}>
					<Subheader className="subheader" style={dir == "rtl" ? {paddingLeft: 0, paddingRight: 16} : {}}><Translate value="appBar.optionsDrawer.baseMap"/></Subheader>
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
						className={`option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionsDrawer.mapLabels"/>}
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

				<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

				<List>
					<Subheader className="subheader" style={dir == "rtl" ? {paddingLeft: 0, paddingRight: 16} : {}}><Translate value="appBar.optionsDrawer.mapOverlays"/></Subheader>
					<ListItem
						className={`option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionsDrawer.nauticalCharts"/>}
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
					<ListItem
						className={`option-label ${roadsVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionsDrawer.roadsLabel"/>}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={roadsVisible}
								onClick={() =>
									this.handleSettingsUpdate({ roadsVisible: !roadsVisible })
								}
								style={dir == "rtl" ? {right: "unset", left: 8} : {}}
							/>
						}
						style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
					/>
					<ListItem
						className={`option-label ${weatherVisible ? "toggle-on" : "toggle-off"}`}
						primaryText={<Translate value="appBar.optionsDrawer.weatherRadar"/>}
						rightToggle={
							<Toggle
								thumbStyle={styles.thumbOff}
								trackStyle={styles.trackOff}
								thumbSwitchedStyle={styles.thumbSwitched}
								trackSwitchedStyle={styles.trackSwitched}
								toggled={weatherVisible}
								onClick={() =>
									this.handleSettingsUpdate({ weatherVisible: !weatherVisible })
								}
								style={dir == "rtl" ? {right: "unset", left: 8} : {}}
							/>
						}
						style={dir == "rtl" ? {padding: "16px 16px 16px 72px"} : {}}
					/>
				</List>
			</Drawer>
		);
	}
}

export default OptionsDrawer;
