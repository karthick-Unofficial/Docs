import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Layer } from "react-mapbox-gl";
import _ from "lodash";
import { AlertLayer } from "orion-components/Map/Layers";
import { default as MapControls } from "./MapControls/MapControlsContainer";

// Layer components
import WeatherLayer from "./Layers/WeatherLayer";
import NauticalChartsLayer from "./Layers/NauticalChartsLayer";
import TrackHistoryLayers from "./Layers/TrackHistoryLayers";
import SSRRadarLayers from "./Layers/SSRRadarLayers";
import FacilityLayers from "./Layers/FacilityLayers";
import GisLayers from "./Layers/GisLayers";
import SpotlightLayers from "./Layers/SpotlightLayers";
import EventLayers from "./Layers/EventLayers";
import FeedLayers from "./Layers/FeedLayers";
import FovLayers from "./Layers/FovLayers";

const propTypes = {
	showAllFOVs: PropTypes.bool,
	showFOVs: PropTypes.func,
	activeFOVs: PropTypes.object,
	map: PropTypes.object.isRequired,
	activeFeeds: PropTypes.array,
	facilityFeeds: PropTypes.array,
	events: PropTypes.object,
	eventsVisible: PropTypes.bool,
	ssrRadarOverlayEnabled: PropTypes.bool,
	ssrRadarVisible: PropTypes.bool,
	updateSsrRadarTiles: PropTypes.func,
	loadProfile: PropTypes.func,
	loadGISProfile: PropTypes.func,
	event: PropTypes.object,
	roadAndLabelLayerOpacity: PropTypes.number,
	ssrRadarTiles: PropTypes.object,
	ssrRadarLayerOpacity: PropTypes.number,
	ssrRadarTileUpdateInterval: PropTypes.number,
	trackHistory: PropTypes.object,
	timeFormatPreference: PropTypes.string,
	spotlights: PropTypes.object,
	mapTools: PropTypes.object,
	labelsVisible: PropTypes.bool,
	gisLayers: PropTypes.object,
	weatherVisible: PropTypes.bool,
	weatherRadarLayerOpacity: PropTypes.number,
	aerisKey: PropTypes.string,
	nauticalChartsVisible: PropTypes.bool,
	nauticalChartLayerOpacity: PropTypes.number,
	filters: PropTypes.array,
	roadsVisible: PropTypes.bool
};

