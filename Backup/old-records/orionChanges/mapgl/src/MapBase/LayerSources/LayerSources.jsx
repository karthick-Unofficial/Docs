import React, { Component, Fragment } from "react";
import { Source, Layer } from "react-mapbox-gl";
import _ from "lodash";
import isEqual from "react-fast-compare";
import MapLayerContainer from "./MapLayer/MapLayerContainer";
import { BasicLayer, AlertLayer, Spotlight } from "orion-components/Map/Layers";
import { default as MapControls } from "./MapControls/MapControlsContainer";
import ActiveFloorPlansContainer from "../ActiveFloorPlans/ActiveFloorPlansContainer";
import FacilitiesLayerContainer from "../FacilitiesLayer/FacilitiesLayerConatiner";
import TrackHistoryInfo from "../TrackHistoryInfo/TrackHistoryInfo";
import circle from "@turf/circle";

// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const nauticalSource = {
	type: "raster",
	tiles: [
		protocol +
		"//tileservice.charts.noaa.gov/tiles/wmts/50000_1/{z}/{x}/{y}.png"
	]
};

class LayerSources extends Component {
	// Reference to map received as prop to work with
	constructor(props) {
		super(props);

		this.state = {
			type: null,
			reloadWeather: false,
			roadsVisible: this.props.roadsVisible,
			eventsToDisplay: {},
			ssrLayers: [],
			ssrLayerRefreshInterval: null
		};
	}

	componentDidMount() {
		const { showAllFOVs, showFOVs, map, activeFeeds, events, ssrRadarOverlayEnabled, ssrRadarVisible, updateSsrRadarTiles } = this.props;

		this._startWeatherReload(300);

		this.setState({
			eventsToDisplay: events
		});

		// Fired when style data loads or changes
		map.on("styledata", e => {
			// TODO: look for better event to handle roads and label layer toggle. This fires repeatedly
			this.setRoadsAndLabels(this.props.roadsVisible);
		});

		// Add event click handlers
		map.on("mousemove", e => {
			const features = _.filter(
				map.queryRenderedFeatures(e.point),
				// Make sure layers aren't coming from Mapbox or are FOVs
				feature =>
					feature.layer.source !== "mapbox" &&
					feature.layer.source !== "composite" &&
					!_.includes(feature.layer.source, "fov")
			);

			if (!this.props.mapTools.type) {
				map.getCanvas().style.cursor = features.length ? "pointer" : "";
			}
		});

		this.addEventClickHandlers();

		// If FOVs toggled on load, make all FOVs active
		if (showAllFOVs && _.includes(activeFeeds, "cameras")) {
			showFOVs();
		}

		let moveTimeout = null;
		if (ssrRadarOverlayEnabled) {
			map.on("move", e => {
				// -- essentially a map move debounce timer for updating SSR radar tiles
				if (moveTimeout) {
					clearTimeout(moveTimeout);
				}
				moveTimeout = setTimeout(this.updateTiles, 1000);
			});

			// -- start tiles on initial load if the layer is already enabled
			if (ssrRadarVisible) {
				updateSsrRadarTiles(ssrRadarVisible, map);
			}
		}
	}

	updateTiles = () => {
		const { map, ssrRadarVisible, updateSsrRadarTiles } = this.props;
		const { ssrLayerRefreshInterval } = this.state;

		if (ssrRadarVisible) {
			// -- stop refreshing SSR radar tile images
			if (ssrLayerRefreshInterval) {
				clearInterval(ssrLayerRefreshInterval);
			}

			updateSsrRadarTiles(ssrRadarVisible, map);

			this.setState({
				ssrLayerRefreshInterval: null
			});
		}
	}

