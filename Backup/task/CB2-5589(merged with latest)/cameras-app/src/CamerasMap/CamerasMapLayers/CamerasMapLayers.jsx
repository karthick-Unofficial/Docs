/* eslint-disable no-prototype-builtins */
import React, { Fragment, useEffect, useRef, memo } from "react";
import _ from "lodash";
import { Source, Layer } from "react-mapbox-gl";
import area from "@turf/area";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { AlertLayer, VesselPolygons, Spotlight } from "orion-components/Map/Layers";
import MapControls from "./MapControls/MapControls";
import * as mapControlsActions from "./MapControls/mapControlsActions";
import { getSpotlight } from "orion-components/Map/helpers";
import { useDispatch, useSelector } from "react-redux";
import * as camerasMapLayersActions from "./camerasMapLayersActions";
import { cameraMapFeatures, accessPointMapFeatures } from "orion-components/Map/Selectors";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import { primaryContextSelector, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import OrderingLayers from "orion-components/OrderingLayers/OrderingLayers";

const jsonata = require("jsonata");

const MapLayerWrapper = ({ map, feedId }) => {
	let { entityLabelsVisible, mapStyle } = useSelector((state) => mapSettingsSelector(state));
	const contextId = useSelector((state) => primaryContextSelector(state));
	const context = useSelector((state) => selectedContextSelector(state));
	const cameraFeatures = useSelector((state) => cameraMapFeatures(contextId)(state));
	const accessPointFeatures = useSelector((state) => accessPointMapFeatures(contextId)(state));
	const items = Object.assign({}, cameraFeatures, accessPointFeatures);
	const clientConfig = useSelector((state) => state.clientConfig);
	const mapState = useSelector((state) => state.mapState);
	const appState = useSelector((state) => state.appState);
	const contextualData = useSelector((state) => state.contextualData);
	const baseMaps = useSelector((state) => state.baseMaps);
	const { mapSettings } = clientConfig;
	const primaryContext = contextualData[contextId];
	entityLabelsVisible = !!entityLabelsVisible;
	const aerisKey = mapSettings.AERIS_API_KEY;
	const spotlightProximity = appState.global.spotlightProximity;

	return (
		<CamerasMapLayers
			{...camerasMapLayersActions}
			mapName={mapStyle}
			baseMaps={baseMaps}
			mapState={mapState}
			feedId={feedId}
			entityLabelsVisible={entityLabelsVisible}
			context={context}
			items={items}
			map={map}
			aerisKey={aerisKey}
			spotlightProximity={spotlightProximity}
			primaryContext={primaryContext}
		/>
	);
};

const profileIconTemplates = {};
const CamerasMapLayers = memo(
	(props) => {
		const dispatch = useDispatch();
		const {
			loadProfile,
			setMapEntities,
			mapName,
			baseMaps,
			mapState,
			feedId,
			entityLabelsVisible,
			context,
			items,
			map,
			spotlightProximity,
			primaryContext
		} = props;

		// this.drawingRef = createRef();

		//replaced profileIconTemplates as variable to avoid unnecessary rerenders during state update.
		const userFeedState = useSelector((state) => state.session.userFeeds);
		const userFeedsSelector = _.values(userFeedState);

		Object.values(userFeedsSelector).forEach((feed) => {
			profileIconTemplates[feed.feedId] = jsonata(
				feed.mapIconTemplate || "properties.(iconType & '_' & disposition)"
			);
		});

		const renderSilhouettes = (tracks) => {
			const vessels = {};
			_.compact(_.values(tracks)).forEach((track) => {
				if (
					["length", "width", "course", "dimA", "dimB", "dimC", "dimD"].every((key) =>
						track.entityData.properties.hasOwnProperty(key)
					)
				)
					vessels[track.entityData.properties.id] = { ...track };
			});
			return <VesselPolygons vessels={vessels} />;
		};

		const addClickHandlers = () => {
			const filterAndLoadProfile = (id, context) => {
				const entitiesFiltered = Object.values(items)
					.filter((entity) => {
						return _.includes(entity.id, id);
					})
					// Prevent click on selected camera's FOV polygon
					.filter((entity) => {
						return !entity.parentEntity;
					});
				if (entitiesFiltered.length > 0 && mapState.mapTools.type !== "distance") {
					const { id, entityData, entityType } = entitiesFiltered[0];
					dispatch(loadProfile(id, entityData.properties.name, entityType, "profile", context));
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
						features.forEach((feat) => {
							feat.properties.area = area(feat);
						});
						// Prioritize smallest
						const smallestArea = features.reduce((previous, current) => {
							return previous.properties.area < current.properties.area ? previous : current;
						});
						feature = smallestArea;
					} else {
						feature = features[0];
					}
					const { id } = feature.properties;
					filterAndLoadProfile(id, context);
				}
			};

			// cSpell:ignore unclustered
			// Loads details for tracks
			map.on("click", "ac2-unclustered-point", (e) => handleEntityClick(e));
			map.on("touchend", "ac2-unclustered-point", (e) => handleEntityClick(e));
			// Loads details for markers
			map.on("click", "ac2-unclustered-markers", (e) => handleEntityClick(e));
			map.on("touchend", "ac2-unclustered-markers", (e) => handleEntityClick(e));
			// Loads details for lines (solid, dashed, and dotted)
			map.on("click", "ac2-unclustered-lines", (e) => handleEntityClick(e));
			map.on("touchend", "ac2-unclustered-lines", (e) => handleEntityClick(e));
			map.on("click", "ac2-unclustered-lines-dashed", (e) => handleEntityClick(e));
			map.on("touchend", "ac2-unclustered-lines-dashed", (e) => handleEntityClick(e));
			map.on("click", "ac2-unclustered-lines-dotted", (e) => handleEntityClick(e));
			map.on("touchend", "ac2-unclustered-lines-dotted", (e) => handleEntityClick(e));
			// Loads details for cameras
			map.on("click", "ac2-unclustered-camera", (e) => handleEntityClick(e, "primary"));
			map.on("touchend", "ac2-unclustered-camera", (e) => handleEntityClick(e, "primary"));
			// Loads details for accessPoints
			map.on("click", "ac2-unclustered-accessPoint", (e) => handleEntityClick(e, "primary"));
			map.on("touchend", "ac2-unclustered-accessPoint", (e) => handleEntityClick(e, "primary"));
			// Loads details for polygons
			map.on("click", "ac2-unclustered-polygons", (e) => handlePolygonClick(e));
			map.on("touchend", "ac2-unclustered-polygons", (e) => handlePolygonClick(e));
			map.on("click", "ac2-unclustered-events", (e) => handleEntityClick(e, "secondary"));
			map.on("touchend", "ac2-unclustered-events", (e) => handleEntityClick(e, "secondary"));
		};

		useEffect(() => {
			map.on("mousemove", (e) => handleMouseMove(e.point));

			// cSpell:ignore styledata
			map.on("styledata", (e) => {
				handleReorder(e);
			});
			handleMouseMove();
			addClickHandlers(map);
			setMapEntity(Object.values(items));
		}, []);

		const handleMouseMove = (point) => {
			const featureLayers = map
				.getStyle()
				.layers.filter((layer) => layer.source !== "composite")
				.map((layer) => layer.id);
			const features = map.queryRenderedFeatures(point, {
				layers: featureLayers
			});
			map.getCanvas().style.cursor = features.length ? "pointer" : "";
		};

		const setMapEntity = (item) => {
			const byFeed = _.groupBy(item, "feedId");
			_.each(_.keys(byFeed), (feed) => (byFeed[feed] = _.keyBy(byFeed[feed], "id")));
			_.each(_.keys(byFeed), (feed) => dispatch(setMapEntities({ [feed]: byFeed[feed] })));
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
			if (prevProps) {
				if (mapName !== prevProps.mapName) {
					if (baseMaps.length > 0) {
						const selectedMap = baseMaps.filter((element) => element.name === mapName)[0];
						map.setStyle(selectedMap.style, { diff: false });
					}
				}
				if (!_.isEqual(prevProps.items, items)) {
					setMapEntity(Object.values(items));
				}
				addClickHandlers();
			}
		}, [props]);

		const handleReorder = (e) => {
			const sources = _.keys(e.style.sourceCaches);
			const layers = _.map(map.getStyle().layers, "id");

			if (!mapState.mapTools.type) {
				_.each(sources, (id) => {
					const pointLayers = _.filter(
						layers,
						(layer) => _.includes(layer, feedId) && _.includes(layer, "-symbol")
					);
					const circleLayers = _.filter(
						layers,
						(layer) => _.includes(layer, feedId) && _.includes(layer, "-circle")
					);
					const lineLayers = _.filter(
						layers,
						(layer) => _.includes(layer, feedId) && _.includes(layer, "-line")
					);

					// Move lines above polygons
					_.each(lineLayers, (layer) => {
						map.moveLayer(layer);
					});

					// Move circles above lines
					_.each(circleLayers, (layer) => {
						map.moveLayer(layer);
					});

					// Move points above lines
					_.each(pointLayers, (layer) => {
						map.moveLayer(layer);
					});

					// Make sure that clusters from any feed and alerts are at the top of the layer stack
					if (map.getLayer(feedId + "-alert-badge")) map.moveLayer(feedId + "-alert-badge");
					if (map.getLayer(feedId + "-clusters")) map.moveLayer(feedId + "-clusters");
					if (map.getLayer(feedId + "-cluster-count")) map.moveLayer(feedId + "-cluster-count");
					if (map.getLayer("alerts")) map.moveLayer("alerts");
				});
			}
		};

		const getGeoJSON = (entityType) => {
			const { mode, feature } = mapState.mapTools;
			const filteredItems = Object.values(items)
				.filter((item) => {
					if (entityType === "FOV") {
						return item.parentEntity;
					} else {
						const type =
							item.entityType === "accessPoint"
								? item.entityType
								: item &&
									item.entityData &&
									item.entityData.properties &&
									item.entityData.properties.type
									? item.entityData.properties.type
									: item.entityType;
						return type.toLowerCase() === entityType.toLowerCase() && !item.parentEntity;
					}
				})
				.filter((item) => {
					// Remove current FOV or camera from map while editing
					if (!!mode && !!feature) {
						return item.id !== feature.id;
					} else {
						return item;
					}
				})
				.map((item) => {
					if (item.entityData.properties.type === "Polygon") {
						item.entityData.type = "Feature";
					}
					item.entityData.properties.id = item.id;
					item.entityData.properties.entityType = item.entityType;

					if (item.entityType === "track" || item.entityType === "accessPoint") {
						// -- set mapIcon based on jsonata expression
						item.entityData.properties.mapIcon = profileIconTemplates[item.feedId].evaluate(
							item.entityData
						);
					}

					if (item.hasOwnProperty("controls")) item.entityData.properties.controls = item.controls;

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

		const getTypes = () => {
			const types = [
				...new Set(
					Object.values(items).map((item) => {
						if (item.entityType === "accessPoint") {
							return item.entityType;
						} else {
							return item &&
								item.entityData &&
								item.entityData.properties &&
								item.entityData.properties.type
								? item.entityData.properties.type
								: item.entityType;
						}
					})
				)
			];
			return types;
		};

		// For distance tool. Should probably be refactored. TODO: add a container to Distance Tool
		const tracks = Object.values(items).filter((item) => item.entityType === "track");
		const contextLoaded = context && context.entity;
		const types = getTypes();
		const hasSource = (type) => types.includes(type);

		return (
			<div>
				<OrderingLayers />
				<MapControls {...mapControlsActions} />
				<AlertLayer map={map} before="---ac2-alerts-position-end" />
				{contextLoaded &&
					primaryContext.entity.entityType !== "accessPoint" &&
					primaryContext.entity.entityData.geometry &&
					mapState.mapTools.type !== "spotlight" && (
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

				{contextLoaded && <Source id="ac2-eventPointSource" geoJsonSource={getGeoJSON("Event")} />}

				{types.map((type) => {
					if (typeof type !== "undefined") {
						return (
							<Source
								key={type.replace(/\s/g, "")}
								id={type.replace(/\s/g, "") + "Source"}
								geoJsonSource={getGeoJSON(type)}
							/>
						);
					} else {
						return <></>;
					}
				})}

				{/* Tracks & Clusters */}
				{hasSource("Track") && (
					<div>
						<Layer
							id="ac2-clusters"
							type="circle"
							sourceId="TrackSource"
							filter={["has", "point_count"]}
							paint={{
								"circle-color": {
									property: "point_count",
									type: "interval",
									stops: [
										[0, "#999999"],
										[100, "#666666"],
										[750, "#333333"]
									]
								},
								"circle-stroke-width": 3,
								"circle-stroke-color": "#ffffff",
								"circle-radius": {
									property: "point_count",
									type: "interval",
									stops: [
										[0, 20],
										[100, 30],
										[750, 40]
									]
								}
							}}
							before="---ac2-clusters-position-end"
						/>

						<Layer
							id="cluster-count"
							type="symbol"
							sourceId="TrackSource"
							filter={["has", "point_count"]}
							layout={{
								"text-field": "{point_count_abbreviated}",
								"text-font": [
									"DIN Offc Pro Medium", // cSpell:ignore offc
									"Arial Unicode MS Bold"
								],
								"text-size": 16
							}}
							paint={{
								"text-color": "#FFFFFF"
							}}
							before="ac2-clusters"
						/>

						{renderSilhouettes(tracks)}
						<Layer
							id="ac2-unclustered-point"
							type="symbol"
							sourceId="TrackSource"
							filter={["!has", "point_count"]}
							layout={{
								"icon-image": "{mapIcon}",
								"icon-size": 1,
								"icon-rotate": [
									"case",
									["any", ["all", ["has", "course"], ["has", "heading"]], ["has", "heading"]],
									["get", "heading"],
									[
										"any",
										["all", ["has", "course"], ["has", "hdg"], ["!=", ["get", "hdg"], 511]],
										["all", ["has", "hdg"], ["!=", ["get", "hdg"], 511]]
									],
									["get", "hdg"],
									[
										"any",
										["all", ["has", "course"], ["has", "hdg"], ["==", ["get", "hdg"], 511]],
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
							before="---ac2-feed-entities-position-end"
						/>
					</div>
				)}

				{contextLoaded && (
					<Layer
						id="ac2-unclustered-events"
						type="symbol"
						sourceId="ac2-eventPointSource"
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
						before="---ac2-feed-entities-position-end"
					/>
				)}

				{/* Cameras */}
				{hasSource("Camera") && (
					<Layer
						id="ac2-unclustered-camera"
						type="symbol"
						sourceId="CameraSource"
						filter={["!has", "point_count"]}
						layout={{
							"icon-image": ["case", ["has", "mapIcon"], ["get", "mapIcon"], "Camera_gray"],
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
						before="---ac2-feed-entities-position-end"
					/>
				)}

				{/* Access Point */}
				{hasSource("accessPoint") && (
					<Layer
						id="ac2-unclustered-accessPoint"
						type="symbol"
						sourceId="accessPointSource"
						filter={["!has", "point_count"]}
						layout={{
							"icon-image": ["case", ["has", "mapIcon"], ["get", "mapIcon"], "Sensor_gray"],
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
						before="---ac2-feed-entities-position-end"
					/>
				)}

				{/* Points */}
				{hasSource("Point") && (
					<Layer
						id="ac2-unclustered-markers"
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
						before={types.includes("Track") ? "ac2-clusters" : "---ac2-feed-entities-position-end"}
					/>
				)}

				{/* Lines */}
				{hasSource("Line") && (
					<div>
						<Layer
							id="ac2-line-labels"
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
							before={types.includes("Track") ? "ac2-clusters" : "---ac2-feed-entities-position-end"}
						/>
						{/* SOLID */}
						<Layer
							id="ac2-unclustered-lines"
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
							before={types.includes("Point") ? "ac2-unclustered-markers" : "ac2-line-labels"}
							properties={{
								title: entityLabelsVisible ? "{name}" : ""
							}}
							filter={["==", "lineType", "Solid"]}
						/>
						{/* DASHED */}
						<Layer
							id="ac2-unclustered-lines-dashed"
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
							before={types.includes("Point") ? "ac2-unclustered-markers" : "ac2-line-labels"}
							properties={{
								title: entityLabelsVisible ? "{name}" : ""
							}}
							filter={["==", "lineType", "Dashed"]}
						/>
						{/* DOTTED */}
						<Layer
							id="ac2-unclustered-lines-dotted"
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
							before={types.includes("Point") ? "ac2-unclustered-markers" : "ac2-line-labels"}
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
							id="ac2-unclustered-polygons"
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
							before={
								types.includes("Line") ? "ac2-unclustered-lines" : "---ac2-feed-entities-position-end"
							}
						/>
						{/* SOLID */}
						<Layer
							id="ac2-unclustered-polygons-outlines"
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
							before={
								types.includes("Line") ? "ac2-unclustered-lines" : "---ac2-feed-entities-position-end"
							}
							filter={["==", "lineType", "Solid"]}
						/>
						{/* DASHED */}
						<Layer
							id="ac2-unclustered-polygons-dashed"
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
							before={
								types.includes("Line") ? "ac2-unclustered-lines" : "---ac2-feed-entities-position-end"
							}
							filter={["==", "lineType", "Dashed"]}
						/>
						{/* DOTTED */}
						<Layer
							id="ac2-unclustered-polygons-dotted"
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
							before={
								types.includes("Line") ? "ac2-unclustered-lines" : "---ac2-feed-entities-position-end"
							}
							filter={["==", "lineType", "Dotted"]}
						/>
						<Layer
							id="ac2-poly-labels"
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
							before={types.includes("Track") ? "ac2-clusters" : "---ac2-feed-entities-position-end"}
						/>
					</div>
				)}

				{/* FOVs */}
				{hasSource("FOV") && (
					<Fragment>
						<Layer
							id="ac2-unclustered-fovs"
							type="fill"
							sourceId="FOVSource"
							paint={{
								"fill-color": "#35b7f3",
								"fill-opacity": 0.1,
								"fill-antialias": true
							}}
							before={
								types.includes("Polygon")
									? "ac2-unclustered-polygons"
									: "---ac2-feed-entities-position-end"
							}
						/>
						<Layer
							id="ac2-unclustered-fov-outlines"
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
							before={
								types.includes("Polygon")
									? "ac2-unclustered-polygons"
									: "---ac2-feed-entities-position-end"
							}
						/>
					</Fragment>
				)}
			</div>
		);
	},
	(prevProps, nextProps) => _.isEqual(prevProps, nextProps)
);

export default MapLayerWrapper;
