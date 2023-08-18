import React, { useRef, Fragment, useEffect, useState, useCallback, memo } from "react";
import _ from "lodash";

import { eventService } from "client-app-core";
import { Source, Layer } from "react-mapbox-gl";
import area from "@turf/area";
import circle from "@turf/circle";
import { Fab } from "@mui/material";
import {
	PinDrop as Assign,
	AddLocation as Add,
	Check as Confirm,
	Close as Cancel
} from "@mui/icons-material";
import { DrawingTool, ToolTray, ShapeSelect } from "orion-components/Map/Tools";
import { AlertLayer, VesselPolygons } from "orion-components/Map/Layers";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const jsonata = require("jsonata");

import {
	loadProfile,
	setMapEntities,
	updateShape,
	setMapTools
} from "./eventsMapLayersActions.js";
import { availableEventsSelector, userFeedsSelector } from "orion-components/GlobalData/Selectors";
import {
	primaryContextSelector,
	selectedContextSelector,
	secondaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import { contextualDataByKey } from "orion-components/ContextualData/Selectors";

import {
	mapSettingsSelector,
	mapState as mapStateSelector,
	persistedState
} from "orion-components/AppState/Selectors";

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}

// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const nauticalSource = {
	type: "raster",
	tiles: [
		window.location.protocol +
		"//gis.charttools.noaa.gov/arcgis/rest/services/MCS/NOAAChartDisplay/MapServer/exts/MaritimeChartService/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=0,1,2,3,4,5,6,7,9,10"
	],
	tileSize: 256
};

