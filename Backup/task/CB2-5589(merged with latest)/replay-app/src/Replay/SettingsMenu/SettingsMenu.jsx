import React, { memo } from "react";
import { Drawer, Divider, List, Typography } from "@mui/material";
import TileOptions from "./TileOptions/TileOptions";
import LayerToggle from "./LayerToggle/LayerToggle";
import { GISControl } from "orion-components/Map/Controls";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { persistedState, disabledFeedsSelector } from "orion-components/AppState/Selectors";
import { userFeedsSelector, gisDataSelector, gisStateSelector } from "orion-components/GlobalData/Selectors";
import * as actionCreators from "./settingsMenuActions";
import includes from "lodash/includes";
import pull from "lodash/pull";
import concat from "lodash/concat";
import size from "lodash/size";
import isUndefined from "lodash/isUndefined";
import isEqual from "lodash/isEqual";

const handleLayerToggle = (layerRef, disabledFeeds, updatePersistedState, setLocalAppState, dispatch) => {
	let update = [...disabledFeeds];

	if (includes(update, layerRef)) {
		pull(update, layerRef);
	} else {
		update = concat(update, layerRef);
	}

	if (!window.api) {
		dispatch(
			updatePersistedState("replay-app", "disabledFeeds", {
				disabledFeeds: update
			})
		);
	} else {
		dispatch(setLocalAppState("disabledFeeds", update));
	}
};

const handleFOVToggle = (showAllFOVs, showFOVs, hideFOVs, dispatch) => {
	showAllFOVs ? dispatch(hideFOVs()) : dispatch(showFOVs());
};

const SettingsMenuWrapper = () => {
	const open = useSelector((state) => state.appState.settingsMenu.open);
	const baseMaps = useSelector((state) => state.baseMaps);
	const userFeeds = useSelector((state) => userFeedsSelector(state));
	const clientConfig = useSelector((state) => state.clientConfig);
	const nauticalChartsEnabled = size(clientConfig) && clientConfig.mapSettings.nauticalChartsEnabled;
	const gisData = useSelector((state) => (window.api ? null : gisDataSelector(state)));
	const gisState = useSelector((state) => (window.api ? null : gisStateSelector(state)));
	const showAllFOVs = useSelector((state) => persistedState(state).showAllFOVs || false);
	const disabledFeeds = useSelector((state) => disabledFeedsSelector(state));
	const dir = useSelector((state) => getDir(state));

	const roadsAndLabels = useSelector((state) =>
		state.appState.persisted.mapSettings ? state.appState.persisted.mapSettings["roadsAndLabels"] : null
	);
	const roadsOpacity = roadsAndLabels && !isUndefined(roadsAndLabels.opacity) ? roadsAndLabels.opacity : 1;
	const roadsVisible = roadsAndLabels && roadsAndLabels.visible;

	const nauticalCharts = useSelector((state) =>
		state.appState.persisted.mapSettings ? state.appState.persisted.mapSettings["nauticalCharts"] : null
	);
	const nauticalChartsVisible = nauticalCharts && nauticalCharts.visible;
	const nauticalChartsOpacity = nauticalCharts && !isUndefined(nauticalCharts.opacity) ? nauticalCharts.opacity : 1;

	const entityLabels = useSelector((state) =>
		state.appState.persisted.mapSettings ? state.appState.persisted.mapSettings["entityLabels"] : null
	);
	const entityLabelsVisible = entityLabels && entityLabels.visible;
	const coordsOnCursor = useSelector((state) =>
		state.appState.persisted.mapSettings ? !!state.appState.persisted.mapSettings["coordsOnCursor"] : false
	);

	return (
		<SettingsMenu
			open={open}
			showAllFOVs={showAllFOVs}
			userFeeds={userFeeds}
			disabledFeeds={disabledFeeds}
			gisData={gisData}
			gisState={gisState}
			baseMaps={baseMaps}
			dir={dir}
			nauticalChartsEnabled={nauticalChartsEnabled}
			roadsVisible={roadsVisible}
			roadsOpacity={roadsOpacity}
			nauticalChartsVisible={nauticalChartsVisible}
			nauticalChartsOpacity={nauticalChartsOpacity}
			entityLabelsVisible={entityLabelsVisible}
			coordsOnCursor={coordsOnCursor}
			{...actionCreators}
		/>
	);
};

