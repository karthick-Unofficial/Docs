import React, { Component, Fragment, useState, useEffect } from "react";
import { GeoJSONLayer, Layer } from "react-mapbox-gl";
import area from "@turf/area";

import { layerStyles } from "./layerStyles";
import { VesselPolygons } from "orion-components/Map/Layers";
import _ from "lodash";
import { captureUserInteraction } from "orion-components/Apm";

const jsonata = require("jsonata");
const CLUSTER_RADIUS_STOPS = [[0, 20], [100, 30], [750, 40]];

const MapLayer = ({
	map,
	feedId,
	loadProfile,
	data,
	setMapEntities,
	feedEntType,
	selectedFloors,
	mapTools,
	style,
	labelsVisible,
	disabledFeeds,
	alerts,
	filters,
	mapIconTemplate,
	renderSilhouette,
	clusteringEnabled,
	clusterMaxZoomLevel,
	silhouetteMinZoomLevel,
	canView,
	userFacilities
}) => {
	const [styleLoaded, setStyleLoaded] = useState(true);
	const [handlersSet, setHandlersSet] = useState(false);

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
						// inactive floorplans
						if (selectedFloors[facilityId] === null) {
							if (userFacilities) {
								if (userFacilities[facilityId].id === facilityId) {
									activated = true;
									return true;
								}
							}
						}
						// inactive floorplans
						return false;
					});
				}
				return activated;
			} else
				return true;
		});

		setMapEntities({ [feedId]: filteredData.reduce((a, b) => (a[b.id] = b, a), {}) });

		// Handle entity click/touch interactions
		const handleFeatureClick = e => {
			captureUserInteraction("MapLayer handleFeatureClick");
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
				loadProfile(
					entity.id,
					entity.name ? entity.name : entity.id,
					entity.entityType || "shapes",
					"profile",
					"primary"
				);
			}
		};

		if (!handlersSet) {
			setHandlersSet(true);
			map.on("click", e => handleFeatureClick(e));
			map.on("touchend", e => handleFeatureClick(e));
			map.on("click", feedId + "-clusters", e => handleClusterClick(e));
			map.on("touchend", feedId + "-clusters", e => handleClusterClick(e));
		}
	}, []);

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
						// inactive floorplans
						if (selectedFloors[facilityId] === null) {
							if (userFacilities) {
								if (userFacilities[facilityId].id === facilityId) {
									activated = true;
									return true;
								}
							}
						}
						// inactive floorplans
						return false;
					});
				}

				return activated;
			} else
				return true;
		});

		// Update rendered map entities
		setMapEntities({ [feedId]: filteredData.reduce((a, b) => (a[b.id] = b, a), {}) });

	}, [feedId, data, setMapEntities, map, feedEntType, selectedFloors]);

	useEffect(() => {
		return () => { setMapEntities({ [feedId]: {} }); };
	}, []);

	// Zoom into cluster on click
	const handleClusterClick = e => {
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
	};

	const renderLayers = () => {
		const expression = jsonata(
			mapIconTemplate ||
			"$exists(properties.(iconType)) and $exists(properties.(disposition)) ? properties.(iconType & '_' & disposition) : null"
		);
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
						}
						// Set correct GeoJSON type for Polygons
						if (entity.entityData.type === "Polygon")
							entity.entityData.type = "Feature";
						// Expose entityType on feature for loading profile
						if (!entity.entityData.properties) {
							entity.entityData.properties = { id: entity.id };
						}
						if (!entity.entityData.properties.id) {
							entity.entityData.properties.id = entity.id;
						}
						entity.entityData.properties.entityType = entity.entityType;
						// Add alert prop to feature
						const hasAlert = _.find(
							alerts,
							alert => alert.object.id === entity.entityData.properties.id
						);

						entity.entityData.properties.alert = Boolean(hasAlert);

						if (!entity.entityData.properties.mapIcon) {
							// -- set mapIcon based on jsonata expression
							const icon = expression.evaluate(entity.entityData);
							if (icon) {
								entity.entityData.properties.mapIcon = icon;
							}
						}

						if (entity.hasOwnProperty("controls"))
							entity.entityData.properties.controls = entity.controls;
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
						{feedEntType.toLowerCase() === "track" && renderSilhouette && renderSilhouettes(index, source, layerBefore)}
						<GeoJSONLayer
							key={feedId + index}
							id={`ac2-${feedId}-${source.type}`}
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
										cluster: clusteringEnabled,
										clusterMaxZoom: clusterMaxZoomLevel,
										clusterRadius: 40
									}
									: { cluster: false }
							}
							layerOptions={isShapeOrLine
								? { filter: ["any", ["==", "lineType", "Solid"], ["!has", "lineType"]] }
								: {}}
							before={layerBefore}
						/>
						{source.type === "Point" && renderAlertBadges(layerBefore)}
						{/* Add dashed and dotted layers for polygons and lines */}
						{isShapeOrLine && dashedDottedLayers(index, source, styles)}
					</Fragment>
				);
			}
		);

		return layers;
	};

	const renderSilhouettes = (index, source, before) => {
		const vessels = {};
		source.data.features.forEach(feature => {
			if (["length", "width", "course", "dimA", "dimB", "dimC", "dimD"].every(key => feature.properties.hasOwnProperty(key))) {
				vessels[feature.properties.id] = { entityData: feature };
			}
		});
		return (
			<Fragment key={feedId + index + "-silhouettes"}>
				<VesselPolygons vessels={vessels} minZoom={silhouetteMinZoomLevel} before={before} />
			</Fragment>
		);
	};

	const renderClusters = () => {

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
							id={`ac2-${feedId}-cluster-count`}
							type="symbol"
							sourceId={`ac2-${feedId}-${source.type}`}
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
							before="---ac2-clusters-position-end"
						/>
						<Layer
							id={`ac2-${feedId}-clusters`}
							type="circle"
							sourceId={`ac2-${feedId}-${source.type}`}
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
							before={`ac2-${feedId}-cluster-count`}
						/>
					</Fragment>
				);
			}
		);

		return clusters;
	};

	const renderAlertBadges = (layerBefore) => {

		return (
			<Layer
				id={`ac2-${feedId}-alert-badge`}
				type="symbol"
				sourceId={`ac2-${feedId}-Point`}
				filter={["==", "alert", true]}
				layout={{
					"icon-image": "alert",
					"icon-size": 0.75,
					"icon-offset": [25, -30],
					"icon-allow-overlap": true,
					"text-allow-overlap": true,
					"icon-ignore-placement": true
				}}
				before={layerBefore}
			/>
		);
	};

	// Render dashed and dotted line layers for shape and line layers
	const dashedDottedLayers = (index, source, styles) => {

		const symbolLayout = styles.layout.symbol.shapes;
		const linePaintDashed = styles.paint.line.dashed;
		const linePaintDotted = styles.paint.line.dotted;
		const lineLayoutDashed = styles.layout.dashed;
		const lineLayoutDotted = styles.layout.dotted;

		return (
			<Fragment>
				<GeoJSONLayer
					key={feedId + index + "-dashed"}
					id={`ac2-${feedId}-${source.type}-dashed`}
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
					id={`ac2-${feedId}-${source.type}-dotted`}
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
	};

	return data && styleLoaded && canView ? (
		<Fragment>
			{renderLayers()}
			{clusteringEnabled && renderClusters()}
		</Fragment>
	) : (
		<div />
	);
};

export default MapLayer;