	// TODO: Remove this when we standardize how we display non-feed entities on the map
	addEventClickHandlers = () => {
		// IMPORTANT: Do not use destructuring for events or loadProfile here
		// -- Since this method is called once upon the map mounting, the values
		// -- of the destructured variables will be set before the values have passed down
		// -- ex: events will always be an empty array, even after events have loaded in the container

		const handleEventClick = e => {
			// This destructing is alright, as it happens on click and will update with current data
			const { loadProfile, events } = this.props;

			const featureId = e.features[0].properties.id;

			const filtered = _.filter(events, entity => {
				return _.includes(entity.id, featureId);
			});

			if (!_.isEmpty(filtered)) {
				const entity = filtered[0];
				loadProfile(entity.id, entity.name, "event", "profile", "primary");
			}
		};

		// Do not destructure this.props.map here, as it may cause problems in the future
		this.props.map.on("click", "unclustered-events", e => handleEventClick(e));
	};

	_startWeatherReload(interval = 60) {
		setInterval(() => {
			this.setState({ reloadWeather: true });
			this.setState({ reloadWeather: false });
		}, interval * 1000);
	}

	setRoadsAndLabels = visible => {
		// Preserve roads and labels state on map style change
		const { map, roadAndLabelLayerOpacity } = this.props;
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
			if (visible) {
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

	componentDidUpdate(prevProps, prevState) {
		const {
			showAllFOVs,
			showFOVs,
			activeFeeds,
			roadAndLabelLayerOpacity,
			ssrRadarOverlayEnabled,
			ssrRadarVisible,
			ssrRadarTiles,
			ssrRadarLayerOpacity
		} = this.props;

		if (
			showAllFOVs &&
			!_.includes(prevProps.activeFeeds, "cameras") &&
			_.includes(activeFeeds, "cameras")
		) {
			// If FOVs toggled on load, make all FOVs active
			showFOVs();
		}

		// -- Set roads and labels layer opacity
		if (prevProps.roadAndLabelLayerOpacity !== roadAndLabelLayerOpacity) {
			this.setRoadsAndLabelsOpacity(roadAndLabelLayerOpacity);
		}

		if (ssrRadarOverlayEnabled) {
			// -- handle SSR radar overlay updates
			if (ssrRadarVisible && !_.isEmpty(ssrRadarTiles) && ssrRadarTiles !== prevProps.ssrRadarTiles) {
				// -- enable if layer visible and ssrRadarTiles changed
				this.handleSsrLayers(true);
			}
			else if (!ssrRadarVisible && prevProps.ssrRadarVisible) {
				// -- disable if layer turned off
				this.handleSsrLayers(false);
			}

			// -- Set SSR radar layer opacity
			if (ssrRadarVisible && prevProps.ssrRadarLayerOpacity !== ssrRadarLayerOpacity) {
				this.setSsrRadarOpacity(ssrRadarLayerOpacity);
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
	}

	setRoadsAndLabelsOpacity = opacity => {
		const { map } = this.props;

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

	setSsrRadarOpacity = opacity => {
		const { map } = this.props;

		// -- Get all SSR radar layers
		const radarLayers = map.getStyle().layers.filter(layer => {
			return layer["id"] && layer["id"].includes("ssr-radar-");
		});

		// -- Update opacity for all SSR radar layers
		radarLayers.forEach(layer => {
			map.setPaintProperty(layer.id, "raster-opacity", opacity);
		});
	};

	handleSsrLayers = (enabled) => {
		const { ssrRadarTiles, ssrRadarLayerOpacity, ssrRadarTileUpdateInterval } = this.props;
		const { ssrLayerRefreshInterval } = this.state;

		// -- ssr radar layer enabled
		if (enabled) {
			// -- stop interval while initializaing/updating layers
			if (ssrLayerRefreshInterval) {
				clearInterval(ssrLayerRefreshInterval);
			}

			const newSsrLayers = Object.keys(ssrRadarTiles).map(tileId => {
				const { imageUrl, lowerLeft, upperRight } = ssrRadarTiles[tileId];
				const proxyUrl = `/_proxy?url=${encodeURI(imageUrl)}`;
				const source = {
					type: "image",
					url: proxyUrl,
					coordinates: [
						[lowerLeft.longitude, upperRight.latitude],		// top left
						[upperRight.longitude, upperRight.latitude],	// top right
						[upperRight.longitude, lowerLeft.latitude],		// bottom right
						[lowerLeft.longitude, lowerLeft.latitude]		// bottom left
					]
				};

				return (
					<Fragment key={tileId}>
						<Source id={`ssr-radar-${tileId}`} tileJsonSource={source} />
						<Layer
							type="raster"
							id={`ssr-radar-${tileId}`}
							sourceId={`ssr-radar-${tileId}`}
							paint={{ "raster-opacity": ssrRadarLayerOpacity }}
						/>
					</Fragment>
				);
			});

			// -- start interval to update tile source
			const newSsrLayerRefreshInterval = setInterval(this.updateTileImages, ssrRadarTileUpdateInterval || 5000);

			this.setState({
				ssrLayers: newSsrLayers,
				ssrLayerRefreshInterval: newSsrLayerRefreshInterval
			});
		}
		// -- ssr radar layer disabled
		else {
			clearInterval(ssrLayerRefreshInterval);

			this.setState({
				ssrLayers: [],
				ssrLayerRefreshInterval: null
			});
		}
	}

	updateTileImages = () => {
		const { map, ssrRadarTiles } = this.props;

		Object.keys(ssrRadarTiles).forEach(tileId => {
			const { imageUrl, lowerLeft, upperRight } = ssrRadarTiles[tileId];
			const proxyUrl = `/_proxy?url=${encodeURI(imageUrl)}`;

			// -- update tile source image by re-calling the image URL (SSR updates the image every 0.5 seconds)
			const tileSource = map.getSource(`ssr-radar-${tileId}`);
			tileSource.updateImage({
				url: proxyUrl,
				coordinates: [
					[lowerLeft.longitude, upperRight.latitude],		// top left
					[upperRight.longitude, upperRight.latitude],	// top right
					[upperRight.longitude, lowerLeft.latitude],		// bottom right
					[lowerLeft.longitude, lowerLeft.latitude]		// bottom left
				]
			});
		});
	}

	trackHistoryLines() {
		const { trackHistory } = this.props;

		const historyGeoJSON = _.map(_.keys(trackHistory), id => {
			return {
				geometry: {
					type: "LineString",
					coordinates: _.map(
						trackHistory[id],
						entry => entry.entityData.geometry.coordinates
					)
				}
			};
		});

		return historyGeoJSON;
	}

	trackHistoryPoints() {
		const { trackHistory } = this.props;

		const trackHistoryPoints = [];

		_.each(trackHistory, history =>
			_.each(history, entry => trackHistoryPoints.push(entry.entityData))
		);

		return trackHistoryPoints;
	}

	loadGISImage(url, index) {
		const { map } = this.props;
		map.loadImage(url, (error, image) => {
			if (error) {
				throw error;
			}
			if (!map.hasImage("image-" + index)) {
				map.addImage("image-" + index, image);
			}
		});
	}

	// Generate features from events
	getEventGeoJSONPoints = () => {
		const { eventsToDisplay } = this.state;
		const eventsPoints = [];

		_.each(eventsToDisplay, event => {
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

	getEventProximityGeoJSONPoints() {
		const { event } = this.props;

		const eventProximityGeoJSON = [];

		// Show selected event's proximities on map
		if (event && event.proximities && event.entityData.geometry && event.entityData.geometry.coordinates) {
			_.each(event.proximities, proximity => {
				let radiusInKM;
				if(proximity.distanceUnits === "mi")
				{
					radiusInKM = proximity.radius * 1.609344;
				}
				else
				{
					radiusInKM = proximity.radius;
				}
				const circleObject = circle(event.entityData.geometry.coordinates, Number(radiusInKM));
				eventProximityGeoJSON.push({
					geometry: {
						coordinates: circleObject.geometry.coordinates,
						type: "Polygon"
					},
					properties: {
						"description": "",
						"lineType": proximity.lineType,
						"lineWidth": proximity.lineWidth,
						"name": proximity.name,
						"polyFill": proximity.polyFill,
						"polyFillOpacity": proximity.polyFillOpacity,
						"polyStroke": proximity.polyStroke,
						"symbol": null,
						"type": "Polygon"
					}
				});
			});
		}

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: eventProximityGeoJSON
			}
		};
		return source;
	}

	handleLoadGIS = (featureId, featureName, layerId) => {
		const { loadGISProfile } = this.props;
		loadGISProfile(
			featureId,
			featureName,
			layerId,
			"gis",
			"profile",
			"primary"
		);
	};

	render() {
		const {
			nauticalChartsVisible,
			weatherVisible,
			ssrRadarVisible,
			map,
			activeFeeds,
			facilityFeeds,
			eventsVisible,
			event,
			events,
			activeFOVs,
			trackHistory,
			gisLayers,
			nauticalChartLayerOpacity,
			weatherRadarLayerOpacity,
			labelsVisible,
			aerisKey,
			mapTools,
			timeFormatPreference,
			filters,
			ssrRadarOverlayEnabled
		} = this.props;
		const { ssrLayers } = this.state;

		// -- add "gis" to layer name to distinguish it from other layers
		Object.keys(gisLayers).forEach(layerId => {
			if (!gisLayers[layerId].name.startsWith("gis-")) {
				gisLayers[layerId].name = `gis-${gisLayers[layerId].name}`;
			}
		});

		if(filters.length > 0){
			filters.forEach(id => {
				for (const [key, value] of Object.entries(events)) {
					if(id === key){
						this.setState({
							eventsToDisplay: value
						});
					} else {
						this.setState({
							eventsToDisplay: {}
						});
					}
				}
			});
		} else {
			this.setState({
				eventsToDisplay: events
			});
		}

		const { reloadWeather } = this.state;
		const weatherSource = {
			type: "raster",
			tiles: [
				protocol +
				`//maps1.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
				protocol +
				`//maps2.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
				protocol +
				`//maps3.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`,
				protocol +
				`//maps4.aerisapi.com/${aerisKey}/radar/{z}/{x}/{y}/current.png`
			]
		};

		const trackHistorySourceOptions = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: this.trackHistoryLines()
			}
		};

		const trackHistoryPointsSourceOptions = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: this.trackHistoryPoints()
			}
		};

		const nauticalChartBeforeLayer = !reloadWeather && weatherVisible ? "current-radar" : null;

		return (
			<Fragment>
				<MapControls />
				<AlertLayer map={map} />
				{Object.values(this.props.spotlights)
					.filter(
						spotlight =>
							!!spotlight &&
							(!mapTools.feature || mapTools.feature.id !== spotlight.id)
					)
					.map(spotlight => (
						<Spotlight key={spotlight.id} feature={spotlight} />
					))}
				{_.map(gisLayers, layer => (
					<BasicLayer
						key={layer.name}
						map={map}
						layer={layer}
						handleClick={this.handleLoadGIS}
						labelsVisible={labelsVisible}
					/>
				))}
				{_.map(activeFeeds, feedId => (
					<MapLayerContainer key={feedId} map={map} feedId={feedId} />
				))}
				{activeFOVs && (
					<MapLayerContainer map={map} feedId="fovs" cluster={false} />
				)}

				{/* Weather */}
				{weatherVisible && (
					<Source id="currentRadarTiles" tileJsonSource={weatherSource} />
				)}
				{!reloadWeather && weatherVisible && (
					<Layer
						type="raster"
						id="current-radar"
						sourceId="currentRadarTiles"
						paint={{ "raster-opacity": weatherRadarLayerOpacity }}
					/>
				)}

				{/* SSR Radar Image */}
				{ssrRadarOverlayEnabled && ssrRadarVisible && ssrLayers}

				{/* Nautical */}
				{nauticalChartsVisible && (
					<Source id="nauticalCharts" tileJsonSource={nauticalSource} />
				)}
				{nauticalChartsVisible && (
					<Layer
						type="raster"
						id="nautical"
						sourceId="nauticalCharts"
						paint={{ "raster-opacity": nauticalChartLayerOpacity }}
						before={nauticalChartBeforeLayer}
					/>
				)}

				{/* TODO: Once we standardize how non-feed entities are displayed on the map, we should remove
				this hard-coded events layer and add events back according to the map entity schema */}

				{/* Events Source */}
				<Source
					id="eventPointSource"
					geoJsonSource={
						eventsVisible && _.size(this.state.eventsToDisplay)
							? this.getEventGeoJSONPoints()
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

				{/* Events Proximity Source */}
				<Source
					id="eventProximitySource"
					geoJsonSource={
						this.getEventProximityGeoJSONPoints()
					}
				/>

				{/* Event Proximities Layer */}
				{event && event.proximities ? (
					<div>
						<Layer
							id="event-proximities"
							type="fill"
							sourceId="eventProximitySource"
							paint={{
								"fill-color": {
									type: "identity",
									property: "polyFill",
									default: "#35b7f3"
								},
								"fill-opacity": {
									type: "identity",
									property: "polyFillOpacity",
									default: 0.2
								},
								"fill-antialias": true,
								"fill-outline-color": {
									type: "identity",
									property: "polyStroke",
									default: "#35b7f3"
								}
							}}
						/>
						{/* SOLID */}
						<Layer
							id="event-proximities-outlines"
							type="line"
							sourceId="eventProximitySource"
							paint={{
								"line-color": {
									type: "identity",
									property: "polyStroke",
									default: "#35b7f3"
								},
								"line-width": {
									type: "identity",
									property: "lineWidth",
									default: 1
								}
							}}
							layout={{
								"line-join": "round",
								"line-cap": "round"
							}}
							filter={["==", "lineType", "Solid"]}
						/>
						{/* DASHED */}
						<Layer
							id="event-proximities-outlines-dashed"
							type="line"
							sourceId="eventProximitySource"
							paint={{
								"line-color": {
									type: "identity",
									property: "polyStroke",
									default: "#35b7f3"
								},
								"line-width": {
									type: "identity",
									property: "lineWidth",
									default: 1
								},
								"line-dasharray": [2, 2]
							}}
							layout={{
								"line-join": "miter",
								"line-cap": "butt"
							}}
							filter={["==", "lineType", "Dashed"]}
						/>
						{/* DOTTED */}
						<Layer
							id="event-proximities-outlines-dotted"
							type="line"
							sourceId="eventProximitySource"
							paint={{
								"line-color": {
									type: "identity",
									property: "polyStroke",
									default: "#35b7f3"
								},
								"line-width": {
									type: "identity",
									property: "lineWidth",
									default: 1
								},
								"line-dasharray": [0, 2]
							}}
							layout={{
								"line-join": "round",
								"line-cap": "round"
							}}
							filter={["==", "lineType", "Dotted"]}
						/>
					</div>
				) : null}

				{_.map(facilityFeeds, feedId =>
					<Fragment key={`${feedId}`}>
						<FacilitiesLayerContainer key={`${feedId}_layer`} feedId={feedId} />
						<ActiveFloorPlansContainer key={`${feedId}_floorplans`} feedId={feedId} />
					</Fragment>)
				}
				{_.size(trackHistory) && (
					<Fragment>
						<Source
							id="trackHistorySource"
							geoJsonSource={trackHistorySourceOptions}
						/>
						<Source
							id="trackHistoryPointsSource"
							geoJsonSource={trackHistoryPointsSourceOptions}
						/>
						<Layer
							id="track-history-points"
							type="circle"
							sourceId="trackHistoryPointsSource"
							paint={{
								"circle-color": "white",
								"circle-radius": 3
							}}
						/>
						<Layer
							id="track-history-lines"
							type="line"
							sourceId="trackHistorySource"
							layout={{
								"line-join": "round",
								"line-cap": "round"
							}}
							paint={{
								"line-color": "#35b7f3",
								"line-width": 1
							}}
							before="track-history-points"
						/>
						<TrackHistoryInfo
							map={map}
							trackHistoryContexts={Object.keys(trackHistory)}
							timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
						/>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

export default LayerSources;