import React, { memo } from "react";
import PropTypes from "prop-types";
import { Drawer, Divider, List, Typography } from "@material-ui/core";
import TileOptionsContainer from "./TileOptions/TileOptionsContainer";
import LayerToggleContainer from "./LayerToggle/LayerToggleContainer";
import { GISControl } from "orion-components/Map/Controls";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	closeSettingsMenu: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	userFeeds: PropTypes.array,
	disabledFeeds: PropTypes.array,
	hideFOVs: PropTypes.func,
	showFOVs: PropTypes.func,
	showAllFOVs: PropTypes.bool,
	baseMaps: PropTypes.array,
	dir: PropTypes.string
};

const handleLayerToggle = (layerRef, disabledFeeds, updatePersistedState, setLocalAppState) => {
	let update = [...disabledFeeds];

	if (_.includes(update, layerRef)) {
		_.pull(update, layerRef);
	} else {
		update = _.concat(update, layerRef);
	}

	if (!window.api) {
		updatePersistedState("replay-app", "disabledFeeds", { disabledFeeds: update });
	}
	else {
		setLocalAppState("disabledFeeds", update);
	}
};

const handleFOVToggle = (showAllFOVs, showFOVs, hideFOVs) => {
	showAllFOVs ? hideFOVs() : showFOVs();
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

const SettingsMenu = ({
	closeSettingsMenu,
	open,
	hideFOVs,
	showFOVs,
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
	updatePersistedState,
	setLocalAppState,
	baseMaps,
	dir,
	nauticalChartsEnabled
}) => {
	return (
		<Drawer
			anchor={dir === "ltr" ? "left" : "right"}
			open={open}
			onClose={closeSettingsMenu}
			PaperProps={{ style: { width: 300, backgroundColor: "#1f1f21" } }}
		>
			<div style={{ margin: 16 }}>
				<TileOptionsContainer baseMaps={baseMaps} />
			</div>
			<Divider />
			<div style={{ margin: "0 16px", padding: "8px 0px" }}>
				<LayerToggleContainer
					label={getTranslation("replay.settingsMenu.settings.map")}
					updateKey="entityLabels"
				/>
				<LayerToggleContainer
					label={getTranslation("replay.settingsMenu.settings.camera")}
					updateKey="showAllFOVs"

					visible={showAllFOVs}
					customVisibleChange={() => handleFOVToggle(showAllFOVs, showFOVs, hideFOVs)}
				/>
			</div>
			<Divider />
			<div style={{ margin: "0 16px", padding: "16px 0px 8px" }}>
				<div style={{ height: 32 }}>
					<Typography variant="h6"><Translate value="replay.settingsMenu.settings.overlays" /></Typography>
				</div>
				{!nauticalChartsEnabled ? null : <LayerToggleContainer
					label={getTranslation("replay.settingsMenu.settings.charts")}
					updateKey="nauticalCharts"
					withOpacity={true}
				/>}
				<LayerToggleContainer
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
								<LayerToggleContainer
									key={feed.feedId}
									label={feed.name}
									updateKey={feed.feedId}
									visible={!disabledFeeds.includes(feed.feedId)}
									customVisibleChange={() => handleLayerToggle(feed.feedId, disabledFeeds, updatePersistedState, setLocalAppState)}
								/>
							);
						})}
					<LayerToggleContainer
						label={getTranslation("replay.settingsMenu.settings.events")}
						updateKey="Event"
						visible={!disabledFeeds.includes("Event")}
						customVisibleChange={() => handleLayerToggle("Event", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
					<LayerToggleContainer
						label={getTranslation("replay.settingsMenu.settings.points")}
						updateKey="Point"
						visible={!disabledFeeds.includes("Point")}
						customVisibleChange={() => handleLayerToggle("Point", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
					<LayerToggleContainer
						label={getTranslation("replay.settingsMenu.settings.polygons")}
						updateKey="Polygon"
						visible={!disabledFeeds.includes("Polygon")}
						customVisibleChange={() => handleLayerToggle("Polygon", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
					<LayerToggleContainer
						label={getTranslation("replay.settingsMenu.settings.lines")}
						updateKey="Line"
						visible={!disabledFeeds.includes("Line")}
						customVisibleChange={() => handleLayerToggle("Line", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
				</List>
			</div>
		</Drawer>
	);
};

SettingsMenu.propTypes = propTypes;

export default memo(SettingsMenu, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
