/* eslint react/prop-types: 0 */
import React, { memo, useEffect, useState, useRef, Fragment } from "react";
import { GeoJSONLayer, Layer } from "react-mapbox-gl";
import area from "@turf/area";

import { layerStyles } from "./layerStyles";
import { VesselPolygons } from "orion-components/Map/Layers";
import { setMapEntities } from "orion-components/AppState/Actions";
import { setMapEntities as setMapEntitiesLocal } from "../../../../../ReplayMapBase/replayMapActions";
import {
	mapSettingsSelector,
	persistedState,
	disabledFeedsSelector
} from "orion-components/AppState/Selectors";
import { updateContext } from "orion-components/ContextualData/Actions";
import {
	layerSourcesSelector,
	userFeedsSelector,
	alertSelector
} from "orion-components/GlobalData/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { userIntegrationByFeedIdSelector } from "orion-components/Session/Selectors";
import _ from "lodash";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

const jsonata = require("jsonata");

const CLUSTER_RADIUS_STOPS = [[0, 20], [100, 30], [750, 40]];

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);


const MapLayerwrapper = (props) => {

	const { map, feedId, loadProfileOffline, replayMap, getInitialPlayBarData, interactiveFeatures } = props;

	const settings = useSelector(state => mapSettingsSelector(state));
	const disabledFeeds = useSelector(state => replayMap ? disabledFeedsSelector(state) : []);
	const userFeedData = useSelector(state => userFeedsSelector(state));
	const feed = _.find(
		userFeedData,
		feed => feed.feedId === props.feedId
	);
	const selectedFloors = useSelector(state => persistedState(state).selectedFloors);
	const canView = feed ? feed.canView : true;
	const alerts = useSelector(state => alertSelector(state));
	const filters = useSelector(state => mapFiltersById(state));
	const userFeed = useSelector(state => userIntegrationByFeedIdSelector(props.feedId)(state));
	const feedEntityType = feed ? feed.entityType : "track";
	const userFeedEntityType = userFeed ? userFeed.entityType : "track";
	const feedEntType = replayMap ? feedEntityType : userFeedEntityType;
	const mapIconTemplate = feed ? feed.mapIconTemplate : null;
	const mapTools = {};
	const labelsVisible = replayMap && settings.entityLabels ? settings.entityLabels.visible : true;
	const style = settings.mapStyle;

	const playBarValue = useSelector(state => state.playBar.playBarValue);
	const timeData = useSelector(state => getInitialPlayBarData && getInitialPlayBarData(playBarValue, state.replay.timeTransactions));

	const data = useSelector(state => {
		if (replayMap) {
			if (timeData) {
				const _data = [];
				for (const key in timeData) {
					if ((props.feedId === "fovs" && timeData[key].entityData.properties.type === "FOV") ||
						(timeData[key].feedId === props.feedId && timeData[key].entityData.properties.type !== "FOV")) {
						// -- ignore deleted entities so they won't be displayed on the map
						if (!timeData[key].isDeleted) {
							_data.push(timeData[key]);
						}
					}
				}
				return _data;
			} else {
				return [];
			}
		} else {
			return layerSourcesSelector(state, props);
		}
	}, shallowEqual);

	return <MapLayer
		map={map}
		feedId={feedId}
		data={data}
		feedEntType={feedEntType}
		selectedFloors={selectedFloors}
		mapTools={mapTools}
		style={style}
		labelsVisible={labelsVisible}
		disabledFeeds={disabledFeeds}
		alerts={alerts}
		filters={filters}
		mapIconTemplate={mapIconTemplate}
		canView={canView}
		loadProfileOffline={loadProfileOffline}
		interactiveFeatures={interactiveFeatures === undefined ? true : interactiveFeatures}
	/>;

};

