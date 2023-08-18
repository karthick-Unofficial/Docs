/* eslint react/prop-types: 0 */
import React, { memo, Fragment, useEffect } from "react";
import { Source, Layer } from "react-mapbox-gl";
import _ from "lodash";
import MapLayerContainer from "./MapLayer/MapLayerContainer";
import { BasicLayer, AlertLayer } from "orion-components/Map/Layers";
import FacilitiesLayerContainer from "../FacilitiesLayer/FacilitiesLayerConatiner";

const LayerSources = ({
	roadsVisible,
	events,
	map,
	roadAndLabelLayerOpacity,
	creatingReplay,
	showAllFOVs,
	showFOVs,
	activeFeeds,
	loadGISProfile,
	facilityFeeds,
	eventsVisible,
	gisLayers,
	labelsVisible
}) => {

	useEffect(() => {
		map.on("styledata", () => {
			// TODO: look for better event to handle roads and label layer toggle. This fires repeatedly
			setRoadsAndLabels(roadsVisible);
		});
	}, []);

	const setRoadsAndLabels = (visible) => {
		// Preserve roads and labels state on map style change
		// Get all layers that contain roads or labels

		const roadsAndLabels = map.getStyle().layers.filter(layer => {
			return (
				layer["source-layer"] &&
				(layer["source-layer"].includes("road") ||
					layer["source-layer"].includes("label"))
			);
		});
		// Hide all layers with roads and labels
		roadsAndLabels.map(layer => {
			if (visible || creatingReplay) {
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
		if (
			showAllFOVs &&
			_.includes(activeFeeds, "cameras")
		) {
			// If FOVs toggled on load, make all FOVs active
			showFOVs();
		}

		// -- Set roads and labels layer opacity
		setRoadsAndLabelsOpacity(roadAndLabelLayerOpacity);

	}, [activeFeeds, roadAndLabelLayerOpacity]);


	// trackHistoryIsEqual(newHistory, oldHistory) {
	// 	if (_.isEqual(newHistory, oldHistory)) {
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

	const setRoadsAndLabelsOpacity = (opacity) => {
		// Get all layers that contain roads or labels
		const roadsAndLabels = map.getStyle().layers.filter(layer => {
			return (
				layer["source-layer"] &&
				(layer["source-layer"].includes("road") ||
					layer["source-layer"].includes("label"))
			);
		});

		// Update opacity for all layers with roads and labels
		roadsAndLabels.map(layer => {
			if (layer.type === "line") {
				return map.setPaintProperty(layer.id, "line-opacity", opacity);
			} else if (layer.type === "symbol") {
				return map
					.setPaintProperty(layer.id, "text-opacity", opacity)
					.setPaintProperty(layer.id, "icon-opacity", opacity);
			}
		});
	};

	//not used anywhere
	const loadGISImage = (url, index) => {
		map.loadImage(url, (error, image) => {
			if (error) {
				throw error;
			}
			if (!map.hasImage("image-" + index)) {
				map.addImage("image-" + index, image);
			}
		});
	};


	// Generate features from events
	const getEventGeoJSONPoints = () => {
		const eventsPoints = [];

		_.each(events, event => {
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
		loadGISProfile(
			featureId,
			featureName,
			layerId,
			"gis",
			"profile",
			"primary"
		);
	};


	return (
		<Fragment>
			<AlertLayer map={map} />
			{_.map(gisLayers, layer => (
				<BasicLayer
					key={layer.name}
					map={map}
					layer={layer}
					handleClick={handleLoadGIS}
					labelsVisible={labelsVisible}
				/>
			))}
			{_.map(activeFeeds, feedId => (
				<MapLayerContainer key={feedId} map={map} feedId={feedId} />
			))}

			{/* TODO: Once we standardize how non-feed entities are displayed on the map, we should remove
				this hard-coded events layer and add events back according to the map entity schema */}

			{/* Events Source */}
			<Source
				id="eventPointSource"
				geoJsonSource={
					eventsVisible && _.size(events)
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
				id="unclustered-events"
				type="symbol"
				sourceId="eventPointSource"
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
				before={null}
			/>

			{_.map(facilityFeeds, feedId =>
				<Fragment key={`${feedId}`}>
					<FacilitiesLayerContainer key={`${feedId}_layer`} feedId={feedId} />
				</Fragment>)
			}

		</Fragment>
	);
};

const shouldUpdate = (prevProps, nextProps) => {
	if (prevProps !== nextProps) {
		return false;
	}
	return true;
};

export default memo(LayerSources, shouldUpdate);