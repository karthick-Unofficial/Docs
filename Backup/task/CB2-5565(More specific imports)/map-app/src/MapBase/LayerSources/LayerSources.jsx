import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Layer } from "react-mapbox-gl";
import _ from "lodash";
import { AlertLayer } from "orion-components/Map/Layers";
import MapControls from "./MapControls/MapControls";

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

import {
	userFeedsSelector,
	gisLayerSelector,
	activeEventsSelector
} from "orion-components/GlobalData/Selectors"; // Remove once all entites selector added

import {
	mapSettingsSelector,
	persistedState,
	disabledFeedsSelector,
	layerOpacitySelector,
	nauticalChartLayerOpacitySelector,
	roadAndLabelLayerOpacitySelector,
	weatherRadarLayerOpacitySelector,
	ssrRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	mapFiltersSelector,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import { useSelector, shallowEqual } from "react-redux";

import { loadGISProfile, loadProfile, showFOVs, updateSsrRadarTiles } from "./layerSourcesActions.js";


const propTypes = {
	map: PropTypes.object.isRequired
};

const LayerSources = (props) => {

	const { map } = props;

	const settings = useSelector(state => mapSettingsSelector(state));
	const filters = useSelector(state => _.map(mapFiltersSelector(state), entity =>
		_.get(entity, "entityData.properties.id")
	), shallowEqual);
	const showAllFOVs = useSelector(state => persistedState(state).showAllFOVs);
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));
	const events = useSelector(state => activeEventsSelector(state));
	const trackHistory = useSelector(state => trackHistorySelector(state, disabledFeeds));
	const activeFOVs = useSelector(state =>
		state.globalData.fovs.data && !_.isEmpty(state.globalData.fovs.data)
			? state.globalData.fovs.data
			: null, shallowEqual);

	// Pass down as object
	const activeFeeds = useSelector(state => _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (
					feed &&
					!_.includes(disabledFeeds, feed.feedId) &&
					feed.entityType !== "facility" &&
					state.globalData[feed.feedId] &&
					!_.isEmpty(state.globalData[feed.feedId].data) &&
					state.globalGeo[feed.feedId] &&
					!_.isEmpty(state.globalGeo[feed.feedId].data)
				);
			}
		), "feedId"), shallowEqual);

	const facilityFeeds = useSelector(state => _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (
					feed &&
					!_.includes(disabledFeeds, feed.feedId) &&
					feed.entityType === "facility" &&
					state.globalData[feed.feedId] &&
					!_.isEmpty(state.globalData[feed.feedId].data) &&
					state.globalGeo[feed.feedId] &&
					!_.isEmpty(state.globalGeo[feed.feedId].data)
				);
			}
		), "feedId"), shallowEqual);


	const context = useSelector(state => selectedContextSelector(state));
	let event;
	if (context && context.entity && context.entity.entityType === "event") {
		event = context.entity;
	}
	const gisLayers = useSelector(state => gisLayerSelector(state));
	const mapTools = useSelector(state => state.mapState.mapTools);
	const nauticalChartsEnabled = useSelector(state => state.clientConfig.mapSettings.nauticalChartsEnabled);
	const weatherEnabled = useSelector(state => state.clientConfig.mapSettings.weatherEnabled);
	// const { nauticalChartsEnabled, weatherEnabled } = clientConfig.mapSettings;

	// const primaryOpen = useSelector(state => contextPanelState(state).primaryOpen);
	// const secondaryOpen = useSelector(state => contextPanelState(state).secondaryOpen);
	// const layerOpacity = useSelector(state => layerOpacitySelector(state));

	const nauticalChartLayerOpacity = useSelector(state => nauticalChartLayerOpacitySelector(state));
	const roadAndLabelLayerOpacity = useSelector(state => roadAndLabelLayerOpacitySelector(state));
	const weatherRadarLayerOpacity = useSelector(state => weatherRadarLayerOpacitySelector(state));
	const ssrRadarLayerOpacity = useSelector(state => ssrRadarLayerOpacitySelector(state));
	const aerisKey = useSelector(state => state.clientConfig.mapSettings.AERIS_API_KEY);
	const spotlights = useSelector(state => state.spotlights);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const ssrRadarOverlayEnabled = useSelector(state => !!state.clientConfig.ssrRadarOverlayEnabled);
	const ssrRadarTiles = useSelector(state => state.ssrRadarTiles);
	const ssrRadarTileUpdateInterval = useSelector(state => state.clientConfig.ssrRadarTileUpdateInterval);


	const [nauticalChartsVisible, setNauticalChartsVisible] = useState(false);
	const [roadsVisible, setRoadsVisible] = useState(false);
	const [weatherVisible, setWeatherVisible] = useState(false);
	const [ssrRadarVisible, setssrRadarVisible] = useState(false);
	useEffect(() => {
		setNauticalChartsVisible(settings.nauticalChartsVisible || false);
		setRoadsVisible(settings.roadsVisible || false);
		setWeatherVisible(settings.weatherVisible || false);
		setssrRadarVisible(settings.ssrRadarVisible || false);
		setMapName(settings.mapStyle);
		setLabelsVisible(settings.entityLabelsVisible);
		setEventsVisible(!disabledFeeds.includes("Event"));
		setSelectedEntity(context ? context.entity : null);
	}, [settings]);



	const [mapName, setMapName] = useState(null);
	const [labelsVisible, setLabelsVisible] = useState(null);
	const [eventsVisible, setEventsVisible] = useState(null);
	const [selectedEntity, setSelectedEntity] = useState(null);

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