const MapLayer = memo(({
	map,
	feedId,
	loadProfileOffline,
	data,
	feedEntType,
	selectedFloors,
	mapTools,
	style,
	labelsVisible,
	disabledFeeds,
	alerts,
	filters,
	mapIconTemplate,
	canView,
	interactiveFeatures
}) => {

	const dispatch = useDispatch();

	const [styleLoaded, setStyleLoaded] = useState(true);
	const [selectedEntityId, setSelectedEntityId] = useState(null);

	const dataRef = useRef(data);
	useEffect(() => {
		dataRef.current = data;
		if (selectedEntityId) {
			const currentEntity = dataRef.current.find((e) => e.id === selectedEntityId);
			if (currentEntity) {
				dispatch(updateContext(currentEntity.id, currentEntity));
			}
		}
	}, [data]);

	useEffect(() => {
		const entities = _.compact(_.values(data));
		const filteredData = entities.filter(entity => {
			if (feedEntType === "camera" && entity.entityData.displayType === "facility" || feedEntType === "accessPoint" && entity.entityData.displayType === "facility") {
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
			} else if (feedEntType === "track") {
				return entity.isActive === undefined || entity.isActive === true;
			} else { return true; }
		});
		// Update rendered map entities
		dispatch(setMapEntities({ [feedId]: filteredData.reduce((a, b) => (a[b.id] = b, a), {}) }));
		dispatch(setMapEntitiesLocal({ [feedId]: filteredData.reduce((a, b) => (a[b.id] = b, a), {}) }));

		// Change cursor to pointer when over an entity
		map.on("mousemove", e => {
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
		});

		// Order layers properly
		map.on("styledata", e => {
			handleReorder(e);
		});

		if (interactiveFeatures) {
			map.on("click", e => handleFeatureClick(e));
			map.on("touchend", e => handleFeatureClick(e));
			map.on("click", feedId + "-clusters", e => handleClusterClick(e));
			map.on("touchend", feedId + "-clusters", e => handleClusterClick(e));
		}
		renderAlerts();

	}, []);

	useEffect(() => {
		return (() => {
			dispatch(setMapEntities({ [feedId]: {} }));
		});
	}, []);



	function updateComponent() {

		const entities = _.compact(_.values(data));
		const filteredData = entities.filter(entity => {
			if (feedEntType === "camera" && entity.entityData.displayType === "facility" || feedEntType === "accessPoint" && entity.entityData.displayType === "facility") {
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
			} else if (feedEntType === "track") {
				return entity.isActive === undefined || entity.isActive === true;
			} else { return true; }
		});
		// Update rendered map entities
		dispatch(setMapEntities({ [feedId]: filteredData.reduce((a, b) => (a[b.id] = b, a), {}) }));
		dispatch(setMapEntitiesLocal({ [feedId]: filteredData.reduce((a, b) => (a[b.id] = b, a), {}) }));
		// Make sure that clusters from any feed are at the top of the layer stack
		if (map.getLayer(feedId + "-alert-badge")) { map.moveLayer(feedId + "-alert-badge"); }
		if (map.getLayer(feedId + "-clusters")) { map.moveLayer(feedId + "-clusters"); }
		if (map.getLayer(feedId + "-cluster-count")) { map.moveLayer(feedId + "-cluster-count"); }

		/*
		 * Prevent layer loading errors on style reload
		 * FIXME: Find a sustainable way to remove and add user-defined layers on style change
		 */


		setTimeout(() => setStyleLoaded(true), 10);

	}

	updateComponent();

	function handleReorder(e) {
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
				if (map.getLayer(feedId + "-alert-badge")) { map.moveLayer(feedId + "-alert-badge"); }
				if (map.getLayer(feedId + "-clusters")) { map.moveLayer(feedId + "-clusters"); }
				if (map.getLayer(feedId + "-cluster-count")) { map.moveLayer(feedId + "-cluster-count"); }
				if (map.getLayer("alerts")) { map.moveLayer("alerts"); }
			});
		}
	}

	// Handle entity click/touch interactions
	const handleFeatureClick = e => {
		let features = map
			.queryRenderedFeatures(e.point)
			.filter(feature => feature.source !== "composite");

		// Prevent click through on cluster click
		if (
			_.find(features, feature => _.includes(feature.layer.id, "cluster"))
		) {
			return;
		}

		// TODO: CB2-2731 -- Refactor the layer ordering so that this code isn't needed [see comment below]
		const types = features.map(feature => feature.layer.type);
		const includesFill = types.includes("fill");
		const includesOther = types.some(type => {
			return type !== "fill";
		});

		// If a click contains multiple features, with at least one fill and one other type, ignore the fill
		if (types.length > 1 && includesFill && includesOther) {
			features = features.filter(feature => feature.layer.type !== "fill");
		}
		// If a click contains only fills (shapes), prioritize the smallest one
		else if (features.length > 1 && includesFill && !includesOther) {
			// Add area to features
			features.forEach(feat => {
				if (feat.layer.type === "fill") {
					feat.properties.area = area(feat);
				}
			});

			const smallestArea = features.reduce((previous, current) => {
				return previous.properties.area < current.properties.area
					? previous
					: current;
			});
			features = [smallestArea];
		}

		// Find feature based on layer hierarchy
		// Exclude FOVs
		const feature = _.find(
			features,
			feature =>
				_.includes(feature.layer.id, feedId) &&
				!_.includes(feature.layer.id, "fov") &&
				!_.includes(feature.layer.id, "draw") &&
				(_.includes(feature.layer.id, "symbol") ||
					_.includes(feature.layer.id, "line") ||
					_.includes(feature.layer.id, "fill"))
		);
		// Load profile
		if (
			feature &&
			!mapTools.type
		) {

			const entity = feature.properties;
			setSelectedEntityId(entity.id);
			const currentEntity = dataRef.current.find((e) => e.id === entity.id);
			dispatch(loadProfileOffline(
				entity.id,
				entity.name ? entity.name : entity.id,
				entity.entityType || "shapes",
				currentEntity,
				"profile",
				"primary"
			));
		}
	};

	// Zoom into cluster on click
	function handleClusterClick(e) {

		const pointCount = e.features[0].properties["point_count"];
		// Find next cluster stop level
		const stops = CLUSTER_RADIUS_STOPS;
		const nextStop = stops
			.map(stop => {
				let i = 0;
				stop[0] < pointCount ? i++ : null;
				return i;
			})
			.reduce((a, b) => {
				return a + b;
			});
		const filterStop = stops.filter(stop => {
			return stops.indexOf(stop) === nextStop - 1;
		});
		// calculate diameter of circle
		const diameter = filterStop[0][1] * 2;
		// get center of cluster
		const center = e.lngLat;
		// convert lngLat to point and calculate new bounds from center
		let coordsA = map.project(center);
		let coordsB = map.project(center);
		coordsA = { x: coordsA.x - diameter, y: coordsA.y + diameter };
		coordsB = { x: coordsB.x + diameter, y: coordsB.y - diameter };
		// convert points back to lngLat
		const bounds = [
			_.values(map.unproject(coordsA)),
			_.values(map.unproject(coordsB))
		];
		map.fitBounds(bounds);
	}


	function renderLayers() {

		const expression = jsonata(mapIconTemplate || "properties.(iconType & '_' & disposition)");
		const entities = _.compact(_.values(data));
		const entityTypes = _.compact(
			_.uniq(_.map(entities, "entityData.geometry.type"))
		);
		const sources = _.map(entityTypes, type => {
			const features = _.map(
				_.filter(entities, entity => {
					if (entity.entityData) {
						if (feedEntType === "camera" && entity.entityData.displayType === "facility" || feedEntType === "accessPoint" && entity.entityData.displayType === "facility") {
							let activated = false;
							if (selectedFloors) {
								Object.keys(selectedFloors).some(facilityId => {
									if (selectedFloors[facilityId] && !disabledFeeds.includes(selectedFloors[facilityId].feedId) && selectedFloors[facilityId].id === entity.entityData.displayTargetId) {
										activated = true;
										return true;
									}
									return false;
								});
							}
							if (!activated) {
								return false;
							}
						} else if (feedEntType === "track") {
							if (entity.isActive === false) { return; }
						}
						// Set correct GeoJSON type for Polygons
						if (entity.entityData.type === "Polygon") { entity.entityData.type = "Feature"; }
						// Expose entityType on feature for loading profile
						if (!entity.entityData.properties) {
							entity.entityData.properties = { id: entity.id };
						}
						if (!entity.entityData.properties.id) {
							entity.entityData.properties.id = entity.id;
						}
						if (!entity.entityData.properties.feedId) {
							entity.entityData.properties.feedId = entity.feedId;
						}
						entity.entityData.properties.entityType = entity.entityType;
						// Add alert prop to feature
						const hasAlert = _.find(
							alerts,
							alert => alert.object.id === entity.entityData.properties.id
						);

						entity.entityData.properties.alert = Boolean(hasAlert);

						// -- set mapIcon based on jsonata expression
						if (mapIconTemplate) {
							if (expression.evaluate(entity.entityData) != "_") {
								entity.entityData.properties.mapIcon = expression.evaluate(entity.entityData);
							}
						}


						if (hasOwn(entity, "controls")) {
							entity.entityData.properties.controls = entity.controls;
						}
					}

					// Make entities group together by type (layers cannot render with mixed GeoJSON types)
					return (
						// Apply collection filter if toggled
						(_.isEmpty(filters) ||
							_.includes(filters, entity.id) ||
							_.includes(filters, entity.parentEntity)) &&
						entity.entityData &&
						entity.entityData.geometry &&
						_.includes(entity.entityData.geometry.type, type) &&
						(entity.entityData.properties &&
							!_.includes(disabledFeeds, entity.entityData.properties.type))
					);
				}),
				entity => {
					// Return entityData for correct GeoJSON format
					return entity.entityData;
				}
			);

			return {
				type, // Returning in order to filter layer styles
				data: {
					type: "FeatureCollection",
					features: features
				}
			};
		});

		const layers = _.map(
			_.filter(sources, source => source.type),
			(source, index) => {
				const isShapeOrLine = !!(source.type === "Polygon" || source.type === "LineString");
				const styles = layerStyles(
					source.type,
					labelsVisible,
					mapTools.feature
				);
				const linePaint = styles.paint.line;
				const symbolLayout = styles.layout.symbol;
				const linePaintProp = linePaint
					? linePaint[
						_.filter(
							_.keys(linePaint), key =>
								_.includes(feedEntType, key)
						)[0]
					]
					: {};

				const layerBefore = `---ac2-${isShapeOrLine ? source.type.toLowerCase() + "s" : "feed-entities"}-position-end`;
				return (
					<Fragment key={index}>
						{feedEntType.toLowerCase() === "track" && renderSilhouettes(index, source)}
						<GeoJSONLayer
							key={feedId + index}
							id={feedId + source.type}
							data={source.data}
							symbolLayout={
								symbolLayout
									? symbolLayout[
										_.filter(_.keys(symbolLayout), key =>
											_.includes(feedEntType, key)
										)[0]
									]
									: {}
							}
							symbolPaint={styles.paint.symbol || {}}
							// Prevents undefined
							linePaint={linePaintProp || {}}
							fillPaint={styles.paint.fill || {}}
							sourceOptions={
								source.type === "Point"
									? {
										cluster: true,
										clusterMaxZoom: 11,
										clusterRadius: 40
									}
									: { cluster: false }
							}
							layerOptions={isShapeOrLine
								? { filter: ["any", ["==", "lineType", "Solid"], ["!has", "lineType"]] }
								: {}}
							before={layerBefore}
						/>
						{source.type === "Point" && renderAlerts()}
						{/* Add dashed and dotted layers for polygons and lines */}
						{isShapeOrLine && dashedDottedLayers(index, source, styles)}
					</Fragment>
				);
			}
		);

		return layers;
	}

	function renderSilhouettes(index, source) {
		const vessels = {};
		source.data.features.forEach(feature => {
			if (["length", "width", "course", "dimA", "dimB", "dimC", "dimD"].every(key => hasOwn(feature.properties, key))) {
				vessels[feature.properties.id] = { entityData: feature };
			}
		});
		return (
			<Fragment key={feedId + index + "-silhouettes"}>
				<VesselPolygons vessels={vessels} />
			</Fragment>
		);
	}

	function renderClusters() {

		const entities = _.compact(_.values(data));

		const entityTypes = _.uniq(_.map(entities, "entityData.geometry.type"));

		const sources = _.map(entityTypes, type => {
			const features = _.map(
				_.filter(
					entities,
					entity =>
						// Make entities group together by type (layers cannot render with mixed GeoJSON types)
						entity.entityData &&
						entity.entityData.geometry &&
						_.includes(entity.entityData.geometry.type, type) &&
						(entity.entityData.properties &&
							!_.includes(disabledFeeds, entity.entityData.properties.type))
				),
				entity => {
					// Return entityData for correct GeoJSON format
					return entity;
				}
			);

			return {
				type, // Returning in order to filter layer styles
				data: {
					type: "FeatureCollection",
					features: features
				}
			};
		});

		const clusters = _.map(
			_.filter(sources, source => source.type && source.type === "Point"),
			(source, index) => {
				return (
					<Fragment key={feedId + index}>
						<Layer
							id={feedId + "-clusters"}
							type="circle"
							sourceId={feedId + source.type}
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
									stops: CLUSTER_RADIUS_STOPS
								}
							}}
							before="---ac2-clusters-position-end"
						/>
						<Layer
							id={feedId + "-cluster-count"}
							type="symbol"
							sourceId={feedId + source.type}
							filter={["has", "point_count"]}
							layout={{
								"text-field": "{point_count_abbreviated}",
								"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
								"text-size": 16,
								"text-allow-overlap": true
							}}
							paint={{
								"text-color": "#FFFFFF"
							}}
							before={feedId + "-clusters"}
						/>
					</Fragment>
				);
			}
		);

		return clusters;
	}

	function renderAlerts() {

		if (
			map &&
			map.getSource(feedId + "Point") &&
			!map.getLayer(feedId + "-alert-badge")
		) {
			map.addLayer({
				id: feedId + "-alert-badge",
				type: "symbol",
				source: feedId + "Point",
				filter: ["==", "alert", true],
				layout: {
					"icon-image": "alert",
					"icon-size": 0.75,
					"icon-offset": [25, -30],
					"icon-allow-overlap": true,
					"text-allow-overlap": true,
					"icon-ignore-placement": true
				}
			});
		}
	}

	// Render dashed and dotted line layers for shape and line layers
	function dashedDottedLayers(index, source, styles) {

		const symbolLayout = styles.layout.symbol.shapes;
		const linePaintDashed = styles.paint.line.dashed;
		const linePaintDotted = styles.paint.line.dotted;
		const lineLayoutDashed = styles.layout.dashed;
		const lineLayoutDotted = styles.layout.dotted;

		return (
			<Fragment>
				<GeoJSONLayer
					key={feedId + index + "-dashed"}
					id={feedId + source.type + "-dashed"}
					data={source.data}
					symbolLayout={symbolLayout}
					symbolPaint={styles.paint.symbol || {}}
					linePaint={linePaintDashed || {}}
					lineLayout={lineLayoutDashed || {}}
					fillPaint={styles.paint.fill || {}}
					sourceOptions={{ cluster: false }}
					layerOptions={{ filter: ["==", "lineType", "Dashed"] }}
					before={`---ac2-${source.type.toLowerCase() + "s"}-position-end`}
				/>
				<GeoJSONLayer
					key={feedId + index + "-dotted"}
					id={feedId + source.type + "-dotted"}
					data={source.data}
					symbolLayout={symbolLayout}
					symbolPaint={styles.paint.symbol || {}}
					linePaint={linePaintDotted || {}}
					lineLayout={lineLayoutDotted || {}}
					fillPaint={styles.paint.fill || {}}
					sourceOptions={{ cluster: false }}
					layerOptions={{ filter: ["==", "lineType", "Dotted"] }}
					before={`---ac2-${source.type.toLowerCase() + "s"}-position-end`}
				/>
			</Fragment>
		);
	}

	return data && styleLoaded && canView ? (
		<Fragment>
			{renderLayers()}
			{renderClusters()}
		</Fragment>
	) : (
		<div />
	);
}, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});

MapLayer.displayName = "MapLayer";

export default MapLayerwrapper;