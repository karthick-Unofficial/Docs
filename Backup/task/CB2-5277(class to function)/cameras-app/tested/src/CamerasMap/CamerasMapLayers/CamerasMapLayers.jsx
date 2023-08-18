import React, { Fragment, createRef, useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Source, Layer } from "react-mapbox-gl";
import area from "@turf/area";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
	AlertLayer,
	VesselPolygons,
	Spotlight
} from "orion-components/Map/Layers";
import { default as MapControls } from "./MapControls/MapControlsContainer";
import { getSpotlight } from "orion-components/Map/helpers";

// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const nauticalSource = {
	type: "raster",
	tiles: [
		protocol +
		"//tileservice.charts.noaa.gov/tiles/wmts/50000_1/{z}/{x}/{y}.png"
	]
};

const CamerasMapLayers = (props) => {
	const {
		loadProfile,
		setMapEntities,
		mapName,
		roadsVisible,
		baseMaps,
		roadAndLabelLayerOpacity,
		mapState,
		feedId,
		profileIconTemplates,
		nauticalChartsVisible,
		weatherVisible,
		entityLabelsVisible,
		context,
		items,
		map,
		trackHistory,
		aerisKey,
		spotlightProximity,
		primaryContext,
		weatherRadarLayerOpacity,
		nauticalChartLayerOpacity
	} = props;
	const [reloadWeather, setReloadWeather] = useState(false);
	const [currentZoomLevel, setCurrentZoomLevel] = useState([]);
	const roadsVisibleRef = useRef(null);

	// this.drawingRef = createRef();

	const _startWeatherReload = (interval = 60) => {
		setInterval(() => {
			setReloadWeather(true);
			setReloadWeather(false);
		}, interval * 1000);
	};

	const renderSilhouettes = tracks => {
		const vessels = {};
		_.compact(_.values(tracks)).forEach(track => {
			if (
				["length", "width", "course", "dimA", "dimB", "dimC", "dimD"].every(
					key => track.entityData.properties.hasOwnProperty(key)
				)
			)
				vessels[track.entityData.properties.id] = { ...track };
		});
		return <VesselPolygons vessels={vessels} />;
	};

	const addClickHandlers = () => {

		const filterAndLoadProfile = (id, context) => {
			const entitiesFiltered = Object.values(items)
				.filter(entity => {
					return _.includes(entity.id, id);
				})
				// Prevent click on selected camera's FOV polygon
				.filter(entity => {
					return !entity.parentEntity;
				});
			if (
				entitiesFiltered.length > 0 &&
				mapState.mapTools.type !== "distance"
			) {
				const { id, entityData, entityType } = entitiesFiltered[0];
				loadProfile(
					id,
					entityData.properties.name,
					entityType,
					"profile",
					context
				);
			}
		};

		const handleEntityClick = (e, context = "secondary") => {
			if (mapState.mapTools.type !== "drawing") {
				// Add custom cancel bubble property to original event
				e.originalEvent.cancelBubble = true;
				const { id } = e.features[0].properties;
				filterAndLoadProfile(id, context);
			}
		};

		const handlePolygonClick = (e, context = "secondary") => {
			if (mapState.mapTools.type !== "drawing") {
				// If custom flag was set earlier on event (via entity click), bail out to prioritize entity
				if (e.originalEvent.cancelBubble) {
					return;
				}
				const { features } = e;
				let feature;
				// If multiple polygons exist under click
				if (features.length) {
					// Add area to each polygon
					features.forEach(feat => {
						feat.properties.area = area(feat);
					});
					// Prioritize smallest
					const smallestArea = features.reduce((previous, current) => {
						return previous.properties.area < current.properties.area
							? previous
							: current;
					});
					feature = smallestArea;
				} else {
					feature = features[0];
				}
				const { id } = feature.properties;
				filterAndLoadProfile(id, context);
			}
		};

		// Loads details for tracks
		map.on("click", "unclustered-point", e => handleEntityClick(e));
		map.on("touchend", "unclustered-point", e => handleEntityClick(e));
		// Loads details for markers
		map.on("click", "unclustered-markers", e => handleEntityClick(e));
		map.on("touchend", "unclustered-markers", e => handleEntityClick(e));
		// Loads details for lines (solid, dashed, and dotted)
		map.on("click", "unclustered-lines", e => handleEntityClick(e));
		map.on("touchend", "unclustered-lines", e => handleEntityClick(e));
		map.on("click", "unclustered-lines-dashed", e => handleEntityClick(e));
		map.on("touchend", "unclustered-lines-dashed", e => handleEntityClick(e));
		map.on("click", "unclustered-lines-dotted", e => handleEntityClick(e));
		map.on("touchend", "unclustered-lines-dotted", e => handleEntityClick(e));
		// Loads details for cameras
		map.on("click", "unclustered-camera", e => handleEntityClick(e, "primary"));
		map.on("touchend", "unclustered-camera", e =>
			handleEntityClick(e, "primary")
		);
		// Loads details for accessPoints
		map.on("click", "unclustered-accessPoint", e => handleEntityClick(e, "primary"));
		map.on("touchend", "unclustered-accessPoint", e =>
			handleEntityClick(e, "primary")
		);
		// Loads details for polygons
		map.on("click", "unclustered-polygons", e => handlePolygonClick(e));
		map.on("touchend", "unclustered-polygons", e => handlePolygonClick(e));
		map.on("click", "unclustered-events", e => handleEntityClick(e, "secondary"));
		map.on("touchend", "unclustered-events", e =>
			handleEntityClick(e, "secondary")
		);
	};

	useEffect(() => {
		// Roads and labels
		setRoadsAndLabels(roadsVisible);
		// Hide nautical charts if zoomed out beyond useful level
		map.on("zoom", () => {
			setCurrentZoomLevel(map.getZoom());
		});
		map.on("mousemove", e => handleMouseMove(e.point));

		map.on("styledata", e => {
			setRoadsAndLabels(roadsVisibleRef.current);
			handleReorder(e);

		});
		handleMouseMove();
		addClickHandlers(map);
		// Start timer for reloading current radar overlay
		_startWeatherReload(300);
		setMapEntity(Object.values(items));

		setCurrentZoomLevel(map.getZoom());
	}, []);

	const handleMouseMove = point => {
		const featureLayers = map
			.getStyle()
			.layers.filter(layer => layer.source !== "composite")
			.map(layer => layer.id);
		const features = map.queryRenderedFeatures(point, {
			layers: featureLayers
		});
		map.getCanvas().style.cursor = features.length ? "pointer" : "";
	};

	const setMapEntity = item => {
		const byFeed = _.groupBy(item, "feedId");
		_.each(
			_.keys(byFeed),
			feed => (byFeed[feed] = _.keyBy(byFeed[feed], "id"))
		);
		_.each(_.keys(byFeed), feed => setMapEntities({ [feed]: byFeed[feed] }));
	};

	const setRoadsAndLabelsOpacity = opacity => {

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

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	useEffect(() => {
		roadsVisibleRef.current = roadsVisible;
		if (prevProps) {
			if (mapName !== prevProps.mapName) {
				if (baseMaps.length > 0) {
					const selectedMap = baseMaps.filter((element) => element.name === mapName)[0];
					map.setStyle(selectedMap.style, { diff: false });
				}
			}
			if (prevProps.roadsVisible !== roadsVisible) {
				setRoadsAndLabels(roadsVisible);
			}
			if (!_.isEqual(prevProps.items, items)) {
				setMapEntity(Object.values(items));
			}
			addClickHandlers();
			if (prevProps.roadAndLabelLayerOpacity !== roadAndLabelLayerOpacity) {
				setRoadsAndLabelsOpacity(roadAndLabelLayerOpacity);
			}
		}
	}, [props]);

	const setRoadsAndLabels = visible => {
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

	const handleReorder = e => {
		const sources = _.keys(e.style.sourceCaches);
		const layers = _.map(map.getStyle().layers, "id");

		if (!mapState.mapTools.type) {
			_.each(sources, id => {
				const pointLayers = _.filter(
					layers,
					layer => _.includes(layer, feedId) && _.includes(layer, "-symbol")
				);
				const circleLayers = _.filter(
					layers,
					layer => _.includes(layer, feedId) && _.includes(layer, "-circle")
				);
				const lineLayers = _.filter(
					layers,
					layer => _.includes(layer, feedId) && _.includes(layer, "-line")
				);

				// Move lines above polygons
				_.each(lineLayers, layer => {
					map.moveLayer(layer);
				});

				// Move circles above lines
				_.each(circleLayers, layer => {
					map.moveLayer(layer);
				});

				// Move points above lines
				_.each(pointLayers, layer => {
					map.moveLayer(layer);
				});

				// Make sure that clusters from any feed and alerts are at the top of the layer stack
				if (map.getLayer(feedId + "-alert-badge"))
					map.moveLayer(feedId + "-alert-badge");
				if (map.getLayer(feedId + "-clusters"))
					map.moveLayer(feedId + "-clusters");
				if (map.getLayer(feedId + "-cluster-count"))
					map.moveLayer(feedId + "-cluster-count");
				if (map.getLayer("alerts"))
					map.moveLayer("alerts");
			});
		}
	};

	const getGeoJSON = entityType => {
		const { mode, feature } = mapState.mapTools;
		const filteredItems = Object.values(items)
			.filter(item => {
				if (entityType === "FOV") {
					return item.parentEntity;
				} else {
					const type = item && item.entityData && item.entityData.properties && item.entityData.properties.type ? item.entityData.properties.type : item.entityType;
					return (
						type.toLowerCase() === entityType.toLowerCase() && !item.parentEntity
					);
				}
			})
			.filter(item => {
				// Remove current FOV or camera from map while editing
				if (!!mode && !!feature) {
					return item.id !== feature.id;
				} else {
					return item;
				}
			})
			.map(item => {
				if (item.entityData.properties.type === "Polygon") {
					item.entityData.type = "Feature";
				}
				item.entityData.properties.id = item.id;
				item.entityData.properties.entityType = item.entityType;

				if (item.entityType === "track") {
					// -- set mapIcon based on jsonata expression
					item.entityData.properties.mapIcon = profileIconTemplates[item.feedId].evaluate(item.entityData);
				}

				if (item.hasOwnProperty("controls"))
					item.entityData.properties.controls = item.controls;

				return item.entityData;
			});

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: filteredItems
			}
		};
		return source;
	};

	const getTrackHistoryGeoJSON = () => {

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

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: historyGeoJSON
			}
		};
		return source;
	};

	const getTrackHistoryGeoJSONPoints = () => {

		const trackHistoryPoints = [];

		_.each(trackHistory, history =>
			_.each(history, entry => trackHistoryPoints.push(entry.entityData))
		);

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: trackHistoryPoints
			}
		};
		return source;
	};

	const getTypes = () => {
		const types = [
			...new Set(
				Object.values(items).map(item => item && item.entityData && item.entityData.properties && item.entityData.properties.type ? item.entityData.properties.type : item.entityType)
			)
		];
		return types;
	};

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

	// For distance tool. Should probably be refactored. TODO: add a container to Distance Tool
	const tracks = Object.values(items).filter(
		item => item.entityType === "track"
	);
	const contextLoaded = context && context.entity;
	const types = getTypes();
	const hasSource = type => types.includes(type);

	return (
		<div>
			<MapControls />
			<AlertLayer map={map} />
			{contextLoaded && primaryContext.entity.entityData.geometry && mapState.mapTools.type !== "spotlight" && (
				<Spotlight
					map={map}
					feature={
						primaryContext.entity.spotlightShape ||
						getSpotlight({
							center: primaryContext.entity.entityData,
							spotlightProximity
						})
					}
				/>
			)}
			{/* Oceanographic  */}
			{nauticalChartsVisible && (
				<Source id="nauticalCharts" tileJsonSource={nauticalSource} />
			)}
			{(nauticalChartsVisible && currentZoomLevel >= 7) && (
				<Layer
					type="raster"
					id="nautical"
					sourceId="nauticalCharts"
					paint={{ "raster-opacity": nauticalChartLayerOpacity }}
					before={
						map.getLayer("unclustered-fovs")
							? "unclustered-fovs"
							: map.getLayer("unclustered-cameras")
								? "unclustered-cameras"
								: null
					}
				/>
			)}

			{/* Current Radar */}
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
			{contextLoaded && (
				<Source
					id="eventPointSource"
					geoJsonSource={getGeoJSON("Event")}
				/>
			)}

			{types.map(type => {
				if (typeof type !== "undefined") {
					return (
						<Source
							key={type.replace(/\s/g, "")}
							id={type.replace(/\s/g, "") + "Source"}
							geoJsonSource={getGeoJSON(type)}
						/>
					);
				}
			})}

			<Source
				id="thLineSource"
				geoJsonSource={getTrackHistoryGeoJSON()}
			/>

			<Source
				id="thPointSource"
				geoJsonSource={getTrackHistoryGeoJSONPoints()}
			/>

			{/* Tracks & Clusters */}
			{hasSource("Track") && (
				<div>
					<Layer
						id="clusters"
						type="circle"
						sourceId="TrackSource"
						filter={["has", "point_count"]}
						paint={{
							"circle-color": {
								property: "point_count",
								type: "interval",
								stops: [[0, "#999999"], [100, "#666666"], [750, "#333333"]]
							},
							"circle-stroke-width": 3,
							"circle-stroke-color": "#ffffff",
							"circle-radius": {
								property: "point_count",
								type: "interval",
								stops: [[0, 20], [100, 30], [750, 40]]
							}
						}}
					/>

					<Layer
						id="cluster-count"
						type="symbol"
						sourceId="TrackSource"
						filter={["has", "point_count"]}
						layout={{
							"text-field": "{point_count_abbreviated}",
							"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
							"text-size": 16
						}}
						paint={{
							"text-color": "#FFFFFF"
						}}
					/>

					{renderSilhouettes(tracks)}
					<Layer
						id="unclustered-point"
						type="symbol"
						sourceId="TrackSource"
						filter={["!has", "point_count"]}
						layout={{
							"icon-image": "{mapIcon}",
							"icon-size": 1,
							"icon-rotate": [
								"case",
								[
									"any",
									["all", ["has", "course"], ["has", "heading"]],
									["has", "heading"]
								],
								["get", "heading"],
								[
									"any",
									[
										"all",
										["has", "course"],
										["has", "hdg"],
										["!=", ["get", "hdg"], 511]
									],
									["all", ["has", "hdg"], ["!=", ["get", "hdg"], 511]]
								],
								["get", "hdg"],
								[
									"any",
									[
										"all",
										["has", "course"],
										["has", "hdg"],
										["==", ["get", "hdg"], 511]
									],
									["has", "course"]
								],
								["get", "course"],
								0
							],
							"icon-allow-overlap": true,
							"text-field": entityLabelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 12,
							"text-letter-spacing": 0,
							"text-offset": [1.5, 0],
							"icon-rotation-alignment": "map",
							"text-anchor": "left",
							"text-transform": "uppercase",
							"text-optional": true
						}}
						paint={{
							"text-color": "#000000",
							"text-halo-color": "rgba(255, 255, 255, 1)",
							"text-halo-width": 2
						}}
					/>
				</div>
			)}

			{contextLoaded && (
				<Layer
					id="unclustered-events"
					type="symbol"
					sourceId="eventPointSource"
					layout={{
						"icon-image": "Incident_gray",
						"icon-size": 1,
						"text-field": entityLabelsVisible ? "{name}" : "",
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
				/>
			)}

			{/* Cameras */}
			{hasSource("Camera") && (
				<Layer
					id="unclustered-camera"
					type="symbol"
					sourceId="CameraSource"
					filter={["!has", "point_count"]}
					layout={{
						"icon-image": [
							"case",
							["has", "mapIcon"],
							["get", "mapIcon"],
							"Camera_gray"
						],
						"icon-size": 1,
						"icon-allow-overlap": true,
						"text-field": entityLabelsVisible ? "{name}" : "",
						"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
						"text-size": 12,
						"text-letter-spacing": 0,
						"text-offset": [2, 0],
						"icon-rotation-alignment": "map",
						"text-anchor": "left",
						"text-transform": "uppercase",
						"text-optional": true
					}}
					paint={{
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					}}
				/>
			)}

			{/* Access Point */}
			{hasSource("Access Point" || "Door") && (
				<Layer
					id="unclustered-accessPoint"
					type="symbol"
					sourceId="AccessPointSource"
					filter={["!has", "point_count"]}
					layout={{
						"icon-image": [
							"case",
							["has", "mapIcon"],
							["get", "mapIcon"],
							"Sensor_gray"
						],
						"icon-size": 1,
						"icon-allow-overlap": true,
						"text-field": entityLabelsVisible ? "{name}" : "",
						"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
						"text-size": 12,
						"text-letter-spacing": 0,
						"text-offset": [2, 0],
						"icon-rotation-alignment": "map",
						"text-anchor": "left",
						"text-transform": "uppercase",
						"text-optional": true
					}}
					paint={{
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					}}
				/>
			)}

			{/* Points */}
			{hasSource("Point") && (
				<Layer
					id="unclustered-markers"
					type="symbol"
					sourceId="PointSource"
					layout={{
						"icon-image": "{symbol}",
						"icon-size": 1,
						"icon-allow-overlap": true,
						"text-field": entityLabelsVisible ? "{name}" : "",
						"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
						"text-size": 11,
						"text-letter-spacing": 0,
						"text-offset": [1, 0],
						"text-max-width": 7,
						"text-anchor": "left",
						"text-transform": "uppercase",
						"text-optional": true,
						"icon-offset": [0, -10] // <-- offset so that the bottom of the marker is the on the coordinates
					}}
					paint={{
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					}}
					before={types.includes("Track") ? "clusters" : null}
				/>
			)}

			{/* Lines */}
			{hasSource("Line") && (
				<div>
					<Layer
						id="line-labels"
						type="symbol"
						sourceId="LineSource"
						layout={{
							"symbol-placement": "line",
							"text-field": entityLabelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 10,
							"text-letter-spacing": 0,
							"text-ignore-placement": true,
							"text-max-width": 7,
							"text-anchor": "center",
							"text-transform": "uppercase",
							"text-optional": true
						}}
						paint={{
							"text-color": "#000000",
							"text-halo-color": "rgba(255, 255, 255, 1)",
							"text-halo-width": 2
						}}
						before={types.includes("Track") ? "clusters" : null}
					/>
					{/* SOLID */}
					<Layer
						id="unclustered-lines"
						type="line"
						sourceId="LineSource"
						layout={{
							"line-join": "round",
							"line-cap": "round"
						}}
						paint={{
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							}
						}}
						before={
							types.includes("Point") ? "unclustered-markers" : "line-labels"
						}
						properties={{
							title: entityLabelsVisible ? "{name}" : ""
						}}
						filter={["==", "lineType", "Solid"]}
					/>
					{/* DASHED */}
					<Layer
						id="unclustered-lines-dashed"
						type="line"
						sourceId="LineSource"
						layout={{
							"line-join": "miter",
							"line-cap": "butt"
						}}
						paint={{
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							},
							"line-dasharray": [2, 2]
						}}
						before={
							types.includes("Point") ? "unclustered-markers" : "line-labels"
						}
						properties={{
							title: entityLabelsVisible ? "{name}" : ""
						}}
						filter={["==", "lineType", "Dashed"]}
					/>
					{/* DOTTED */}
					<Layer
						id="unclustered-lines-dotted"
						type="line"
						sourceId="LineSource"
						layout={{
							"line-join": "round",
							"line-cap": "round"
						}}
						paint={{
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							},
							"line-dasharray": [0, 2]
						}}
						before={
							types.includes("Point") ? "unclustered-markers" : "line-labels"
						}
						properties={{
							title: entityLabelsVisible ? "{name}" : ""
						}}
						filter={["==", "lineType", "Dotted"]}
					/>
				</div>
			)}

			{/* Polygons */}
			{hasSource("Polygon") && (
				<div>
					<Layer
						id="unclustered-polygons"
						type="fill"
						sourceId="PolygonSource"
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
						before={types.includes("Line") ? "unclustered-lines" : null}
					/>
					{/* SOLID */}
					<Layer
						id="unclustered-polygons-outlines"
						type="line"
						sourceId="PolygonSource"
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
						before={types.includes("Line") ? "unclustered-lines" : null}
						filter={["==", "lineType", "Solid"]}
					/>
					{/* DASHED */}
					<Layer
						id="unclustered-polygons-dashed"
						type="line"
						sourceId="PolygonSource"
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
						before={types.includes("Line") ? "unclustered-lines" : null}
						filter={["==", "lineType", "Dashed"]}
					/>
					{/* DOTTED */}
					<Layer
						id="unclustered-polygons-dotted"
						type="line"
						sourceId="PolygonSource"
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
						before={types.includes("Line") ? "unclustered-lines" : null}
						filter={["==", "lineType", "Dotted"]}
					/>
					<Layer
						id="poly-labels"
						type="symbol"
						sourceId="PolygonSource"
						layout={{
							"symbol-placement": "point",
							"text-field": entityLabelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 10,
							"text-letter-spacing": 0,
							"text-anchor": "center",
							"text-transform": "uppercase",
							"text-optional": true,
							"symbol-avoid-edges": true
						}}
						paint={{
							"text-color": "#000000",
							"text-halo-color": "rgba(255, 255, 255, 1)",
							"text-halo-width": 2
						}}
						before={types.includes("Track") ? "clusters" : null}
					/>
				</div>
			)}

			{/* FOVs */}
			{hasSource("FOV") && (
				<Fragment>
					<Layer
						id="unclustered-fovs"
						type="fill"
						sourceId="FOVSource"
						paint={{
							"fill-color": "#35b7f3",
							"fill-opacity": 0.1,
							"fill-antialias": true
						}}
						before={types.includes("Polygon") ? "unclustered-polygons" : null}
					/>
					<Layer
						id="unclustered-fov-outlines"
						type="line"
						sourceId="FOVSource"
						paint={{
							"line-color": "#35b7f3",
							"line-width": 1
						}}
						layout={{
							"line-join": "round",
							"line-cap": "round"
						}}
						before={types.includes("Polygon") ? "unclustered-polygons" : null}
					/>
				</Fragment>
			)}

			{/* Track History */}
			{trackHistory.length > 0 && (
				<Fragment>
					<Layer
						id="track-history-points"
						type="circle"
						sourceId="thPointSource"
						paint={{
							"circle-color": "white",
							"circle-radius": 3
						}}
						before={
							map.getLayer("unclustered-point") ? "unclustered-point" : null
						}
					/>

					<Layer
						id="track-history-lines"
						type="line"
						sourceId="thLineSource"
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
				</Fragment>
			)}
		</div>
	);
};

export default CamerasMapLayers;
