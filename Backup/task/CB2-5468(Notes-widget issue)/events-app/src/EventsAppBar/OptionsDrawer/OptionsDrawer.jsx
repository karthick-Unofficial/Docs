import React from "react";

import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	Switch,
	ListSubheader,
	Divider
} from "@mui/material";

import TileOptions from "./components/TileOptions";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import { updatePersistedState } from "./optionsDrawerActions.js";
import _ from "lodash";
import { makeStyles } from "@mui/styles";

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
	toggleClosed
}) => {

	const dispatch = useDispatch();
	const classes = useStyles();

	const settings = useSelector(state => mapSettingsSelector(state));
	const clientConfig = useSelector(state => state.clientConfig);
	const { nauticalChartsEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	const { weatherEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	const entityLabelsVisible = settings.entityLabelsVisible || false;
	const nauticalChartsVisible = settings.nauticalChartsVisible || false;
	const roadsVisible = settings.roadsVisible || false;
	const weatherVisible = settings.weatherVisible || false;
	const mapLabel = settings.mapStyle;
	const mapName = settings.mapStyle;
	const baseMaps = useSelector(state => state.baseMaps);
	const dir = useSelector(state => getDir(state));

	const handleSettingsUpdate = keyVal => {
		dispatch(updatePersistedState("events-app", "mapSettings", keyVal));
	};

	const styles = {
		listItem: {
			padding: "4px 16px",
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	return (
		<Drawer
			className="options-drawer"
			open={open}
			onClose={toggleClosed}
			style={{
				background: (dir === "rtl" ? "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" : "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)")
			}}
			openSecondary={dir === "rtl" ? true : false}
			anchor={dir === "rtl" ? "right" : "left"}
			PaperProps={{
				style: { width: 300, backgroundColor: "#1F1F21" }
			}}
			BackdropProps={{ invisible: true }}
		>
			<List
				style={{ paddingBottom: "1rem" }}
				subheader={
					<ListSubheader
						className="subheader"
						style={dir == "rtl" ? { paddingLeft: 0, paddingRight: 16, backgroundColor: "#1F1F21" } : { backgroundColor: "#1F1F21" }}>
						<Translate value="appBar.optionsDrawer.baseMap" />
					</ListSubheader>
				}>
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
					sx={styles.listItem}
				>
					<ListItemText
						primary={getTranslation("appBar.optionsDrawer.mapLabels")}
						primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"}` }}
					/>
					<Switch
						edge="end"
						onChange={() => handleSettingsUpdate({ entityLabelsVisible: !entityLabelsVisible })}
						checked={entityLabelsVisible}
						classes={{
							thumb: entityLabelsVisible ? classes.thumbSwitched : classes.thumbOff,
							track: entityLabelsVisible ? classes.trackSwitched : classes.trackOff
						}}
					/>
				</ListItem>
			</List>

			<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

			<List
				subheader={
					<ListSubheader className="subheader" style={dir === "rtl" ? { paddingLeft: 0, paddingRight: 16, backgroundColor: "#1F1F21" } : { backgroundColor: "#1F1F21" }}><Translate value="appBar.optionsDrawer.mapOverlays" /></ListSubheader>
				}>
				{!nauticalChartsEnabled ? null : <ListItem
					sx={styles.listItem}
				>
					<ListItemText
						primary={getTranslation("appBar.optionsDrawer.nauticalCharts")}
						primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"}` }}
					/>
					<Switch
						edge="end"
						onChange={() => handleSettingsUpdate({
							nauticalChartsVisible: !nauticalChartsVisible
						})}
						checked={nauticalChartsVisible}
						classes={{
							thumb: nauticalChartsVisible ? classes.thumbSwitched : classes.thumbOff,
							track: nauticalChartsVisible ? classes.trackSwitched : classes.trackOff
						}}
					/>
				</ListItem>}
				<ListItem
					sx={styles.listItem}
				>
					<ListItemText
						primary={getTranslation("appBar.optionsDrawer.roadsLabel")}
						primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${roadsVisible ? "toggle-on" : "toggle-off"}` }}
					/>
					<Switch
						edge="end"
						onChange={() => handleSettingsUpdate({ roadsVisible: !roadsVisible })}
						checked={roadsVisible}
						classes={{
							thumb: roadsVisible ? classes.thumbSwitched : classes.thumbOff,
							track: roadsVisible ? classes.trackSwitched : classes.trackOff
						}}
					/>
				</ListItem>
				{!weatherEnabled ? null : <ListItem
					sx={styles.listItem}
				>
					<ListItemText
						primary={getTranslation("appBar.optionsDrawer.weatherRadar")}
						primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${weatherVisible ? "toggle-on" : "toggle-off"}` }}
					/>
					<Switch
						edge="end"
						onChange={() => handleSettingsUpdate({ weatherVisible: !weatherVisible })}
						checked={weatherVisible}
						classes={{
							thumb: weatherVisible ? classes.thumbSwitched : classes.thumbOff,
							track: weatherVisible ? classes.trackSwitched : classes.trackOff
						}}
					/>
				</ListItem>}
			</List>
		</Drawer>
	);
};

export default OptionsDrawer;
