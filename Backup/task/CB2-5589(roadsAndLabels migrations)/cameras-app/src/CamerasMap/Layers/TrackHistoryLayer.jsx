import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Source, Layer } from "react-mapbox-gl";
import map from "lodash/map";
import keys from "lodash/keys";
import each from "lodash/each";
import size from "lodash/size";
import { trackHistorySelector } from "orion-components/ContextualData/Selectors";
import { useSelector } from "react-redux";

const propTypes = {
	map: PropTypes.object
};

const TrackHistoryLayers = () => {
	const trackHistory = useSelector((state) => trackHistorySelector(state));

	const getTrackHistoryGeoJSON = () => {
		const historyGeoJSON = map(keys(trackHistory), (id) => {
			return {
				geometry: {
					type: "LineString",
					coordinates: map(
						trackHistory[id],
						(entry) => entry.entityData.geometry.coordinates
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
	};

	const getTrackHistoryGeoJSONPoints = () => {
		const trackHistoryPoints = [];

		each(trackHistory, (history) =>
			each(history, (entry) => trackHistoryPoints.push(entry.entityData))
		);

		const source = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: trackHistoryPoints
			}
		};
		return source;
	};

	return (
		<Fragment>
			<Source
				id="thLineSource"
				geoJsonSource={getTrackHistoryGeoJSON()}
			/>

			<Source
				id="thPointSource"
				geoJsonSource={getTrackHistoryGeoJSONPoints()}
			/>

			{size(trackHistory) > 0 && (
				<Fragment>
					<Layer
						id="ac2-track-history-points"
						type="circle"
						sourceId="thPointSource"
						paint={{
							"circle-color": "white",
							"circle-radius": 3
						}}
						before="---ac2-track-history-position-end"
					/>

					<Layer
						id="ac2-track-history-lines"
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
						before="ac2-track-history-points"
					/>
				</Fragment>
			)}
		</Fragment>
	);
};

TrackHistoryLayers.propTypes = propTypes;

export default TrackHistoryLayers;