const EventsMapLayers = ({
	map,
	feedId
}) => {

	const dispatch = useDispatch();

	const baseMaps = useSelector(state => state.baseMaps);
	const user = useSelector(state => state.session.user.profile);
	const events = useSelector(state => availableEventsSelector(state));
	const primaryId = useSelector(state => primaryContextSelector(state));
	const secondaryId = useSelector(state => secondaryContextSelector(state));
	const clientConfig = useSelector(state => state.clientConfig);
	const contextualData = useSelector(state => state.contextualData);
	const mapState = useSelector(state => state.mapState);

	const dockData = useSelector(state => state.appState.dock.dockData);
	const primary = contextualData[primaryId];
	const mapStatus = useSelector(state => mapStateSelector(state));
	// const event = primary ? primary.entity : null;
	let event;
	let pinnedItems = [];
	let canEditGeo;
	let proximityEntities = [];
	const context = useSelector(state => selectedContextSelector(state));
	if (primary && primary.entity) {
		const entity = primary.entity;
		event = entity;
		canEditGeo =
			user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage") &&
			(context && (context.entity.id === primaryId || context.entity.id === secondaryId));
		proximityEntities = context && context.proximityEntities ? context.proximityEntities : [];
		//don't duplicate items that exist in proximity and are pinned
	}
	pinnedItems = useSelector(state => primary && primary.entity &&
		contextualDataByKey(primaryId, "pinnedItems")(state) ?
		contextualDataByKey(primaryId, "pinnedItems")(state).filter(pinned => !proximityEntities.find(entity => pinned.id === entity.id))
		: []);

	const activeFOVs = useSelector(state => state.globalData.fovs
		? _.filter(_.values(state.globalData.fovs.data), fov =>
			_.includes(_.keys(mapStatus.entities.cameras), fov.parentEntity)
		)
		: []);
	const types = ["Track", "Line", "Point", "Polygon", "Camera", "FOV", "accessPoint"];
	const trackHistory = _.mapValues(
		_.filter(contextualData, context => context.trackHistory),
		"trackHistory"
	);
	const selectedFloors = useSelector(state => persistedState(state).selectedFloors);
	const filteredSelectedFloors = {};
	const pinnedItemsById = _.groupBy(pinnedItems, "id");
	if (pinnedItems.length && selectedFloors) {
		Object.keys(selectedFloors).forEach(facilityId => {
			if (pinnedItemsById[facilityId] && selectedFloors[facilityId]) {
				filteredSelectedFloors[facilityId] = selectedFloors[facilityId];
			}
		});
	}

	// -- get a list of all mapIconTemplates
	const mapIconTemplates = {};
	const userFeed = useSelector(state => userFeedsSelector(state));
	Object.values(userFeed).forEach(feed => {
		mapIconTemplates[feed.feedId] = jsonata(feed.mapIconTemplate || "properties.(iconType & '_' & disposition)");
	});
	const nauticalChartsEnabled = _.size(clientConfig) && clientConfig.mapSettings.nauticalChartsEnabled;
	const weatherEnabled = _.size(clientConfig) && clientConfig.mapSettings.weatherEnabled;
	const mapSettings = useSelector(state => mapSettingsSelector(state));
	const entities = [...pinnedItems, ...activeFOVs, ...proximityEntities];
	const aerisKey = clientConfig.mapSettings.AERIS_API_KEY;
	const mapTools = useSelector(state => state.mapState.mapTools);
	const dockOpen = useSelector(state => state.appState.dock.dockData.dockOpen);
	const dir = useSelector(state => getDir(state));



	const [mapStyle, setMapStyle] = useState(mapSettings.mapStyle);
	const [showRoads, setShowRoads] = useState(mapSettings.roadsVisible);
	const [reloadWeather, setReloadWeather] = useState(false);
	const [isEditingEvent, setIsEditingEvent] = useState(false);

	const prevEntities = usePrevious(entities);

	function _startWeatherReload(interval = 60) {
		setInterval(() => {
			setReloadWeather(true);
			setReloadWeather(false);
		}, interval * 1000);
	}

	const addClickHandlers = (map, entities, eventsEntities) => {
		const handleEntityClick = (e, context = "secondary") => {
			// Add custom cancel bubble property to original event
			e.originalEvent.cancelBubble = true;

			const featureId = e.features[0].properties.id;
			// const featureType = e.features[0].properties.type;
			const { source } = e.features[0];
			let entitiesFiltered = [];
			// console.log("EVENTS", eventsEntities);
			if (source === "eventPointSource") {
				entitiesFiltered = _.filter(eventsEntities, entity => {
					return _.includes(entity.id, featureId);
				});
			} else {
				entitiesFiltered = _.filter(entities, entity => {
					return _.includes(entity.id, featureId);
				});
			}
			if (!_.isEmpty(entitiesFiltered) && !mapTools.type) {
				const entity = entitiesFiltered[0];
				dispatch(loadProfile(
					entity.id,
					entity.entityData.properties.name,
					entity.entityType,
					"profile",
					context
				));
			}
		};

		const handlePolygonClick = (e, context = "secondary") => {
			// If custom flag was set earlier on event (via entity click), bail out to prioritize entity
			if (e.originalEvent.cancelBubble || mapTools.type) {
				return;
			}

			const features = e.features;
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

			const featureId = feature.properties.id;
			const entitiesFiltered = _.filter(entities, entity => {
				return _.includes(entity.id, featureId);
			});

			if (!_.isEmpty(entitiesFiltered)) {
				const entity = entitiesFiltered[0];
				dispatch(loadProfile(
					entity.id,
					entity.entityData.properties.name,
					entity.entityType,
					"profile",
					context
				));
			}
		};

		// Loads details for polygons
		map.on("click", "unclustered-polygons", e => handlePolygonClick(e));
		// Loads details for tracks
		map.on("click", "unclustered-point", e => handleEntityClick(e));
		// Loads details for markers
		map.on("click", "unclustered-markers", e => handleEntityClick(e));
		// Loads details for lines
		map.on("click", "unclustered-lines", e => handleEntityClick(e));
		map.on("click", "unclustered-lines-dashed", e => handleEntityClick(e));
		map.on("click", "unclustered-lines-dotted", e => handleEntityClick(e));
		// Loads details for markers
		map.on("click", "unclustered-cameras", e => handleEntityClick(e));
		map.on("click", "unclustered-accessPoint", e => handleEntityClick(e));
		// Loads details for events
		map.on("click", "unclustered-events", e => handleEntityClick(e, "primary"));
	};

	// TODO: Combine this and the above click handler method when we update
	// the way we display things on the map & store feature info in the DB
	const addNewEventClickHandlers = (map, events) => {
		const handleEventClick = e => {
			const featureId = e.features[0].properties.id;
			const filtered = _.filter(events, event => {
				return _.includes(event.id, featureId);
			});

			if (!_.isEmpty(filtered)) {
				const event = filtered[0];
				dispatch(loadProfile(
					event.id,
					event.name,
					event.entityType,
					"profile",
					"primary"
				));
			}
		};

		map.on("click", "unclustered-events", e => handleEventClick(e));
	};

	useEffect(() => {
		// Roads and labels
		setRoadsAndLabels(showRoads);

		// Hide nautical charts if zoomed out beyond useful level
		map.on("zoom", () => {
			if (!nauticalChartsEnabled) {
				//null
			} else {
				if (map.getZoom() < 7 && mapSettings.nauticalChartsVisible) {
					map.setLayoutProperty("nautical", "visibility", "none");
				} else if (map.getZoom() >= 7 && mapSettings.nauticalChartsVisible) {
					map.setLayoutProperty("nautical", "visibility", "visible");
				}
			}
		});

		// Change cursor to pointer when over a shape or entity
		map.on("mousemove", e => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [
					"unclustered-polygons",
					"unclustered-markers",
					"unclustered-point",
					"unclustered-lines",
					"unclustered-lines-dashed",
					"unclustered-lines-dotted",
					"unclustered-cameras",
					"unclustered-accessPoint",
					"unclustered-events",
					"clusters"
				]
			});
			map.getCanvas().style.cursor = _.size(features) ? "pointer" : "";
		});

		map.on("styledata", (e) => {
			//setRoadsAndLabels(showRoads); // leads to mismatch of roadsAndLabels
			handleReorder(e);
		});

		const eventsEntities = event || events;

		addClickHandlers(map, entities, eventsEntities);

		// Start timer for reloading current radar overlay
		_startWeatherReload(300);

		setUpMapEntities(entities);
	}, []);

	/*
	 *	TODO: This method is formatting the data to match that of the Map app,
	 *	which renders a map layer per feed.
	 */
	const setUpMapEntities = entities => {

		const filteredData = entities.filter(entity => {
			if (entity.entityType === "camera" && entity.entityType === "accessPoint" && entity.entityData.displayType === "facility") {
				let activated = false;
				if (selectedFloors) {
					Object.keys(selectedFloors).some(facilityId => {
						if (selectedFloors[facilityId] && selectedFloors[facilityId].id === entity.entityData.displayTargetId) {
							activated = true;
							return true;
						}
						return false;
					});
				}
				return activated;
			} else
				return true;
		});

		const byFeed = _.groupBy(filteredData, "feedId");
		_.each(
			_.keys(byFeed),
			feed => (byFeed[feed] = _.keyBy(byFeed[feed], "id"))
		);
		_.each(_.keys(byFeed), feed => dispatch(setMapEntities({ [feed]: byFeed[feed] })));
	};

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
				return map.setLayoutProperty(layer.id, "visibility", "visible");
			} else {
				return map.setLayoutProperty(layer.id, "visibility", "none");
			}
		});
	};

	const handleReorder = e => {

		const sources = _.keys(e.style.sourceCaches);
		const layers = _.map(map.getStyle().layers, "id");

		if (!mapTools.type) {
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

	const renderSilhouettes = () => {

		const { feature } = mapTools;
		const vessels = {};
		entities
			.filter(item => {
				if (feature && !isEditingEvent) {
					return item.id !== feature.id;
				} else {
					return true;
				}
			})
			.filter(item => {
				return item.entityData.properties.type.toLowerCase().includes("track");
			})
			.forEach(track => {
				if (
					["length", "width", "course", "dimA", "dimB", "dimC", "dimD"].every(
						key => track.entityData.properties.hasOwnProperty(key)
					)
				)
					vessels[track.entityData.properties.id] = { ...track };
			});
		return <VesselPolygons vessels={vessels} />;
	};

	const getGeoJSON = type => {

		const { feature } = mapTools;
		const items = entities
			.filter(item => {
				if (feature && !isEditingEvent) {
					return item.id !== feature.id;
				} else {
					return true;
				}
			})
			.filter(item => {
				if (item.entityType === "camera" || item.entityType === "accessPoint" && item.entityData.displayType === "facility") {
					let activated = false;
					if (selectedFloors) {
						Object.keys(selectedFloors).some(facilityId => {
							if (selectedFloors[facilityId] && selectedFloors[facilityId].id === item.entityData.displayTargetId) {
								activated = true;
								return true;
							}
							return false;
						});
					}
					return activated;
				} else
					return true;
			})
			.filter(item => {
				// return base stations along with tracks
				if (
					type === "Track" &&
					item.entityData.properties.type === "Base Station"
				) {
					return item;
				}
				if (type === "accessPoint") {
					return item.entityType.includes(type);
				}
				else {
					return item.entityData.properties.type.includes(type);
				}
			})
			.map(item => {
				if (item.entityData.properties.type === "Polygon") {
					item.entityData.type = "Feature";
				}

				item.entityData.properties.id = item.id;
				item.entityData.properties.entityType = item.entityType;
				item.entityData.properties.mapIcon = mapIconTemplates[item.feedId].evaluate(item.entityData);

				if (item.hasOwnProperty("controls"))
					item.entityData.properties.controls = item.controls;

				return item.entityData;
			});

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: items
			}
		};

		return source;
	};

	function getTrackHistoryGeoJSON() {

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
	}

	function getTrackHistoryGeoJSONPoints() {

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
	}

	/**
	 * Generate features from a single, selected event, or all events user has access to
	 * depending on the state of the application
	 */
	function getEventGeoJSONPoints() {

		const eventsPoints = [];

		// Show selected event on map
		if (event) {
			if (event.entityData.properties && !event.entityData.properties.id) {
				event.entityData.properties.id = event.id;
			}
			eventsPoints.push(event.entityData);
		}
		// Show all events on map
		else if (events) {
			_.each(events, event => {
				if (event.entityData.properties && !event.entityData.properties.id) {
					event.entityData.properties.id = event.id;
				}
				eventsPoints.push(event.entityData);
			});
		}

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: eventsPoints
			}
		};
		return source;
	}

	function getEventProximityGeoJSONPoints() {

		const eventProximityGeoJSON = [];

		// Show selected event's proximities on map
		if (event && event.proximities && event.entityData.geometry && event.entityData.geometry.coordinates) {
			_.each(event.proximities, proximity => {
				let radiusInKM;
				if (proximity.distanceUnits === "mi") {
					radiusInKM = proximity.radius * 1.609344;
				}
				else {
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

	// Ensures state.editing is true before attempting to access the draw controls
	const handleToggleEdit = () => {

		const { id, entityData } = event;
		if (isEditingEvent) {
			dispatch(setMapTools({ type: null }));
		} else if (!entityData.geometry) {
			dispatch(setMapTools({
				type: "place_event",
				mode: "draw_point"
			}));
		} else {
			dispatch(setMapTools({
				type: "place_event",
				mode: "simple_select",
				feature: { id, ...entityData }
			}));
		}
		setIsEditingEvent(!isEditingEvent);
	};

	const handleUpdateEvent = () => {

		const { geometry } = mapTools.feature;
		const { id, name, desc } = event;
		const update = {
			entityData: {
				geometry,
				properties: {
					description: desc,
					id,
					name,
					type: "Event"
				}
			}
		};
		eventService.updateEvent(event.id, update, (err, res) => {
			if (err) console.log("Update event geo error: ", err);
		});
		handleToggleEdit();
	};

	const getNauticalChart = useCallback(() => {
		const { layers } = map.getStyle();
		let firstSymbol;
		for (let i = 0; i < layers.length; i++) {
			if (layers[i].type === "symbol") {
				firstSymbol = layers[i].id;
				break;
			}
		}
		return (
			<Fragment>
				<Source id="nauticalCharts" tileJsonSource={nauticalSource} />
				<Layer
					type="raster"
					id="nautical"
					sourceId="nauticalCharts"
					before={firstSymbol}
				/>
			</Fragment>
		);
	}, [mapSettings]);


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

	useEffect(() => {

		// Show/Hide Roads and Labels		
		setShowRoads(mapSettings.roadsVisible);
		setRoadsAndLabels(mapSettings.roadsVisible);

		// There may be a more precise way to check this

		addClickHandlers(map, entities, []);

		addNewEventClickHandlers(map, events);

	}, [mapSettings, entities, events]);


	function handleComponentUpdates() {
		if (mapSettings.mapStyle !== mapStyle) {
			if (baseMaps.length > 0) {
				const selectedMap = baseMaps.filter((element) => element.name === mapSettings.mapStyle)[0];
				map.setStyle(selectedMap.style, { diff: false });
			}
			setMapStyle(mapSettings.mapStyle);
		}
		if (!_.isEqual(prevEntities, entities)) {
			setUpMapEntities(entities);
		}
	}

	useEffect(() => {
		handleComponentUpdates();
	}, [mapSettings, entities]);

	useEffect(() => {
		return (() => {
			dispatch(setMapEntities({ [feedId]: {} }));
		});
	}, []);


	return (
		<Fragment>
			{event && canEditGeo && (
				<ToolTray dockOpen={dockOpen} dir={dir}>
					{mapTools.type !== "drawing" && (
						<Fragment>
							{!event.isTemplate && isEditingEvent && (
								<Fab
									size="small"
									onClick={handleToggleEdit}
									style={{
										backgroundColor: "#E85858",
										color: "#FFF",
										bottom: 24
									}}
								>
									<Cancel />
								</Fab>
							)}
							{!event.isTemplate && (
								<Fab
									color="primary"
									style={{
										backgroundColor: isEditingEvent ? "#4CAF50" : "",
										color: "#FFF"
									}}
									onClick={
										isEditingEvent
											? handleUpdateEvent
											: handleToggleEdit
									}
								>
									{isEditingEvent ? (
										<Confirm />
									) : event.entityData.geometry ? (
										<Assign />
									) : (
										<Add />
									)}
								</Fab>
							)}
							<ShapeSelect handleSelect={setMapTools} dir={dir} />
						</Fragment>
					)}
					<Fragment>
						{!!mapTools.type && <DrawingTool />}
					</Fragment>
				</ToolTray>
			)}
			<AlertLayer map={map} />
			{/* Oceanographic  */}
			{!nauticalChartsEnabled ? null : (mapSettings.nauticalChartsVisible && getNauticalChart())}

			{types.map(type => {
				return (
					<Source
						key={type}
						id={type + "Source"}
						geoJsonSource={getGeoJSON(type)}
					/>
				);
			})}

			{/* Current Radar */}
			{!weatherEnabled ? null : (mapSettings.weatherVisible && (
				<Source id="currentRadarTiles" tileJsonSource={weatherSource} />
			))}
			{!weatherEnabled ? null : (!reloadWeather && mapSettings.weatherVisible && (
				<Layer
					type="raster"
					id="current-radar"
					sourceId="currentRadarTiles"
				/>
			))}

			<Source
				id="thLineSource"
				geoJsonSource={getTrackHistoryGeoJSON()}
			/>

			<Source
				id="thPointSource"
				geoJsonSource={getTrackHistoryGeoJSONPoints()}
			/>

			{/* TODO: Once we standardize how non-feed entities are displayed on the map, we should remove
			this hard-coded events layer and add events back according to the map entity schema */}

			{/* Events Source */}
			<Source
				id="eventPointSource"
				geoJsonSource={
					!isEditingEvent
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
			{event || events ? (
				<Layer
					id="unclustered-events"
					type="symbol"
					sourceId="eventPointSource"
					layout={{
						"icon-image": "Incident_gray",
						"icon-size": 1,
						"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
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
			) : null}

			{/* Events Proximity Source */}
			<Source
				id="eventProximitySource"
				geoJsonSource={
					getEventProximityGeoJSONPoints()
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
						before={types.includes("Line") ? "unclustered-lines" : null}
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
						before={types.includes("Line") ? "unclustered-lines" : null}
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
						before={types.includes("Line") ? "unclustered-lines" : null}
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
						before={types.includes("Line") ? "unclustered-lines" : null}
						filter={["==", "lineType", "Dotted"]}
					/>
					<Layer
						id="event-proximity-labels"
						type="symbol"
						sourceId="eventProximitySource"
						layout={{
							"symbol-placement": "point",
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
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
			) : null}

			{/* Tracks & Clusters */}
			{
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
					{renderSilhouettes()}
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
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
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
			}

			{/* Points */}
			{
				<div>
					<Layer
						id="unclustered-markers"
						type="symbol"
						sourceId="PointSource"
						layout={{
							"icon-image": "{symbol}",
							"icon-size": 1,
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 11,
							"text-letter-spacing": 0,
							"text-offset": [2.2, 0],
							"text-ignore-placement": true,
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
						before={types.includes("Track") ? "clusters" : null}
					/>
				</div>
			}

			{/* Cameras */}
			{
				<div>
					<Layer
						id="unclustered-cameras"
						type="symbol"
						sourceId="CameraSource"
						layout={{
							"icon-image": "Camera_gray",
							"icon-size": 1,
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 11,
							"text-letter-spacing": 0,
							"text-offset": [2, 0],
							"text-ignore-placement": true,
							"icon-allow-overlap": true,
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
				</div>
			}

			{/* Access Point */}
			{
				<div>
					<Layer
						id="unclustered-accessPoint"
						type="symbol"
						sourceId="accessPointSource"
						layout={{
							"icon-image": [
								"case",
								["has", "mapIcon"],
								["get", "mapIcon"],
								"Sensor_gray"
							],
							"icon-size": 1,
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 11,
							"text-letter-spacing": 0,
							"text-offset": [2, 0],
							"text-ignore-placement": true,
							"icon-allow-overlap": true,
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
				</div>
			}

			{/* Lines */}
			{
				<div>
					<Layer
						id="line-labels"
						type="symbol"
						sourceId="LineSource"
						layout={{
							"symbol-placement": "line",
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
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
							title: mapSettings.entityLabelsVisible ? "{name}" : ""
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
							title: mapSettings.entityLabelsVisible ? "{name}" : ""
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
							title: mapSettings.entityLabelsVisible ? "{name}" : ""
						}}
						filter={["==", "lineType", "Dotted"]}
					/>
				</div>
			}

			{/* Polygons */}
			{
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
						id="unclustered-polygons-outlines-dashed"
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
						id="unclustered-polygons-outlines-dotted"
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
							"text-field": mapSettings.entityLabelsVisible ? "{name}" : "",
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
			}

			{/* FOVs */}
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

			{/* Track History */}
			<Layer
				id="track-history-points"
				type="circle"
				sourceId="thPointSource"
				paint={{
					"circle-color": "white",
					"circle-radius": 3
				}}
				before="unclustered-point"
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
	);
};

const onPropsChange = (prevProps, nextProps) => {
	return (
		_.isEqual(prevProps, nextProps)
	);
};

export default memo(EventsMapLayers, onPropsChange);