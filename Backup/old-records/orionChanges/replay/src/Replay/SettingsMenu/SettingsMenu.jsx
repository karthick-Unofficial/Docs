import React, { memo } from "react";
import PropTypes from "prop-types";
import { Drawer, Divider, List, Typography } from "@material-ui/core";
import TileOptionsContainer from "./TileOptions/TileOptionsContainer";
import LayerToggleContainer from "./LayerToggle/LayerToggleContainer";
import { GISControl } from "orion-components/Map/Controls";
import _ from "lodash";

const propTypes = {
	closeSettingsMenu: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	userFeeds: PropTypes.array,
	disabledFeeds: PropTypes.array,
	hideFOVs: PropTypes.func,
	showFOVs: PropTypes.func,
	showAllFOVs: PropTypes.bool,
	baseMaps: PropTypes.array
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
	baseMaps
}) => {
	return (
		<Drawer
			anchor="left"
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
					label="Map Labels"
					updateKey="entityLabels"
				/>
				<LayerToggleContainer
					label="Camera FOVs"
					updateKey="showAllFOVs"

					visible={showAllFOVs}
					customVisibleChange={() => handleFOVToggle(showAllFOVs, showFOVs, hideFOVs)}
				/>
			</div>
			<Divider />
			<div style={{ margin: "0 16px", padding: "16px 0px 8px" }}>
				<div style={{ height: 32 }}>
					<Typography variant="h6">MAP OVERLAYS</Typography>
				</div>
				<LayerToggleContainer
					label="Nautical Charts"
					updateKey="nauticalCharts"
					withOpacity={true}
				/>
				<LayerToggleContainer
					label="Roads and Labels"
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
				/>
			}
			<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
			<div style={{ margin: "0 16px", padding: "16px 0px 8px", maxHeight: 730 }}>
				<div style={{ height: 32 }}>
					<Typography variant="h6">FEEDS</Typography>
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
						label="Events"
						updateKey="Event"
						visible={!disabledFeeds.includes("Event")}
						customVisibleChange={() => handleLayerToggle("Event", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
					<LayerToggleContainer
						label="Points"
						updateKey="Point"
						visible={!disabledFeeds.includes("Point")}
						customVisibleChange={() => handleLayerToggle("Point", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
					<LayerToggleContainer
						label="Polygons"
						updateKey="Polygon"
						visible={!disabledFeeds.includes("Polygon")}
						customVisibleChange={() => handleLayerToggle("Polygon", disabledFeeds, updatePersistedState, setLocalAppState)}
					/>
					<LayerToggleContainer
						label="Lines"
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
