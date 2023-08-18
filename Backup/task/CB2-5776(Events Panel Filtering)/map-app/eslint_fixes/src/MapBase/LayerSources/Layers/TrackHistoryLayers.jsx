import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import TrackHistoryInfo from "../../TrackHistoryInfo/TrackHistoryInfo";
import each from "lodash/each";
import Map from "lodash/map";
import size from "lodash/size";

const propTypes = {
	map: PropTypes.object,
	trackHistory: PropTypes.object,
	timeFormatPreference: PropTypes.string
};

const TrackHistoryLayers = ({ map, trackHistory, timeFormatPreference }) => {
	const [pointsSource, setPointsSource] = useState(null);
	const [linesSource, setLinesSource] = useState(null);

	useEffect(() => {
		const trackHistoryPoints = [];
		const trackHistoryLines = [];

		each(trackHistory, (history) => {
			// Add points
			each(history, (entry) => trackHistoryPoints.push(entry.entityData));

			// Add lines
			trackHistoryLines.push({
				geometry: {
					type: "LineString",
					coordinates: Map(history, (entry) => entry.entityData.geometry.coordinates)
				}
			});
		});

		setPointsSource({
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: trackHistoryPoints
			}
		});

		setLinesSource({
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: trackHistoryLines
			}
		});
	}, [trackHistory]);

	return (
		<Fragment>
			{size(trackHistory) && (
				<Fragment>
					<Source id="ac2-trackHistorySource" geoJsonSource={linesSource} />
					<Source id="ac2-trackHistoryPointsSource" geoJsonSource={pointsSource} />
					<Layer
						id="ac2-track-history-points"
						type="circle"
						sourceId="ac2-trackHistoryPointsSource"
						paint={{
							"circle-color": "white",
							"circle-radius": 3
						}}
						before="---ac2-track-history-position-end"
					/>
					<Layer
						id="ac2-track-history-lines"
						type="line"
						sourceId="ac2-trackHistorySource"
						layout={{
							"line-join": "round",
							"line-cap": "round"
						}}
						paint={{
							"line-color": "#35b7f3",
							"line-width": 1
						}}
						before="ac2-track-history-points"
					/>
					<TrackHistoryInfo
						map={map}
						trackHistoryContexts={Object.keys(trackHistory)}
						timeFormatPreference={timeFormatPreference ? timeFormatPreference : "12-hour"}
					/>
				</Fragment>
			)}
		</Fragment>
	);
};

TrackHistoryLayers.propTypes = propTypes;

export default TrackHistoryLayers;