const SettingsMenu = memo(
	({
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
		nauticalChartsEnabled,
		roadsVisible,
		roadsOpacity,
		nauticalChartsVisible,
		nauticalChartsOpacity,
		entityLabelsVisible,
		coordsOnCursor
	}) => {
		const dispatch = useDispatch();
		return (
			<Drawer
				anchor={dir === "ltr" ? "left" : "right"}
				open={open}
				onClose={() => dispatch(closeSettingsMenu())}
				PaperProps={{
					style: { width: 300, backgroundColor: "#1f1f21" }
				}}
			>
				<div style={{ margin: 16 }}>
					<TileOptions baseMaps={baseMaps} />
				</div>
				<Divider />
				<div style={{ margin: "0 16px", padding: "8px 0px" }}>
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.map")}
						updateKey="entityLabels"
						visible={entityLabelsVisible}
					/>

					<LayerToggle
						label={getTranslation("global.appBar.optionsDrawer.coordsOnCursor")}
						updateKey="coordsOnCursor"
						visible={coordsOnCursor}
					/>
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.camera")}
						updateKey="showAllFOVs"
						visible={showAllFOVs}
						customVisibleChange={() => handleFOVToggle(showAllFOVs, showFOVs, hideFOVs, dispatch)}
					/>
				</div>
				<Divider />
				<div style={{ margin: "0 16px", padding: "16px 0px 8px" }}>
					<div style={{ height: 32 }}>
						<Typography variant="h6">
							<Translate value="replay.settingsMenu.settings.overlays" />
						</Typography>
					</div>
					{!nauticalChartsEnabled ? null : (
						<LayerToggle
							label={getTranslation("replay.settingsMenu.settings.charts")}
							updateKey="nauticalCharts"
							withOpacity={true}
							visible={nauticalChartsVisible}
							opacity={nauticalChartsOpacity}
						/>
					)}
					<LayerToggle
						label={getTranslation("replay.settingsMenu.settings.road")}
						updateKey="roadsAndLabels"
						withOpacity={true}
						visible={roadsVisible}
						opacity={roadsOpacity}
					/>
				</div>

				{gisData && <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />}
				{gisData && (
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
				)}
				<Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
				<div
					style={{
						margin: "0 16px",
						padding: "16px 0px 8px",
						maxHeight: 730
					}}
				>
					<div style={{ height: 32 }}>
						<Typography variant="h6">
							<Translate value="replay.settingsMenu.settings.feeds" />
						</Typography>
					</div>
					<List style={{ height: "calc(100% - 35px)" }}>
						{userFeeds
							.filter((feed) => {
								return !includes(feed.feedId, "shapes") && feed.canView === true;
							})
							.map((feed) => {
								return (
									<LayerToggle
										key={feed.feedId}
										label={feed.name}
										updateKey={feed.feedId}
										visible={!disabledFeeds.includes(feed.feedId)}
										customVisibleChange={() =>
											handleLayerToggle(
												feed.feedId,
												disabledFeeds,
												updatePersistedState,
												setLocalAppState,
												dispatch
											)
										}
									/>
								);
							})}
						<LayerToggle
							label={getTranslation("replay.settingsMenu.settings.events")}
							updateKey="Event"
							visible={!disabledFeeds.includes("Event")}
							customVisibleChange={() =>
								handleLayerToggle(
									"Event",
									disabledFeeds,
									updatePersistedState,
									setLocalAppState,
									dispatch
								)
							}
						/>
						<LayerToggle
							label={getTranslation("replay.settingsMenu.settings.points")}
							updateKey="Point"
							visible={!disabledFeeds.includes("Point")}
							customVisibleChange={() =>
								handleLayerToggle(
									"Point",
									disabledFeeds,
									updatePersistedState,
									setLocalAppState,
									dispatch
								)
							}
						/>
						<LayerToggle
							label={getTranslation("replay.settingsMenu.settings.polygons")}
							updateKey="Polygon"
							visible={!disabledFeeds.includes("Polygon")}
							customVisibleChange={() =>
								handleLayerToggle(
									"Polygon",
									disabledFeeds,
									updatePersistedState,
									setLocalAppState,
									dispatch
								)
							}
						/>
						<LayerToggle
							label={getTranslation("replay.settingsMenu.settings.lines")}
							updateKey="Line"
							visible={!disabledFeeds.includes("Line")}
							customVisibleChange={() =>
								handleLayerToggle(
									"Line",
									disabledFeeds,
									updatePersistedState,
									setLocalAppState,
									dispatch
								)
							}
						/>
					</List>
				</div>
			</Drawer>
		);
	},
	(prevProps, nextProps) => {
		if (!isEqual(prevProps, nextProps)) {
			return false;
		}
		return true;
	}
);

SettingsMenu.displayName = "SettingsMenu";

export default SettingsMenuWrapper;
