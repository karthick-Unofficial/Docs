/* eslint react/prop-types: 0 */
import React, { memo, Fragment, useEffect } from "react";
import { Source, Layer } from "react-mapbox-gl";
import MapLayer from "./MapLayer/MapLayer";
import { BasicLayer, AlertLayer, FacilitiesLayer } from "orion-components/Map/Layers";
import * as facilitiesActions from "../FacilitiesLayer/facilitiesActions";
import { useDispatch, useSelector } from "react-redux";
import { userFeedsSelector, gisLayerSelector, activeEventsSelector } from "orion-components/GlobalData/Selectors"; // Remove once all entities selector added

import { mapSettingsSelector, layerOpacitySelector } from "orion-components/AppState/Selectors";
import { loadGISProfile } from "./layerSourcesActions.js";
import Map from "lodash/map";
import filter from "lodash/filter";
import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";
import each from "lodash/each";
import size from "lodash/size";

const LayerSourcesWrapper = ({ map, creatingReplay, showAllFOVs, showFOVs }) => {
	const settings = useSelector((state) => mapSettingsSelector(state));
	const disabledFeeds = [];
	const events = useSelector((state) => activeEventsSelector(state));
	const userFeed = useSelector((state) => userFeedsSelector(state));

	const globalData = useSelector((state) => state.globalData);
	const globalGeo = useSelector((state) => state.globalGeo);

	// Pass down as object
	const activeFeeds = Map(
		filter(Map(userFeed), (feed) => {
			return (
				feed &&
				!includes(disabledFeeds, feed.feedId) &&
				feed.entityType !== "facility" &&
				globalData[feed.feedId] &&
				!isEmpty(globalData[feed.feedId].data) &&
				globalGeo[feed.feedId] &&
				!isEmpty(globalGeo[feed.feedId].data)
			);
		}),
		"feedId"
	);

	const facilityFeeds = Map(
		filter(
			Map(userFeed),
			feed => {
				return (
					feed &&
					!includes(disabledFeeds, feed.feedId) &&
					feed.entityType === "facility" &&
					globalData[feed.feedId] &&
					!isEmpty(globalData[feed.feedId].data) &&
					globalGeo[feed.feedId] &&
					!isEmpty(globalGeo[feed.feedId].data)
				);
			}
		), "feedId");
	const gisLayers = useSelector(state => gisLayerSelector(state));
	const mapName = settings.mapStyle;
	const labelsVisible = settings.entityLabelsVisible;
	const primaryOpen = false;
	const secondaryOpen = false;
	const layerOpacity = useSelector(state => layerOpacitySelector(state));
	const eventsVisible = true;
	return <LayerSources
		events={events}
		map={map}
		activeFeeds={activeFeeds}
		facilityFeeds={facilityFeeds}
		eventsVisible={eventsVisible}
		gisLayers={gisLayers}
		labelsVisible={labelsVisible}
		creatingReplay={creatingReplay}
		showAllFOVs={showAllFOVs}
		showFOVs={showFOVs}
	/>;
};

const LayerSources = memo(({
	events,
	map,
	creatingReplay,
	showAllFOVs,
	showFOVs,
	activeFeeds,
	facilityFeeds,
	eventsVisible,
	gisLayers,
	labelsVisible
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (
			showAllFOVs &&
			includes(activeFeeds, "cameras")
		) {
			// If FOVs toggled on load, make all FOVs active
			showFOVs();
		}
	}, [activeFeeds]);


	// trackHistoryIsEqual(newHistory, oldHistory) {
	// 	if (isEqual(newHistory, oldHistory)) {
	// 		const keys = Object.keys(newHistory);
	// 		keys.forEach(key => {
	// 			if (newHistory[key].length !== oldHistory[key].length) {
	// 				return false;
	// 			}
	// 		});
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// Generate features from events
	const getEventGeoJSONPoints = () => {
		const eventsPoints = [];

		each(events, (event) => {
			if (event.entityData.properties && !event.entityData.properties.id) {
				event.entityData.properties.id = event.id;
			}
			eventsPoints.push(event.entityData);
		});

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: eventsPoints
			}
		};
		return source;
	};

	const handleLoadGIS = (featureId, featureName, layerId) => {
		dispatch(loadGISProfile(featureId, featureName, layerId, "gis", "profile", "primary"));
	};

	return (
		<Fragment>
			{Map(gisLayers, (layer) => (
				<BasicLayer
					key={layer.name}
					map={map}
					layer={layer}
					handleClick={handleLoadGIS}
					labelsVisible={labelsVisible}
					before="---ac2-gis-{mapboxType}s-position-end"
				/>
			))}
			{Map(activeFeeds, (feedId) => (
				<MapLayer key={feedId} map={map} feedId={feedId} interactiveFeatures={!creatingReplay} />
			))}

			{/* TODO: Once we standardize how non-feed entities are displayed on the map, we should remove
				this hard-coded events layer and add events back according to the map entity schema */}

			{/* Events Source */}
			<Source
				id="ac2-eventPointSource"
				geoJsonSource={
					eventsVisible && size(events)
						? getEventGeoJSONPoints()
						: {
							type: "geojson",
							data: {
								type: "FeatureCollection",
								features: []
							}
						}
				}
			/>
			{/* Events Layer */}
			<Layer
				id="ac2-unclustered-events"
				type="symbol"
				sourceId="ac2-eventPointSource"
				layout={{
					"icon-image": "Incident_gray",
					"icon-size": 1,
					"text-field": "{name}",
					"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
					"text-size": 11,
					"text-letter-spacing": 0,
					"text-offset": [2, 0],
					"text-ignore-placement": true,
					"icon-allow-overlap": true,
					"text-max-width": 7,
					"text-anchor": "left",
					"text-transform": "uppercase",
					"text-optional": true
				}}
				paint={{
					"text-color": "#000000",
					"text-halo-color": "rgba(255, 255, 255, 1)",
					"text-halo-width": 2
				}}
				before="---ac2-feed-entities-position-end"
			/>

			{Map(facilityFeeds, (feedId) => (
				<Fragment key={`${feedId}`}>
					<FacilitiesLayer
						key={`${feedId}_layer`}
						feedId={feedId}
						{...facilitiesActions}
						labelsVisible={true}
						before="---ac2-feed-entities-position-end"
					/>
				</Fragment>
			))}
			<AlertLayer map={map} before="---ac2-alerts-position-end" />
		</Fragment>
	);
},
	(prevProps, nextProps) => {
		if (prevProps !== nextProps) {
			return false;
		}
		return true;
	}
);

LayerSources.displayName = "LayerSources";

export default LayerSourcesWrapper;
