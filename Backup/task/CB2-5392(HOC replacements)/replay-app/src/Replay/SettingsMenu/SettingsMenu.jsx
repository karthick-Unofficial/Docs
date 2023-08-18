import React, { memo } from "react";
import { Drawer, Divider, List, Typography } from "@material-ui/core";
import TileOptions from "./TileOptions/TileOptions";
import LayerToggle from "./LayerToggle/LayerToggle";
import { GISControl } from "orion-components/Map/Controls";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	replayMapObject,
	persistedState,
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
import {
	userFeedsSelector,
	gisDataSelector,
	gisStateSelector
} from "orion-components/GlobalData/Selectors";
import {
	updatePersistedState,
	setLocalAppState,
	createService,
	getGISLayers,
	turnOffGISLayer,
	resetGISRequest,
	updateVisibleGIS,
	updateGISService,
	deleteGISService,
	showFOVs,
	hideFOVs,
	closeSettingsMenu
} from "./settingsMenuActions";


const handleLayerToggle = (layerRef, disabledFeeds, dispatch) => {
	let update = [...disabledFeeds];

	if (_.includes(update, layerRef)) {
		_.pull(update, layerRef);
	} else {
		update = _.concat(update, layerRef);
	}

	if (!window.api) {
		dispatch(updatePersistedState("replay-app", "disabledFeeds", { disabledFeeds: update }));
	}
	else {
		dispatch(setLocalAppState("disabledFeeds", update));
	}
};

const handleFOVToggle = (showAllFOVs, dispatch) => {
	showAllFOVs ? dispatch(hideFOVs()) : dispatch(showFOVs());
};

const styles = {
	height: 48,
	lineHeight: "48px",
	backgroundColor: "#41454a",
	position: "relative",
	alignItems: "center",
	display: "flex",
	paddingLeft: 24,
	zIndex: 600,
	paddingRight: 6
};

const SettingsMenuWrapper = () => {
	const open = useSelector(state => state.appState.settingsMenu.open);
	const baseMaps = useSelector(state => state.baseMaps);
	const userFeeds = useSelector(state => userFeedsSelector(state));
	const clientConfig = useSelector(state => state.clientConfig);
	const nauticalChartsEnabled = _.size(clientConfig) && clientConfig.mapSettings.nauticalChartsEnabled;
	const gisData = useSelector(state => window.api ? null : gisDataSelector(state));
	const gisState = useSelector(state => window.api ? null : gisStateSelector(state));
	const map = useSelector(state => replayMapObject(state));
	const showAllFOVs = useSelector(state => persistedState(state).showAllFOVs || false);
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
	const dir = useSelector(state => getDir(state));
	return <SettingsMenu
		open={open}
		showAllFOVs={showAllFOVs}
		userFeeds={userFeeds}
		disabledFeeds={disabledFeeds}
		gisData={gisData}
		gisState={gisState}
		baseMaps={baseMaps}
		dir={dir}
		nauticalChartsEnabled={nauticalChartsEnabled}
	/>;
};

const SettingsMenu = memo(({
	open,
	showAllFOVs,
	userFeeds,
	disabledFeeds,
	gisData,
	gisState,
	baseMaps,
	dir,
	nauticalChartsEnabled
}) => {

	const dispatch = useDispatch();
	console.log("#disableFeeds", disabledFeeds);
	return (
		<Drawer
			anchor={dir === "ltr" ? "left" : "right"}
			open={open}
			onClose={() => dispatch(closeSettingsMenu())}
			PaperProps={{ style: { width: 300, backgroundColor: "#1f1f21" } }}
		>
			<div style={{ margin: 16 }}>
				<TileOptions baseMaps={baseMaps} />
			</div>
			<Divider />
			<div style={{ margin: "0 16px", padding: "8px 0px" }}>
				<LayerToggle
					label={getTranslation("replay.settingsMenu.settings.map")}
					updateKey="entityLabels"
				/>
				<LayerToggle
					label={getTranslation("replay.settingsMenu.settings.camera")}
					updateKey="showAllFOVs"

					visible={showAllFOVs}
					customVisibleChange={() => handleFOVToggle(showAllFOVs, dispatch)}
				/>
			</div>
			<Divider />
			<div style={{ margin: "0 16px", padding: "16px 0px 8px" }}>
				<div style={{ height: 32 }}>
					<Typography variant="h6"><Translate value="replay.settingsMenu.settings.overlays" /></Typography>
				</div>
				{!nauticalChartsEnabled ? null : <LayerToggle
					label={getTranslation("replay.settingsMenu.settings.charts")}
					updateKey="nauticalCharts"
					withOpacity={true}
				/>}
				<LayerToggle
					label={getTranslation("replay.settingsMenu.settings.road")}
					updateKey="roadsAndLabels"
					withOpacity={true}
				/>
			</div>

			{gisData &&
				<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
			}
			{gisData &&
				<GISControl
					app="replay-app"
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
					readOnly={true}
				/>
			}
			<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
			<div style={{ margin: "0 16px", padding: "16px 0px 8px", maxHeight: 730 }}>
				<div style={{ height: 32 }}>
					<Typography variant="h6"><Translate value="replay.settingsMenu.settings.feeds" /></Typography>
				</div>
				<List style={{ height: "calc(100% - 35px)" }}>
					{userFeeds
						.filter(feed => {
							return (
								!_.includes(feed.feedId, "shapes") && feed.canView === true
							);
						})
						.map(feed => {
							return (
								<LayerToggle
									key={feed.feedId}
									label={feed.name}
									updateKey={feed.feedId}
									visible={!disabledFeeds.includes(feed.feedId)}
									customVisibleChange={() => handleLayerToggle(feed.feedId, disabledFeeds, dispatch)}
								/>
							);
						})}
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.events")}
						updateKey="Event"
						visible={!disabledFeeds.includes("Event")}
						customVisibleChange={() => handleLayerToggle("Event", disabledFeeds, dispatch)}
					/>
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.points")}
						updateKey="Point"
						visible={!disabledFeeds.includes("Point")}
						customVisibleChange={() => handleLayerToggle("Point", disabledFeeds, dispatch)}
					/>
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.polygons")}
						updateKey="Polygon"
						visible={!disabledFeeds.includes("Polygon")}
						customVisibleChange={() => handleLayerToggle("Polygon", disabledFeeds, dispatch)}
					/>
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.lines")}
						updateKey="Line"
						visible={!disabledFeeds.includes("Line")}
						customVisibleChange={() => handleLayerToggle("Line", disabledFeeds, dispatch)}
					/>
				</List>
			</div>
		</Drawer>
	);
}, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});


export default SettingsMenuWrapper;