const LayerSources = ({
	showAllFOVs,
	showFOVs,
	activeFOVs,
	map,
	activeFeeds,
	facilityFeeds,
	events,
	eventsVisible,
	ssrRadarOverlayEnabled,
	ssrRadarVisible,
	updateSsrRadarTiles,
	loadProfile,
	loadGISProfile,
	event,
	roadAndLabelLayerOpacity,
	ssrRadarTiles,
	ssrRadarLayerOpacity,
	ssrRadarTileUpdateInterval,
	trackHistory,
	timeFormatPreference,
	spotlights,
	mapTools,
	labelsVisible,
	gisLayers,
	weatherVisible,
	weatherRadarLayerOpacity,
	aerisKey,
	nauticalChartsVisible,
	nauticalChartLayerOpacity,
	filters,
	roadsVisible,
	nauticalChartsEnabled,
	weatherEnabled
}) => {
	const [styleDataHandlersSet, setStyleDataHandlersSet] = useState(false);
	const [mouseMovedHandlersSet, setMouseMovedHandlersSet] = useState(false);

	useEffect(() => {
		const mouseMoved = e => {
			const features = _.filter(
				map.queryRenderedFeatures(e.point),
				// Make sure layers aren't coming from Mapbox or are FOVs
				feature =>
					feature.layer.source !== "mapbox" &&
					feature.layer.source !== "composite" &&
					!_.includes(feature.layer.source, "fov")
			);

			if (!mapTools.type) {
				map.getCanvas().style.cursor = features.length ? "pointer" : "";
			}
		};

		if (mouseMovedHandlersSet) {
			map.off("mousemove", mouseMoved);
		}
		else {
			setMouseMovedHandlersSet(true);
		}

		// Add event click handlers
		map.on("mousemove", mouseMoved);
	}, [map, mapTools, mouseMovedHandlersSet]);

	const setRoadsAndLabels = () => {
		// Get all layers that contain roads or labels
		const roadsAndLabels = map.getStyle().layers.filter(layer => {
			return (
				layer["source-layer"] &&
				(layer["source-layer"].includes("road") ||
					layer["source-layer"].includes("label"))
			);
		});

		// Set layer visibility & opacity
		roadsAndLabels.map(layer => {
			if (roadsVisible) {
				if (layer.type === "line") {
					return map
						.setLayoutProperty(layer.id, "visibility", "visible")
						.setPaintProperty(
							layer.id,
							"line-opacity",
							roadAndLabelLayerOpacity
						);
				} else if (layer.type === "symbol") {
					return map
						.setLayoutProperty(layer.id, "visibility", "visible")
						.setPaintProperty(
							layer.id,
							"text-opacity",
							roadAndLabelLayerOpacity
						)
						.setPaintProperty(
							layer.id,
							"icon-opacity",
							roadAndLabelLayerOpacity
						);
				}
			} else {
				return map.setLayoutProperty(layer.id, "visibility", "none");
			}
		});
	};

	useEffect(() => {
		setRoadsAndLabels();
	}, [map, roadsVisible, roadAndLabelLayerOpacity]);

	useEffect(() => {
		const styleDataChanged = e => {
			// TODO: look for better event to handle roads and label layer toggle. This fires repeatedly
			setRoadsAndLabels(roadsVisible);
		};

		if (styleDataHandlersSet) {
			map.off("styledata", styleDataChanged);
		}
		else {
			setStyleDataHandlersSet(true);
		}

		// Fired when style data loads or changes
		map.on("styledata", styleDataChanged);
	}, [map, roadsVisible, roadAndLabelLayerOpacity, styleDataHandlersSet]);

	return (
		<Fragment>
			{/* Layers for enforcing layer ordering */}
			<Layer id="---ac2-alerts-position-end" type="symbol" />
			<Layer id="---ac2-clusters-position-end" before="---ac2-alerts-position-end" type="symbol" />
			<Layer id="---ac2-feed-entities-position-end" before="---ac2-clusters-position-end" type="symbol" />
			<Layer id="---ac2-distance-tool-position-end" before="---ac2-feed-entities-position-end" type="symbol" />
			<Layer id="---ac2-gis-points-position-end" before="---ac2-distance-tool-position-end" type="symbol" />
			<Layer id="---ac2-track-history-position-end" before="---ac2-gis-points-position-end" type="symbol" />
			<Layer id="---ac2-linestrings-position-end" before="---ac2-track-history-position-end" type="symbol" />
			<Layer id="---ac2-gis-linestrings-position-end" before="---ac2-linestrings-position-end" type="symbol" />
			<Layer id="---ac2-weather-position-end" before="---ac2-gis-linestrings-position-end" type="symbol" />
			<Layer id="---ac2-floorplans-position-end" before="---ac2-weather-position-end" type="symbol" />
			<Layer id="---ac2-event-proximities-position-end" before="---ac2-floorplans-position-end" type="symbol" />
			<Layer id="---ac2-polygons-position-end" before="---ac2-event-proximities-position-end" type="symbol" />
			<Layer id="---ac2-gis-polygons-position-end" before="---ac2-polygons-position-end" type="symbol" />
			<Layer id="---ac2-multipolygons-position-end" before="---ac2-gis-polygons-position-end" type="symbol" />
			<Layer id="---ac2-gis-multipolygons-position-end" before="---ac2-multipolygons-position-end" type="symbol" />
			<Layer id="---ac2-nautical-charts-position-end" before="---ac2-gis-multipolygons-position-end" type="symbol" />

			<MapControls />
			<AlertLayer map={map} before="---ac2-alerts-position-end" />

			<SpotlightLayers
				spotlights={spotlights}
				mapTools={mapTools}
			/>

			<GisLayers
				gisLayers={gisLayers}
				loadGISProfile={loadGISProfile}
				labelsVisible={labelsVisible}
				map={map}
			/>

			<FeedLayers
				activeFeeds={activeFeeds}
				map={map}
			/>

			<FovLayers
				activeFOVs={activeFOVs}
				showAllFOVs={showAllFOVs}
				activeFeeds={activeFeeds}
				showFOVs={showFOVs}
				map={map}
			/>

			{!weatherEnabled ? null : <WeatherLayer
				weatherVisible={weatherVisible}
				weatherRadarLayerOpacity={weatherRadarLayerOpacity}
				aerisKey={aerisKey}
			/>}

			{ssrRadarOverlayEnabled && ssrRadarVisible &&
				<SSRRadarLayers
					updateSsrRadarTiles={updateSsrRadarTiles}
					ssrRadarVisible={ssrRadarVisible}
					ssrRadarOverlayEnabled={ssrRadarOverlayEnabled}
					ssrRadarTiles={ssrRadarTiles}
					ssrRadarLayerOpacity={ssrRadarLayerOpacity}
					ssrRadarTileUpdateInterval={ssrRadarTileUpdateInterval}
					map={map}
				/>
			}

			{!nauticalChartsEnabled ? null : <NauticalChartsLayer
				nauticalChartsVisible={nauticalChartsVisible}
				nauticalChartLayerOpacity={nauticalChartLayerOpacity}
			/>}

			<EventLayers
				events={events}
				filters={filters}
				eventsVisible={eventsVisible}
				event={event}
				map={map}
				loadProfile={loadProfile}
			/>

			<FacilityLayers
				facilityFeeds={facilityFeeds}
			/>

			<TrackHistoryLayers
				map={map}
				trackHistory={trackHistory}
				timeFormatPreference={timeFormatPreference}
			/>
		</Fragment>
	);
};

LayerSources.propTypes = propTypes;

export default LayerSources;