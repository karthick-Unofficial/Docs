import React, { Fragment, memo, useCallback, useEffect } from "react";
import { Source, Layer } from "react-mapbox-gl";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import circle from "@turf/circle";
import _ from "lodash";
const propTypes = {
	events: PropTypes.array.isRequired,
	setMapEntities: PropTypes.func.isRequired,
	labelsVisible: PropTypes.bool,
	map: PropTypes.object,
	loadProfile: PropTypes.func.isRequired,
	selectedEvent: PropTypes.object
};

const defaultProps = {
	events: [],
	labelsVisible: false,
	map: null,
	loadProfile: () => { },
	setMapEntities: () => { },
	feedId: null,
	selectedEvent: null
};

const getEventProximityGeoJSONPoints = (event) => {
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
		return eventProximityGeoJSON;
	}
};

const Events = ({ events, labelsVisible, map, loadProfile, setMapEntities, selectedEvent }) => {
	useEffect(() => {
		if (events.length) {
			const byFeed = _.groupBy(events, "feedId");
			_.each(
				_.keys(byFeed),
				feed => (byFeed[feed] = _.keyBy(byFeed[feed], "id"))
			);
			_.each(_.keys(byFeed), feed => setMapEntities({ [feed]: byFeed[feed] }));
		}
	}, [events, setMapEntities]);

	useEffect(() => {
		return () => {
			setMapEntities({});
		};
	}, [setMapEntities]);

	const handleClick = useCallback((eventId, eventName) => {
		loadProfile(eventId, eventName, "event", "profile", "secondary");
	}, [loadProfile]);

	const features = [];
	let proximities = [];
	if (events.length) {
		_.each(events, event => {
			if (event.entityData.properties && !event.entityData.properties.id) {
				event.entityData.properties.id = event.id;
			}
			features.push(event.entityData);
		});
	}
	if (selectedEvent && selectedEvent.proximities) {
		proximities = getEventProximityGeoJSONPoints(selectedEvent);
	}
	return events.length && map ? (
		<Fragment>
			<BasicLayer
				labelsVisible={labelsVisible}
				map={map}
				handleClick={handleClick}
				layer={{
					type: "symbol",
					name: "unclustered-events",
					layerTypes: ["symbol"],
					paint: {
						symbol: {
							"text-color": "#000000",
							"text-halo-color": "rgba(255, 255, 255, 1)",
							"text-halo-width": 2
						}
					},
					layout: {
						symbol: {
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
						}
					},
					data: {
						type: "FeatureCollection",
						features
					}
				}}
			/>

			{proximities.length && (
				<div>
					{/* Events Proximity Source */}
					<Source
						id="eventProximitySource"
						geoJsonSource={
							{
								type: "geojson",
								data: {
									type: "FeatureCollection",
									features: proximities
								}
							}
						}
					/>
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
			)}
		</Fragment>
	) : null;
};

Events.propTypes = propTypes;
Events.defaultTypes = defaultProps;

export default memo(Events, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});