import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import OrderingLayers from "orion-components/OrderingLayers/OrderingLayers";
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
} from "orion-components/GlobalData/Selectors"; // Remove once all entities selector added

import {
	mapSettingsSelector,
	persistedState,
	disabledFeedsSelector,
	nauticalChartLayerOpacitySelector,
	weatherRadarLayerOpacitySelector,
	ssrRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import {
	mapFiltersSelector,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import { useSelector, shallowEqual } from "react-redux";

import {
	loadGISProfile,
	loadProfile,
	showFOVs,
	updateSsrRadarTiles
} from "./layerSourcesActions.js";

const propTypes = {
	map: PropTypes.object.isRequired
};

const LayerSources = (props) => {
	const { map } = props;

	const settings = useSelector((state) => mapSettingsSelector(state));
	const filters = useSelector(
		(state) =>
			_.map(mapFiltersSelector(state), (entity) =>
				_.get(entity, "entityData.properties.id")
			),
		shallowEqual
	);
	const showAllFOVs = useSelector(
		(state) => persistedState(state).showAllFOVs
	);
	const disabledFeeds = useSelector((state) => disabledFeedsSelector(state));
	const events = useSelector((state) => activeEventsSelector(state));
	const trackHistory = useSelector((state) =>
		trackHistorySelector(state, disabledFeeds)
	);
	const activeFOVs = useSelector(
		(state) =>
			state.globalData.fovs.data && !_.isEmpty(state.globalData.fovs.data)
				? state.globalData.fovs.data
				: null,
		shallowEqual
	);

	// Pass down as object
	const activeFeeds = useSelector(
		(state) =>
			_.map(
				_.filter(_.map(userFeedsSelector(state)), (feed) => {
					return (
						feed &&
						!_.includes(disabledFeeds, feed.feedId) &&
						feed.entityType !== "facility" &&
						state.globalData[feed.feedId] &&
						!_.isEmpty(state.globalData[feed.feedId].data) &&
						state.globalGeo[feed.feedId] &&
						!_.isEmpty(state.globalGeo[feed.feedId].data)
					);
				}),
				"feedId"
			),
		shallowEqual
	);

	const facilityFeeds = useSelector(
		(state) =>
			_.map(
				_.filter(_.map(userFeedsSelector(state)), (feed) => {
					return (
						feed &&
						!_.includes(disabledFeeds, feed.feedId) &&
						feed.entityType === "facility" &&
						state.globalData[feed.feedId] &&
						!_.isEmpty(state.globalData[feed.feedId].data) &&
						state.globalGeo[feed.feedId] &&
						!_.isEmpty(state.globalGeo[feed.feedId].data)
					);
				}),
				"feedId"
			),
		shallowEqual
	);

	const context = useSelector((state) => selectedContextSelector(state));
	let event;
	if (context && context.entity && context.entity.entityType === "event") {
		event = context.entity;
	}
	const gisLayers = useSelector((state) => gisLayerSelector(state));
	const mapTools = useSelector((state) => state.mapState.mapTools);
	const nauticalChartsEnabled = useSelector(
		(state) => state.clientConfig.mapSettings.nauticalChartsEnabled
	);
	const weatherEnabled = useSelector(
		(state) => state.clientConfig.mapSettings.weatherEnabled
	);
	// const { nauticalChartsEnabled, weatherEnabled } = clientConfig.mapSettings;

	// const primaryOpen = useSelector(state => contextPanelState(state).primaryOpen);
	// const secondaryOpen = useSelector(state => contextPanelState(state).secondaryOpen);
	// const layerOpacity = useSelector(state => layerOpacitySelector(state));

	const nauticalChartLayerOpacity = useSelector((state) =>
		nauticalChartLayerOpacitySelector(state)
	);

	const weatherRadarLayerOpacity = useSelector((state) =>
		weatherRadarLayerOpacitySelector(state)
	);
	const ssrRadarLayerOpacity = useSelector((state) =>
		ssrRadarLayerOpacitySelector(state)
	);
	const aerisKey = useSelector(
		(state) => state.clientConfig.mapSettings.AERIS_API_KEY
	);
	const spotlights = useSelector((state) => state.spotlights);
	const timeFormatPreference = useSelector(
		(state) => state.appState.global.timeFormat
	);
	const ssrRadarOverlayEnabled = useSelector(
		(state) => !!state.clientConfig.ssrRadarOverlayEnabled
	);
	const ssrRadarTiles = useSelector(
		(state) => state.ssrRadarTiles,
		shallowEqual
	);
	const ssrRadarTileUpdateInterval = useSelector(
		(state) => state.clientConfig.ssrRadarTileUpdateInterval
	);

	const [nauticalChartsVisible, setNauticalChartsVisible] = useState(false);
	const [weatherVisible, setWeatherVisible] = useState(false);
	const [ssrRadarVisible, setSSRRadarVisible] = useState(false);
	useEffect(() => {
		setNauticalChartsVisible(settings.nauticalChartsVisible || false);
		setWeatherVisible(settings.weatherVisible || false);
		setSSRRadarVisible(settings.ssrRadarVisible || false);
		setLabelsVisible(settings.entityLabelsVisible);
		setEventsVisible(!disabledFeeds.includes("Event"));
	}, [settings]);

	const [labelsVisible, setLabelsVisible] = useState(null);
	const [eventsVisible, setEventsVisible] = useState(null);

	const [mouseMovedHandlersSet, setMouseMovedHandlersSet] = useState(false);

	useEffect(() => {
		const mouseMoved = (e) => {
			const features = _.filter(
				map.queryRenderedFeatures(e.point),
				// Make sure layers aren't coming from Mapbox or are FOVs
				(feature) =>
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
		} else {
			setMouseMovedHandlersSet(true);
		}

		// Add event click handlers
		map.on("mousemove", mouseMoved);
	}, [map, mapTools, mouseMovedHandlersSet]);

	return (
		<Fragment>
			<OrderingLayers />
			<MapControls />
			<AlertLayer map={map} before="---ac2-alerts-position-end" />

			<SpotlightLayers spotlights={spotlights} mapTools={mapTools} />

			<GisLayers
				gisLayers={gisLayers}
				loadGISProfile={loadGISProfile}
				labelsVisible={labelsVisible}
				map={map}
			/>

			<FeedLayers activeFeeds={activeFeeds} map={map} />

			<FovLayers
				activeFOVs={activeFOVs}
				showAllFOVs={showAllFOVs}
				activeFeeds={activeFeeds}
				showFOVs={showFOVs}
				map={map}
			/>

			{!weatherEnabled ? null : (
				<WeatherLayer
					weatherVisible={weatherVisible}
					weatherRadarLayerOpacity={weatherRadarLayerOpacity}
					aerisKey={aerisKey}
				/>
			)}

			{ssrRadarOverlayEnabled && ssrRadarVisible && (
				<SSRRadarLayers
					updateSsrRadarTiles={updateSsrRadarTiles}
					ssrRadarVisible={ssrRadarVisible}
					ssrRadarOverlayEnabled={ssrRadarOverlayEnabled}
					ssrRadarTiles={ssrRadarTiles}
					ssrRadarLayerOpacity={ssrRadarLayerOpacity}
					ssrRadarTileUpdateInterval={ssrRadarTileUpdateInterval}
					map={map}
				/>
			)}

			{!nauticalChartsEnabled ? null : (
				<NauticalChartsLayer
					nauticalChartsVisible={nauticalChartsVisible}
					nauticalChartLayerOpacity={nauticalChartLayerOpacity}
				/>
			)}

			<EventLayers
				events={events}
				filters={filters}
				eventsVisible={eventsVisible}
				event={event}
				map={map}
				loadProfile={loadProfile}
			/>

			<FacilityLayers facilityFeeds={facilityFeeds} />

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
