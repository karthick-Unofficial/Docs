import React, { Component, Fragment } from "react";
import _ from "lodash";

import { eventService } from "client-app-core";
import { Source, Layer } from "react-mapbox-gl";
import area from "@turf/area";
import circle from "@turf/circle";
import { Fab } from "@material-ui/core";
import {
	PinDrop as Assign,
	AddLocation as Add,
	Check as Confirm,
	Close as Cancel
} from "@material-ui/icons";
import { DrawingTool, ToolTray, ShapeSelect } from "orion-components/Map/Tools";
import { AlertLayer, VesselPolygons } from "orion-components/Map/Layers";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// Detect protocol (HTTP/HTTPS) for tile endpoint to prevent mixed content
const protocol = window.location.protocol;

const nauticalSource = {
	type: "raster",
	tiles: [
		protocol +
		"//tileservice.charts.noaa.gov/tiles/wmts/50000_1/{z}/{x}/{y}.png"
	]
};

class EventsMapLayers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapStyle: this.props.mapSettings.mapStyle,
			showRoads: this.props.mapSettings.roadsVisible,
			reloadWeather: false,
			editing: false,
			editMode: null
		};
	}

	_startWeatherReload(interval = 60) {
		setInterval(() => {
			this.setState({ reloadWeather: true });
			this.setState({ reloadWeather: false });
		}, interval * 1000);
	}

	addClickHandlers = (map, entities, eventsEntities) => {
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
			if (!_.isEmpty(entitiesFiltered) && !this.props.mapTools.type) {
				const entity = entitiesFiltered[0];
				this.props.loadProfile(
					entity.id,
					entity.entityData.properties.name,
					entity.entityType,
					"profile",
					context
				);
			}
		};

		const handlePolygonClick = (e, context = "secondary") => {
			// If custom flag was set earlier on event (via entity click), bail out to prioritize entity
			if (e.originalEvent.cancelBubble || this.props.mapTools.type) {
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
				this.props.loadProfile(
					entity.id,
					entity.entityData.properties.name,
					entity.entityType,
					"profile",
					context
				);
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
	addNewEventClickHandlers = (map, events) => {
		const handleEventClick = e => {
			const featureId = e.features[0].properties.id;
			const filtered = _.filter(events, event => {
				return _.includes(event.id, featureId);
			});

			if (!_.isEmpty(filtered)) {
				const event = filtered[0];
				this.props.loadProfile(
					event.id,
					event.name,
					event.entityType,
					"profile",
					"primary"
				);
			}
		};

		map.on("click", "unclustered-events", e => handleEventClick(e));
	};

	componentDidMount() {
		const { map, mapSettings, entities, event, events } = this.props;
		// Roads and labels
		this.setRoadsAndLabels(this.state.showRoads);

		// Hide nautical charts if zoomed out beyond useful level
		map.on("zoom", () => {
			if (map.getZoom() < 7 && mapSettings.nauticalChartsVisible) {
				map.setLayoutProperty("nautical", "visibility", "none");
			} else if (map.getZoom() >= 7 && mapSettings.nauticalChartsVisible) {
				map.setLayoutProperty("nautical", "visibility", "visible");
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
			this.setRoadsAndLabels(this.state.showRoads);
			this.handleReorder(e);
		});

		const eventsEntities = event || events;

		this.addClickHandlers(map, entities, eventsEntities);

		// Start timer for reloading current radar overlay
		this._startWeatherReload(300);

		this.setMapEntities(entities);
	}

	/*
	 *	TODO: This method is formatting the data to match that of the Map app,
	 *	which renders a map layer per feed.
	 */
	setMapEntities = entities => {
		const { setMapEntities, selectedFloors } = this.props;
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
		_.each(_.keys(byFeed), feed => setMapEntities({ [feed]: byFeed[feed] }));
	};

	componentWillReceiveProps(nextProps) {
		const { map, mapSettings, entities, events } = this.props;

		// Show/Hide Roads and Labels
		if (nextProps.mapSettings.roadsVisible !== mapSettings.roadsVisible) {
			this.setState({
				showRoads: nextProps.mapSettings.roadsVisible
			});
			this.setRoadsAndLabels(nextProps.mapSettings.roadsVisible);
		}

		// There may be a more precise way to check this
		if (_.size(entities) !== _.size(nextProps.entities)) {
			this.addClickHandlers(map, nextProps.entities, []);
		} else if (_.size(events) !== _.size(nextProps.events)) {
			this.addNewEventClickHandlers(map, nextProps.events);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { map, mapSettings, entities, baseMaps } = this.props;
		// check for map style change
		if (mapSettings.mapStyle !== this.state.mapStyle) {
			if (baseMaps.length > 0) {
				const selectedMap = this.props.baseMaps.filter((element) => element.name === mapSettings.mapStyle)[0];
				map.setStyle(selectedMap.style, { diff: false });
			}
			this.setState({
				mapStyle: mapSettings.mapStyle
			});
		}

		if (!_.isEqual(prevProps.entities, entities)) {
			this.setMapEntities(entities);
		}
	}

	componentWillUnmount() {
		const { feedId, setMapEntities } = this.props;
		// Update rendered map entities
		setMapEntities({ [feedId]: {} });
	}

	setRoadsAndLabels = visible => {
		const { map } = this.props;
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

	handleReorder = e => {
		const { map, mapTools, feedId } = this.props;
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

	renderSilhouettes = () => {
		const { entities, mapTools } = this.props;
		const { isEditingEvent } = this.state;
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
	getGeoJSON = type => {
		const { entities, mapTools, selectedFloors, mapIconTemplates } = this.props;
		const { isEditingEvent } = this.state;
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
					console.log("@@@", item);
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
				} else {
					console.log("###", item);
					return true;
				}
			})
			.filter(item => {
				// return base stations along with tracks
				if (
					type === "Track" &&
					item.entityData.properties.type === "Base Station"
				) {
					return item;
				}
				console.log("map", item.entityData.properties.type.includes(type));
				return item.entityData.properties.type.includes(type);
			})
			.map(item => {
				if (item.entityData.properties.type === "Polygon") {
					item.entityData.type = "Feature";
				}

				item.entityData.properties.id = item.id;
				item.entityData.properties.entityType = item.entityType;

				if (item.entityType === "track") {
					// -- set mapIcon based on jsonata expression
					item.entityData.properties.mapIcon = mapIconTemplates[item.feedId].evaluate(item.entityData);
				}

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

	getTrackHistoryGeoJSON() {
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
		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: historyGeoJSON
			}
		};
		return source;
	}

	getTrackHistoryGeoJSONPoints() {
		const { trackHistory } = this.props;
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
	getEventGeoJSONPoints() {
		const { event, events } = this.props;

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

	getEventProximityGeoJSONPoints() {
		const { event } = this.props;

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
	handleToggleEdit = () => {
		const { setMapTools, event } = this.props;
		const { id, entityData } = event;
		const { isEditingEvent } = this.state;
		if (isEditingEvent) {
			setMapTools({ type: null });
		} else if (!entityData.geometry) {
			setMapTools({
				type: "place_event",
				mode: "draw_point"
			});
		} else {
			setMapTools({
				type: "place_event",
				mode: "simple_select",
				feature: { id, ...entityData }
			});
		}
		this.setState({ isEditingEvent: !isEditingEvent });
	};

	handleUpdateEvent = () => {
		const { event, mapTools } = this.props;
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
		this.handleToggleEdit();
	};

	getNauticalChart = () => {
		const { map } = this.props;
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
	};

	render() {
		const {
			mapSettings,
			types,
			event,
			events,
			canEditGeo,
			map,
			aerisKey,
			mapTools,
			setMapTools,
			dockOpen,
			dir
		} = this.props;
		const { isEditingEvent } = this.state;
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

		return (
			<Fragment>
				{event && canEditGeo && (
					<ToolTray dockOpen={dockOpen} dir={dir}>
						{mapTools.type !== "drawing" && (
							<Fragment>
								{!event.isTemplate && isEditingEvent && (
									<Fab
										size="small"
										onClick={this.handleToggleEdit}
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
												? this.handleUpdateEvent
												: this.handleToggleEdit
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
								<ShapeSelect handleSelect={setMapTools} dir={dir}/>
							</Fragment>
						)}
						<Fragment>
							{!!mapTools.type && <DrawingTool />}
						</Fragment>
					</ToolTray>
				)}
				<AlertLayer map={map} />
				{/* Oceanographic  */}
				{mapSettings.nauticalChartsVisible && this.getNauticalChart()}

				{types.map(type => {
					return (
						<Source
							key={type}
							id={type + "Source"}
							geoJsonSource={this.getGeoJSON(type)}
						/>
					);
				})}

				{/* Current Radar */}
				{mapSettings.weatherVisible && (
					<Source id="currentRadarTiles" tileJsonSource={weatherSource} />
				)}
				{!this.state.reloadWeather && mapSettings.weatherVisible && (
					<Layer
						type="raster"
						id="current-radar"
						sourceId="currentRadarTiles"
					/>
				)}

				<Source
					id="thLineSource"
					geoJsonSource={this.getTrackHistoryGeoJSON()}
				/>

				<Source
					id="thPointSource"
					geoJsonSource={this.getTrackHistoryGeoJSONPoints()}
				/>

				{/* TODO: Once we standardize how non-feed entities are displayed on the map, we should remove
				this hard-coded events layer and add events back according to the map entity schema */}

				{/* Events Source */}
				<Source
					id="eventPointSource"
					geoJsonSource={
						!isEditingEvent
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
						{this.renderSilhouettes()}
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
							sourceId="AccessPointSource"
							layout={{
								"icon-image": "Sensor_gray",
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
	}
}

export default EventsMapLayers;
