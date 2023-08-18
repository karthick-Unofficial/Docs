import React, { Fragment, useEffect, useState } from "react";
import { Source, Layer } from "react-mapbox-gl";
import PropTypes from "prop-types";
import circle from "@turf/circle";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";
import filter from "lodash/filter";
import size from "lodash/size";
import each from "lodash/each";

const propTypes = {
	events: PropTypes.object,
	filters: PropTypes.array,
	eventsVisible: PropTypes.bool,
	event: PropTypes.object,
	map: PropTypes.object,
	loadProfile: PropTypes.func
};

const EventLayers = ({ events, filters, eventsVisible, event, map, loadProfile }) => {
	const dispatch = useDispatch();

	const [eventsToDisplay, setEventsToDisplay] = useState({});
	const [clickHandlerAdded, setEventHandlerAdded] = useState(false);
	const [eventsSource, setEventsSource] = useState(null);
	const [proximitiesSource, setProximitiesSource] = useState({});

	useEffect(() => {
		const handleEventClick = (e) => {
			const featureId = e.features[0].properties.id;

			const filtered = filter(events, (entity) => {
				return includes(entity.id, featureId);
			});

			if (!isEmpty(filtered)) {
				const entity = filtered[0];
				dispatch(loadProfile(entity.id, entity.name, "event", "profile", "primary"));
			}
		};

		if (clickHandlerAdded) {
			map.off("click", "ac2-unclustered-events", handleEventClick);
		} else {
			setEventHandlerAdded(true);
		}

		map.on("click", "ac2-unclustered-events", handleEventClick);

		return () => {
			map.off("click", "ac2-unclustered-events", handleEventClick);
		};
	}, [events, clickHandlerAdded]);

	useEffect(() => {
		if (filters.length > 0) {
			filters.forEach((id) => {
				for (const [key, value] of Object.entries(events)) {
					if (id === key) {
						setEventsToDisplay(value);
					} else {
						setEventsToDisplay({});
					}
				}
			});
		} else {
			setEventsToDisplay(events);
		}
	}, [filters, events]);

	useEffect(() => {
		const eventsPoints = [];

		if (size(eventsToDisplay)) {
			each(eventsToDisplay, (ev) => {
				const newEvent = { ...ev };

				if (newEvent.entityData.properties && !newEvent.entityData.properties.id) {
					newEvent.entityData.properties.id = newEvent.id;
				}
				eventsPoints.push(newEvent.entityData);
			});
		}

		setEventsSource({
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: eventsPoints
			}
		});
	}, [eventsToDisplay]);

	useEffect(() => {
		const eventProximityGeoJSON = [];

		// Show selected event's proximities on map
		if (event && event.proximities && event.entityData.geometry && event.entityData.geometry.coordinates) {
			each(event.proximities, (proximity) => {
				let radiusInKM;
				if (proximity.distanceUnits === "mi") {
					radiusInKM = proximity.radius * 1.609344;
				} else {
					radiusInKM = proximity.radius;
				}
				const circleObject = circle(event.entityData.geometry.coordinates, Number(radiusInKM));
				eventProximityGeoJSON.push({
					geometry: {
						coordinates: circleObject.geometry.coordinates,
						type: "Polygon"
					},
					properties: {
						description: "",
						lineType: proximity.lineType,
						lineWidth: proximity.lineWidth,
						name: proximity.name,
						polyFill: proximity.polyFill,
						polyFillOpacity: proximity.polyFillOpacity,
						polyStroke: proximity.polyStroke,
						symbol: null,
						type: "Polygon"
					}
				});
			});
		}

		setProximitiesSource({
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: eventProximityGeoJSON
			}
		});
	}, [event]);

	return (
		<Fragment>
			{eventsVisible && eventsSource && (
				<Fragment>
					<Source id="ac2-eventPointSource" geoJsonSource={eventsSource} />

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

					{event && event.proximities ? (
						<Fragment>
							<Source id="ac2-eventProximitySource" geoJsonSource={proximitiesSource} />
							<Layer
								id="ac2-event-proximities"
								type="fill"
								sourceId="ac2-eventProximitySource"
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
								before="---ac2-event-proximities-position-end"
							/>
							{/* SOLID */}
							<Layer
								id="ac2-event-proximities-outlines"
								type="line"
								sourceId="ac2-eventProximitySource"
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
								before="ac2-event-proximities"
							/>
							{/* DASHED */}
							<Layer
								id="ac2-event-proximities-outlines-dashed"
								type="line"
								sourceId="ac2-eventProximitySource"
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
								before="ac2-event-proximities"
							/>
							{/* DOTTED */}
							<Layer
								id="ac2-event-proximities-outlines-dotted"
								type="line"
								sourceId="ac2-eventProximitySource"
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
								before="ac2-event-proximities"
							/>
						</Fragment>
					) : null}
				</Fragment>
			)}
		</Fragment>
	);
};

EventLayers.propTypes = propTypes;

export default EventLayers;
