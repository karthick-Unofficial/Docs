import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import TrackHistoryInfo from "./TrackHistoryInfo/TrackHistoryInfo";
import _ from "lodash";
const propTypes = {
	map: PropTypes.object,
	trackHistory: PropTypes.object
};

const defaultProps = {
	map: null,
	trackHistory: null
};

const trackHistoryLines = trackHistory => {
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
};

const trackHistoryPoints = trackHistory => {
	const trackHistoryPoints = [];

	_.each(trackHistory, history =>
		_.each(history, entry => {
			entry.entityData.properties["id"] = entry.id;
			entry.entityData.properties["acquisitionTime"] = entry.acquisitionTime;
			trackHistoryPoints.push(entry.entityData);
		})
	);

	return trackHistoryPoints;
};

const TrackHistory = ({ map, trackHistory }) => {
	const trackHistorySourceOptions = {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: trackHistoryLines(trackHistory)
		}
	};

	const trackHistoryPointsSourceOptions = {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: trackHistoryPoints(trackHistory)
		}
	};
	return map ? (
		<Fragment>
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
					<TrackHistoryInfo map={map} trackHistoryContexts={Object.keys(trackHistory)} />
				</Fragment>
			)}
		</Fragment>
	) : null;
};

TrackHistory.propTypes = propTypes;
TrackHistory.defaultTypes = defaultProps;

export default memo(TrackHistory, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});