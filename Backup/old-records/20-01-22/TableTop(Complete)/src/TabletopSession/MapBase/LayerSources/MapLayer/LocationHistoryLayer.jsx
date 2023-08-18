import _ from "lodash";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import * as mapUtilities from "../../mapUtilities";
import LocationHistoryInfo from "./LocationHistoryInfo";

const propTypes = {
	map: PropTypes.object,
	floorPlan: PropTypes.object,
	locationHistory: PropTypes.object,
	teamsConfig: PropTypes.object,
	currentTime: PropTypes.number,
	simTimePrecision: PropTypes.number
};

const LocationHistoryLayer = ({ map, floorPlan, locationHistory, teamsConfig, currentTime, simTimePrecision }) => {
	if (!locationHistory || currentTime === 0) {
		return null;
	}

	const historyWithLocations = _.values(locationHistory).filter(agentLocations => agentLocations.length > 0);
	const visibleHistory = historyWithLocations.map(agentLocations => {
		const newLocations = [];
		let i = 0;
		while (i < agentLocations.length && agentLocations[i].properties.simTime < currentTime) {
			if (!floorPlan || mapUtilities.isGeometryOnFloorPlan(agentLocations[i].geometry, floorPlan)) {
				newLocations.push(agentLocations[i]);
			}
			i++;
		}
		return newLocations;
	});

	const historyLinesGeoJson = visibleHistory.map(agentLocations => {
		return {
			properties: {
				color: agentLocations.length > 0 ? teamsConfig[agentLocations[0].properties.team].secondaryColor : "#fff"
			},
			geometry: {
				type: "LineString",
				coordinates: agentLocations.map(location => location.geometry.coordinates)
			}
		};
	});

	const historyPointsGeoJson = [];
	visibleHistory.forEach(agentLocations =>
		agentLocations.forEach(location => {
			location.properties.color = teamsConfig[location.properties.team].primaryColor;
			historyPointsGeoJson.push(location);
		})
	);

	const historyLineSource = {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: historyLinesGeoJson
		}
	};

	const historyPointsSource = {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: historyPointsGeoJson
		}
	};
	
	return (
		<Fragment>
			<Source
				id="trackHistoryLinesSource"
				geoJsonSource={historyLineSource}
			/>
			<Source
				id="trackHistoryPointsSource"
				geoJsonSource={historyPointsSource}
			/>
			<Layer
				id="track-history-points"
				type="circle"
				sourceId="trackHistoryPointsSource"
				paint={{
					"circle-color": {
						"type": "identity",
						"property": "color"
					},
					"circle-radius": 5
				}}
			/>
			<Layer
				id="track-history-lines"
				type="line"
				sourceId="trackHistoryLinesSource"
				layout={{
					"line-join": "round",
					"line-cap": "round"
				}}
				paint={{
					"line-color": {
						"type": "identity",
						"property": "color"
					},
					"line-width": 1
				}}
				before="track-history-points"
			/>
			<LocationHistoryInfo map={map} simTimePrecision={simTimePrecision} />
		</Fragment>
	);
};

LocationHistoryLayer.propTypes = propTypes;
export default LocationHistoryLayer;